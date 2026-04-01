import mongoose from "mongoose";
import slugify from "slugify";

// =================================== FAQ Schema =================================
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, unique: true },
    answer: { type: String, required: true, trim: true },
    status: { type: Boolean, default: true },
    slug: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true }
);

// ======================== Pre-save Middleware for Slug Generation ========================
faqSchema.pre("validate", async function () {
  if (this.question && this.isModified("question")) {
    this.slug = slugify(this.question, { lower: true, strict: true });
  }
});

// ======================== Create and Export FAQ Model ========================
const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;