import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import attachCookies from "../utils/attachCookies.js";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

// Register an User
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  // If there is an empty value from body
  if (!name || !email || !password) {
    throw new BadRequestError("Please fill out all details");
  }

  // If user already exists
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  // Create the user in database
  const user = await User.create({ name, email, password });

  // Token
  const token = user.createJWT();
  // Cookie
  attachCookies({ res, token });

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
    },
    location: user.location,
  });
};

// Login an User
export const login = async (req, res) => {
  const { email, password } = req.body;

  // If there is an empty values from the body
  if (!email || !password) {
    throw new BadRequestError("Please fill out all the fields");
  }

  const user = await User.findOne({ email }).select("+password");

  // If there is no user found !!
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  // Wrong Password case
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  user.password = undefined;

  // Setting up Cookie
  attachCookies({ res, token });

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

// Update an User
export const updateUser = async (req, res) => {
  const { name, email, lastName, location } = req.body;

  // Check for empty values in the body
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values");
  }

  // Get the particular user
  const user = await User.findOne({ _id: req.user.userId });
  user.name = name;
  user.email = email;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  // Create new token for the user after updating the data
  const token = user.createJWT();
  //Create Cookie
  attachCookies({ res, token });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

// Logout User
export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(StatusCodes.OK).json({ msg: "User Logged out!!" });
};
