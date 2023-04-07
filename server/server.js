import express from 'express'
import dotenv from 'dotenv'
import 'express-async-errors' // passes the errors to the middleware without the use of next.
import morgan from 'morgan'


// for build - production ready
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'
// for build - security packages
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

// DB and AuthenticateUser
import connectDB from './db/connect.js'

// routers
import authRoutes from './routers/authRoutes.js'
import jobsRoutes from './routers/jobsRoutes.js'

// Middlewares
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'

const app = express()
dotenv.config()

const port = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// for production
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname, './client/build')))

app.use(express.json())

// for build - security packages
app.use(helmet())         // secure headers
app.use(xss())            // to sanitize inputs and prevent cross-site scripting attacks
app.use(mongoSanitize())  // prevents mongo db operator injection

app.get('/', (req, res) => {
  res.send('welcome!')
})

app.get('/api/v1', (req, res) => {
  res.json({ msg: 'welcome' })
})

app.use('/api/v1/auth', authRoutes)

app.use('/api/v1/jobs', authenticateUser, jobsRoutes)

// for production
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`server is listening on ${port}`);
    })
  } catch (error) {
    console.log(error)
  }
}

start()