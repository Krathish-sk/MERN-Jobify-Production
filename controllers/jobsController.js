import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import moment from "moment";
import Job from "../models/Job.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";

// Create an Job
export const createJob = async (req, res) => {
  const { company, position } = req.body;

  // Check for empty Input fields
  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

// Delete an Job
export const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });

  // if no job found
  if (!job) {
    throw new NotFoundError("No job found!");
  }

  checkPermissions(req.user, job.createdBy);

  await Job.deleteOne({ _id: jobId });

  res.status(StatusCodes.OK).json({ msg: "Success! Job removed" });
};

// Get all Jobs
export const getAllJobs = async (req, res) => {
  const { status, jobType, search, sort } = req.query;
  const queryObject = { createdBy: req.user.userId };

  // Check if the status is {all,pending, interveiw or declined}
  if (status !== "all") {
    queryObject.status = status;
  }

  //Check if the jobType is {all, full-time, part-time....}
  if (jobType !== "all") {
    queryObject.jobType = jobType;
  }

  // Check for search conditions
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  //   // No await becauze we have to sort the jobs
  let result = Job.find(queryObject);

  // Chain sort condition and check for sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  // SetUp Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numberOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numberOfPages });
};

// Update an Job
export const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  // Check for empty input fields
  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }

  const job = await Job.findOne({ _id: jobId });

  // If no job found
  if (!job) {
    throw new NotFoundError("No job found !!");
  }

  // Check permissions
  checkPermissions(req.user, job.createdBy);

  const updateJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updateJob });
};

//  Show all job stats
export const showStats = async (req, res) => {
  // Aggregate stats
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  //Reduce the stats to the required format
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  // In case of no values in stats
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  // Aggrigate monthlyApplications
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  // Change the format of monthlyApplication
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      //accepts 0-11
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
