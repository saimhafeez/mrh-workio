import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide Name'],
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please Provide Email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please Provide a Valid Email'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please Provide Password'],
        minlength: 6,
        select: false
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 20,
        default: 'lastName'
    },
    location: {
        type: String,
        trim: true,
        maxlength: 20,
        default: 'my city'
    }
})

// Invokes right before the save to the database

// important to use old function declearation instead of arrow funtion.

// In case of Async no need to add next in function parameter, like 
// function(next){
//     ...do something
//     next()
// }

// On the other Hand, if it is not moving to next middleware then use next like above

// pre is invoke by User.create and update methods but it does not invoke in case of User.findOneAndUpdate

UserSchema.pre('save', async function () {

    // this.modifiedPaths     // Returns the name of properties that changed

    // since password is 'select: false' there we get illegal string error, because it not getting the password from the document

    if (!this.isModified('password')) {
        return
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // console.log(this.password)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch;
}

export default mongoose.model('User', UserSchema)