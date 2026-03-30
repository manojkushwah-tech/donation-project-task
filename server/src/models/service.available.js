import mongoose from "mongoose";
import { imageSchema } from "./image.model.js";

// ======================== Service Available Schema ========================
const serviceAvailableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Service name is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    images: [imageSchema],
}, { timestamps: true });

// ======================== Export Service Available Model ========================
const ServiceAvailable = mongoose.model("ServiceAvailable", serviceAvailableSchema);

export default ServiceAvailable;