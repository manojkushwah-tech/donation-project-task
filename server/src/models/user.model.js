import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { roles } from "../helper/constants.js";
import { validationMessages } from "../helper/constants.js";
import { imageSchema } from "./image.model.js";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, validationMessages.REQUIRED_FIELD("Firstname")],
      trim: true,
      minlength: 2,
    },
    lastname: {
      type: String,
      required: [true, validationMessages.REQUIRED_FIELD("Lastname")],
      trim: true,
      minlength: 2,
    },
    avatar: imageSchema,
    email: {
      type: String,
      required: [true, validationMessages.REQUIRED_FIELD("Email")],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, validationMessages.INVALID_FIELD("Email")],
      index: true,
    },
    phone: {
      type: String,
      required: [true, validationMessages.REQUIRED_FIELD("Phone")],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, validationMessages.INVALID_FIELD("Phone")],
      index: true,
    },
    password: {
      type: String,
      required: [true, validationMessages.REQUIRED_FIELD("Password")],
      minlength: 8,
      select: false,
    },
    status: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.USER,
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Encrypt password function
userSchema.methods.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Remove OTP after verification
userSchema.methods.clearOtp = function () {
  this.otp = { code: null, expiresAt: null };
};

const User = mongoose.model("User", userSchema);
export default User;