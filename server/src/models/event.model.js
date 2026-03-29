import mongoose from "mongoose";
import slugify from "slugify";
import { imageSchema } from "./image.model.js"; 

// =================================== Event Schema =================================
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    content: { type: String, trim: true },
    description: { type: String, trim: true },
    image: imageSchema,
    status: { type: Boolean, default: true },
    slug: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true }
);

// ======================== Pre-save Middleware for Slug Generation ========================
eventSchema.pre("validate", async function () {
  if (this.title && this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

// ======================== Create and Export Event Model ========================
const Event = mongoose.model("Event", eventSchema);
export default Event;