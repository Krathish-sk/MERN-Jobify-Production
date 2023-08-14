import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;
  // Check for token
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === "64d608a0cea1ce502215b950";
    req.user = { userId: payload.userId, testUser };
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  next();
};

export default auth;
