import express from 'express'
const router = express.Router()

import { login, register, updateUser } from '../controllers/authController.js'

import authenticateUser from '../middleware/auth.js'

// for production build - limits the api requests
import rateLimiter from 'express-rate-limit'
const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                  // 10 requests per ip
    message: 'Too man requests from this IP address, please try again after 15 minutes'
})

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/updateUser').patch(authenticateUser, updateUser)

export default router