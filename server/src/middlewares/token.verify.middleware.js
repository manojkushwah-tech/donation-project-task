import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { errorResponse } from "../helper/response.helper.js";
import { httpStatus, userMessages, adminMessages, roles } from "../helper/constants.js";
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
    if (!token) {
      return errorResponse(res, userMessages.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse(res, userMessages.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    }

    if (!user.status) {
      return errorResponse(res, "Account is inactive", httpStatus.UNAUTHORIZED);
    }

    if (!user.isVerified) {
      return errorResponse(res, "Please verify your email first", httpStatus.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, userMessages.INVALID_TOKEN, httpStatus.UNAUTHORIZED);
  }
};

/* ================= ADMIN AUTH ================= */

export const verifyAdmin = async (req, res, next) => {
  console.log("Verifying admin with headers:", req.headers);
  try {
    const token = extractToken(req);
    if (!token) {
      return errorResponse(res, adminMessages.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse(res, adminMessages.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    }

    if (!user.status) {
      return errorResponse(res, "Account is inactive", httpStatus.UNAUTHORIZED);
    }

    if (!user.isVerified) {
      return errorResponse(res, "Please verify your email first", httpStatus.UNAUTHORIZED);
    }

    if (user.role !== roles.ADMIN) {
      return errorResponse(res, "Admin access required", httpStatus.FORBIDDEN);
    }

    req.user = user;
    req.admin = user; // For backward compatibility
    next();
  } catch (error) {
    return errorResponse(res, adminMessages.INVALID_TOKEN, httpStatus.UNAUTHORIZED);
  }
};
