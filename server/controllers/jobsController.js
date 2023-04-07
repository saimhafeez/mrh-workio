import { BadRequestError, NotFoundError } from '../errors/index.js'
import { StatusCodes } from 'http-status-codes';
import Job from '../models/Job.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment'

const createJob = async (req, res) => {
    // res.send("create job");

    const { position, company } = req.body;

    if (!position || !company) {
        throw new BadRequestError('Provide all Required Values');
    }

    req.body.createdBy = req.user.userId

    console.log(req.body)

    const job = await Job.create(req.body);

    res.status(StatusCodes.CREATED).json({ job })

}

// const getAllJobs = async (req, res) => {
//     const jobs = await Job.find({ createdBy: req.user.userId });
//     res.status(StatusCodes.OK).json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
// }

const getAllJobs = async (req, res) => {
    const { search, status, jobType, sort } = req.query;

    const queryObject = {
        createdBy: req.user.userId
    }


    // add stuff based on condition
    if (status && status !== 'all') {
        queryObject.status = status
    }

    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType
    }

    if (search) {
        queryObject.position = { $regex: search, $options: 'i' }
    }

    // no await because we will chain conditions later and then get the result via await
    let result = Job.find(queryObject)

    // chain sort conditions
    if (sort == 'latest') {
        result = result.sort('-createdAt')
    }

    if (sort == 'oldest') {
        result = result.sort('createdAt')
    }

    if (sort == 'a-z') {
        result = result.sort('position')
    }

    if (sort == 'z-a') {
        result = result.sort('-position')
    }

    // pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    result = result.skip(skip).limit(limit)


    const jobs = await result;

    const totalJobs = await Job.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs / limit)

    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
}

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params;

    const job = await Job.findById({ _id: jobId });

    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`);
    }

    console.log('job', job);

    checkPermissions(req.user, job.createdBy)

    // await job.remove();  // not working for some unknown reason
    await Job.deleteOne({ _id: jobId })
    res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' })
}

const updateJob = async (req, res) => {
    console.log(req.params)
    const { id: jobId } = req.params;
    const { company, position } = req.body;

    if (!position || !company) {
        throw new BadRequestError('Please provide all values');
    }
    const job = await Job.findOne({ _id: new mongoose.Types.ObjectId(jobId) });

    // Alterative Approach: findOneAndUpdate does not trigger the hook, although we don't a hook in model but even if we do, due to findOneAndUpdate it will not invoke
    // job.position = position
    // job.company = company

    // await job.save();

    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    // check permissions

    checkPermissions(req.user, job.createdBy)



    const updatedJob = await Job.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(jobId) },
        req.body,
        {
            new: true,
            runValidators: true
        }
    )

    res.status(StatusCodes.OK).json({ updatedJob })
}

const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ])

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count;
        return acc
    }, {})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        // sort:: latest jobs first
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        // limit:: returns data of last 6 months
        { $limit: 6 }
    ]);

    monthlyApplications = monthlyApplications.map((item) => {
        const {
            _id: { year, month },
            count
        } = item

        // moment counts months from 0 - 11, while in mongoose it counts from 1 - 12, hence using 'month - 1'
        const date = moment().month(month - 1).year(year).format('MMM Y')
        return { date, count }
    }).reverse()

    // reversing it, because in case of charts we need to send the oldest month.. charts display data from oldest to newest, so array will be forwarded in the reverse way..

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export { createJob, getAllJobs, deleteJob, updateJob, showStats }