import express from "express";
import {
  signup,
  login,
  verifyOTP,
  resendOTP,
  forgetPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/zod.validate.middleware.js";
import {
  signupValidator,
  loginValidator,
  verifyOTPValidator,
  resendOTPValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
} from "../validator/auth.validator.js";

const router = express.Router();

// ================= Auth Routes =================
router.post("/signup", validate(signupValidator), signup);
router.post("/verify-otp", validate(verifyOTPValidator), verifyOTP);
router.post("/resend-otp", validate(resendOTPValidator), resendOTP);
router.post("/login", validate(loginValidator), login);
router.post("/forget-password", validate(forgetPasswordValidator), forgetPassword);
router.post("/reset-password", validate(resetPasswordValidator), resetPassword);

export default router;