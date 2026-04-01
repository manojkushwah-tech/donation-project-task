import { z } from "zod";

// ================= Signup Validation =================
export const signupValidator = z.object({
  firstname: z
    .string()
    .min(2, "Firstname must be at least 2 characters")
    .max(50, "Firstname must be at most 50 characters")
    .trim(),
  lastname: z
    .string()
    .min(2, "Lastname must be at least 2 characters")
    .max(50, "Lastname must be at most 50 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number format")
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),
});

// ================= Login Validation =================
export const loginValidator = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required"),
});

// ================= Verify OTP Validation =================
export const verifyOTPValidator = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

// ================= Resend OTP Validation =================
export const resendOTPValidator = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
});

// ================= Forget Password Validation =================
export const forgetPasswordValidator = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
});

// ================= Reset Password Validation =================
export const resetPasswordValidator = z.object({
  token: z
    .string()
    .min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),
});