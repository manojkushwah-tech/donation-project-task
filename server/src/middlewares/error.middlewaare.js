import { serverErrorMessage, envTypes } from "../helper/constants.js";
import dotenv from "dotenv";
dotenv.config();
const globalErrorHandler = (err, req, res, next) => {
  // console.error("Global Error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: false,
    statusCode,
    message: err.message || serverErrorMessage, // cp
    stack: process.env.NODE_ENV === envTypes.DEVELOPMENT ? err.stack : undefined,
  });
};

export { globalErrorHandler };
