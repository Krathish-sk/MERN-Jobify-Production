import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Creating the Schema for User Structure
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide an Name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an Email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide an valid Email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide an Password"],
    minlength: 6,
    select: false,
  },
  lastName: {
    type: String,
    default: "--LastName--",
    trim: true,
    maxlength: 20,
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "--Location--",
  },
});

// Hashing the password before saving it to database
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Json webtoken
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Check for login user password matching
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
