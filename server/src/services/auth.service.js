import { User } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import { authMessages, httpStatus } from "../helper/constants.js";

// ================= Generate OTP =================
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// ================= Generate JWT Token =================
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= Signup Service =================
export const signupService = async (data) => {
  const { firstname, lastname, email, phone, password } = data;

  try {
    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      throw new ApiError(authMessages.EMAIL_EXISTS, httpStatus.CONFLICT);
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      throw new ApiError(authMessages.PHONE_EXISTS, httpStatus.CONFLICT);
    }

    // Create user
    const user = new User({
      firstname,
      lastname,
      email: email.toLowerCase(),
      phone,
      password: await User.prototype.encryptPassword(password),
    });

    // Generate OTP
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    };

    const savedUser = await user.save();

    // Send OTP email
    try {
      await sendEmail({
        to: savedUser.email,
        subject: "Verify Your Email - OTP",
        template: "otp",
        data: { otp, name: `${savedUser.firstname} ${savedUser.lastname}` },
      });
    } catch (emailError) {
      // console.error("Failed to send OTP email:", emailError);
      // Don't throw error, user is created, they can request OTP again
    }

    return {
      message: authMessages.SIGNUP_SUCCESS,
      user: {
        id: savedUser._id,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        email: savedUser.email,
        phone: savedUser.phone,
        isVerified: savedUser.isVerified,
      },
    };
  } catch (error) {
    // console.log("Signup error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(authMessages.SIGNUP_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Verify OTP Service =================
export const verifyOTPService = async (email, otp) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(authMessages.USER_NOT_FOUND, httpStatus.NOT_FOUND);
    }

    if (!user.otp.code || user.otp.expiresAt < new Date()) {
      throw new ApiError(authMessages.OTP_EXPIRED, httpStatus.BAD_REQUEST);
    }

    if (user.otp.code !== otp) {
      throw new ApiError(authMessages.OTP_INVALID, httpStatus.BAD_REQUEST);
    }

    user.isVerified = true;
    user.clearOtp();
    await user.save();

    const token = generateToken(user._id);

    return {
      message: authMessages.VERIFICATION_SUCCESS,
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(authMessages.VERIFICATION_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Resend OTP Service =================
export const resendOTPService = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(authMessages.USER_NOT_FOUND, httpStatus.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new ApiError("User is already verified", httpStatus.BAD_REQUEST);
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    await user.save();

    // Send OTP email
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email - OTP",
        template: "otp",
        data: { otp, name: `${user.firstname} ${user.lastname}` },
      });
    } catch (emailError) {
      throw new ApiError(authMessages.OTP_SEND_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }

    return { message: authMessages.OTP_SENT };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(authMessages.OTP_SEND_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Login Service =================
export const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      throw new ApiError(authMessages.LOGIN_FAILED, httpStatus.UNAUTHORIZED);
    }

    if (!user.status) {
      throw new ApiError(authMessages.USER_INACTIVE, httpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(authMessages.LOGIN_FAILED, httpStatus.UNAUTHORIZED);
    }

    if (!user.isVerified) {
      throw new ApiError(authMessages.USER_NOT_VERIFIED, httpStatus.UNAUTHORIZED);
    }

    const token = generateToken(user._id);

    return {
      message: authMessages.LOGIN_SUCCESS,
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(authMessages.LOGIN_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Forget Password Service =================
export const forgetPasswordService = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(authMessages.USER_NOT_FOUND, httpStatus.NOT_FOUND);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.otp = {
      code: resetToken,
      expiresAt: resetTokenExpiry,
    };

    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        template: "resetPassword",
        data: { resetUrl, name: `${user.firstname} ${user.lastname}` },
      });
    } catch (emailError) {
      throw new ApiError(authMessages.FORGET_PASSWORD_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }

    return { message: authMessages.FORGET_PASSWORD_SUCCESS };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(authMessages.FORGET_PASSWORD_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Reset Password Service =================
export const resetPasswordService = async (token, newPassword) => {
  try {
    const user = await User.findOne({
      "otp.code": token,
      "otp.expiresAt": { $gt: new Date() },
    });

    if (!user) {
      throw new ApiError(authMessages.TOKEN_INVALID, httpStatus.BAD_REQUEST);
    }

    user.password = await user.encryptPassword(newPassword);
    user.clearOtp();
    await user.save();

    return { message: authMessages.RESET_PASSWORD_SUCCESS };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(authMessages.RESET_PASSWORD_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
  }
};