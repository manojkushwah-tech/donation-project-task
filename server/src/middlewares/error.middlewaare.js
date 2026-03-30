import { serverErrorMessage, envTypes } from "../helper/constants.js";
const globalErrorHandler = (err, req, res, next) => {
  console.error("Global Error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: false,
    statusCode,
    msg: err.message || serverErrorMessage,
    stack: process.env.NODE_ENV === envTypes.DEVELOPMENT ? undefined : err.stack,
  });
};

export { globalErrorHandler };
