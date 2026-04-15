import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/index.js";
import { errorResponse } from "../helper/response.helper.js";
import { httpStatus, userMessages } from "../helper/constants.js";

dotenv.config();

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  return authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
};

const generateRandomPassword = () => {
  return crypto.randomBytes(16).toString("hex");
};

const normalizeName = (name) => {
  const trimmed = name.trim();
  const parts = trimmed.split(" ");
  return {
    firstname: parts[0] || trimmed,
    lastname: parts.slice(1).join(" ") || "",
  };
};

export const attachOrCreatePaymentUser = async (req, res, next) => {
    console.log("attachOrCreatePaymentUser middleware called");
  try {
    const token = extractToken(req);
    const data = req.validatedData || req.body;
    const email = data.email?.toLowerCase?.().trim();
    const phone = data.phone?.trim();
    const firstName = data.firstName?.trim();
    const lastName = data.lastName?.trim();

    if (!email || !phone || !firstName || !lastName) {
      throw new ApiError("First name, last name, email, and phone are required", httpStatus.BAD_REQUEST);
    }

    if (token) {
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

      if (user.email !== email) {
        throw new ApiError("Authenticated user email does not match payload email", httpStatus.BAD_REQUEST);
      }

      if (user.phone !== phone) {
        throw new ApiError("Authenticated user phone does not match payload phone", httpStatus.BAD_REQUEST);
      }

      req.user = user;
      return next();
    }

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      throw new ApiError("User with this email already exists", httpStatus.CONFLICT);
    }

    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      throw new ApiError("User with this phone already exists", httpStatus.CONFLICT);
    }

    const { firstname, lastname } = normalizeName(`${firstName} ${lastName}`);
    const randomPassword = generateRandomPassword();

    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      password: await new User().encryptPassword(randomPassword),
      isVerified: false,
      status: true,
    });

    await newUser.save();
    req.user = newUser;
    next();
  } catch (error) {
      console.error("Payment User Middleware Error:", error);
    if (error instanceof ApiError) {
      return errorResponse(res, error.message, error.statusCode || httpStatus.BAD_REQUEST);
    }
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return errorResponse(res, userMessages.INVALID_TOKEN, httpStatus.UNAUTHORIZED);
    }

    return errorResponse(res, error.message || "Failed to process payment user", httpStatus.INTERNAL_SERVER_ERROR);
  }
};
