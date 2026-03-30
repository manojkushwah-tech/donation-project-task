import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import { errorResponse } from "../helper/response.helper.js";
import { httpStatus, userMessages, adminMessages } from "../helper/constants.js";
import dotenv from "dotenv";
dotenv.config();
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  return authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
};

/* ================= USER AUTH ================= */

export const verifyUser = async (req, res, next) => {
  try {

    const token = extractToken(req);
    // console.log("Extracted Token:", token); // Debugging line
    if (!token) {
      // console.log("No token found in request headers."); // Debugging line
      return errorResponse(res, userMessages.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    }
    // console.log("Verifying token..."); // Debugging line
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Token verified. Decoded payload:", decoded); // Debugging line
    const user = await User.findById(decoded.userId);
    // console.log("User fetched from DB:", user); // Debugging line 
    if (!user) {
      // console.log("User not found or invalid."); // Debugging line
      return errorResponse(res, userMessages.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    // console.log("Error during token verification:", error); // Debugging line
    return errorResponse(res, userMessages.INVALID_TOKEN, httpStatus.UNAUTHORIZED);
  }
};

/* ================= ADMIN AUTH ================= */

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return errorResponse(res, adminMessages.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    }
    // console.log("Verifying admin token..."); // Debugging line
    // console.log("Admin Token:", token); // Debugging line
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    // console.log("Admin Token verified. Decoded payload:", decoded); // Debugging line
    const admin = await Admin.findById(decoded.admin._id);
    // console.log("Admin fetched from DB:", admin); // Debugging line
    if (!admin || admin.role !== "admin") {
      // console.log("Admin not found or invalid."); // Debugging line
      return errorResponse(res, adminMessages.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    }
    // console.log("Admin fetched from DB:", admin); // Debugging line
    req.admin = admin;
    next();
  } catch (error) {
    return errorResponse(res, adminMessages.INVALID_TOKEN || error.message, httpStatus.UNAUTHORIZED);
  }
};
