import mongoose from "mongoose";
import slugify from "slugify";
import { imageSchema } from "./image.model.js";

// =================================== Committee Schema =================================
const committeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    designation: { type: String, trim: true },
    image: imageSchema,
    status: { type: Boolean, default: true },
    slug: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true }
);

// ======================== Pre-save Middleware for Slug Generation ========================
committeeSchema.pre("validate", async function () {
  if (this.name && this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

// ======================== Create and Export Committee Model ========================
const Committee = mongoose.model("Committee", committeeSchema);
export default Committee;