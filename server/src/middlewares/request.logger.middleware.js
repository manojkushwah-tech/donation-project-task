import logger from "../config/logger.config.js";

// ========================= Request Logger Middleware =========================
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      `${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms | IP: ${req.ip}`
    );
  });

  next();
};

export default requestLogger;
