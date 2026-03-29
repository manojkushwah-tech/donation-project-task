import {ServiceAvailable} from "../models/index.js";

// ======================== Check if Service is Available ========================
const isServiceAvailable = (serviceName) => {
    const service = ServiceAvailable.findOne({ name: serviceName, status: true });
    if (!service) {
        return false;
    }
  return true;
};

// ======================== Export Helper Functions ========================
export { isServiceAvailable };