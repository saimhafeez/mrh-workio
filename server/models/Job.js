import mongoose from "mongoose";

const JobSchema = mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Please Provide Company Name'],
            maxLength: 50,
        },
        position: {
            type: String,
            required: [true, 'Please Provide Position'],
            maxLength: 100,
        },
        status: {
            type: String,
            enum: ['interview', 'declined', 'pending'],
            default: 'pending',
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'remote', 'internship'],
            default: 'full-time',
        },
        jobLocation: {
            type: String,
            default: 'my city',
            required: true
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please Provide User']
        }
    },
    { timestamps: true }
)

export default mongoose.model('Job', JobSchema)