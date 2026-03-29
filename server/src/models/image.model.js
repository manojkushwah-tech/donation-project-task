import mongoose from "mongoose";

// ======================== Image Schema ========================
const imageSchema = new mongoose.Schema({
      url: {
        type: String,
        required: [true, "Image URL is required"],
        trim: true,
      },
      fileId: {
        type: String,
        required: [true, "Image fileId is required"],
        trim: true,
      }},{ _id: false });

// ======================== Export Image Schema ========================
export { imageSchema };