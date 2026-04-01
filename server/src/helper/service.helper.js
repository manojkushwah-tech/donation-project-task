import { ServiceAvailable } from "../models/index.js";

// ========================= Service Availability Middleware =========================
const isServiceAvailable = (serviceName) => {
  return async (req, res, next) => {
    try {
      const service = await ServiceAvailable.findOne({
        name: serviceName,
        status: true,
      });

      if (!service) {
        return res.status(403).json({
          success: false,
          message: `${serviceName} service is currently unavailable`,
        });
      }

      next();
    } catch (error) {
      // console.error("Service check error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

export default isServiceAvailable;