import { User } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import { httpStatus } from "../helper/constants.js";

export const getUserService = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password -otp");

    if (!user) {
      throw new ApiError("User not found", httpStatus.NOT_FOUND);
    }

    return {
      message: "User fetched successfully",
      user,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Failed to fetch user details", httpStatus.INTERNAL_SERVER_ERROR);
  }
};
