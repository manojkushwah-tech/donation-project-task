import asyncHandler from "../utils/asyncHandler.js";
import {
  signupService,
  loginService,
  verifyOTPService,
  resendOTPService,
  forgetPasswordService,
  resetPasswordService,
} from "../services/auth.service.js";
import {
  errorResponse,
  successResponse,
} from "../helper/response.helper.js";

// ================= Signup Controller =================
export const signup = asyncHandler(async (req, res) => {
  const result = await signupService(req.body);
  successResponse(res, result.message, result, 201);
});

// ================= Verify OTP Controller =================
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await verifyOTPService(email, otp);
  successResponse(res, result.message, result);
});

// ================= Resend OTP Controller =================
export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await resendOTPService(email);
  successResponse(res, result.message, result);
});

// ================= Login Controller =================
export const login = asyncHandler(async (req, res) => {
  console.log("wewew");
  const { email, password } = req.body;
  const result = await loginService(email, password);
  console.log("Login result:", result);
  successResponse(res, result.message, result);
});

// ================= Forget Password Controller =================
export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await forgetPasswordService(email);
  successResponse(res, result.message, result);
});

// ================= Reset Password Controller =================
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await resetPasswordService(token, newPassword);
  successResponse(res, result.message, result);
});