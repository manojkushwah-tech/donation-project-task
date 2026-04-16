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

export const getUsersService = async ({ page = 1, limit = 20, search, status, role, sortBy = "-createdAt" }) => {
  try {
    const query = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { firstname: searchRegex },
        { lastname: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    if (status !== undefined) {
      query.status = status === "false" ? false : true;
    }

    if (role) {
      query.role = role;
    }

    const skip = (Math.max(page, 1) - 1) * Math.max(limit, 1);
    const users = await User.find(query)
      .select("-password -otp")
      .sort(sortBy)
      .skip(skip)
      .limit(Math.max(limit, 1))
      .lean();

    const totalRecords = await User.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / Math.max(limit, 1));

    return {
      message: "Users fetched successfully",
      users,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalRecords,
        limit: Number(limit),
      },
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to fetch users", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserStatusService = async (userId, status) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError("User not found", httpStatus.NOT_FOUND);
    }

    user.status = status;
    await user.save();

    const updatedUser = await User.findById(userId).select("-password -otp");

    return {
      message: "User status updated successfully",
      user: updatedUser,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Failed to update user status", httpStatus.INTERNAL_SERVER_ERROR);
  }
};
