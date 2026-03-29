import winston from "winston";
import path from "path";
import {envTypes} from "../helper/constants.js";
import DailyRotateFile from "winston-daily-rotate-file";
const logDir = "logs";

// =========================== Logger Configuration ===========================
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// ======================= Daily rotate file for errors ======================
const errorTransport = new DailyRotateFile({
  filename: path.join(logDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxSize: "20m",
  maxFiles: "14d",
});

// ====================== Daily rotate file for all logs =======================
const combinedTransport = new DailyRotateFile({
  filename: path.join(logDir, "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
});

// ======================= Create logger instance =======================
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    errorTransport,
    combinedTransport,
  ],
});

// ===================== Add console transport in non-production environments =====================
if (process.env.NODE_ENV !== envTypes.PRODUCTION) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    })
  );
}

export default logger;
