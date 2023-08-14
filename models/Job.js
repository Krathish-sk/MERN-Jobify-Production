import mongoose from "mongoose";

// Jobs Schema Structure for database
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide an company"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide an position"],
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      maxlength: 50,
      default: "--Job-Location--",
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a valid User"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", JobSchema);
