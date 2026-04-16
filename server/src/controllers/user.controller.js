import asyncHandler from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../helper/response.helper.js";
import { getUserService, getUsersService, updateUserStatusService } from "../services/user.services.js";
import { httpStatus, roles } from "../helper/constants.js";
import { User } from "../models/index.js";


// ================= Get User Details Controller =================
export const getUserDetails = asyncHandler(async (req, res) => {
    const isAdmin = req.user?.role === roles.ADMIN;
    const userId = isAdmin && req.params.userId ? req.params.userId : req.user._id;
    const result = await getUserService(userId);
    successResponse(res, result.message, result.user, httpStatus.OK);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, status, role, sortBy = "-createdAt" } = req.query;
  const result = await getUsersService({
    page: Number(page),
    limit: Number(limit),
    search,
    status,
    role,
    sortBy,
  });
  successResponse(res, result.message, result, httpStatus.OK);
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.validatedData;
  const result = await updateUserStatusService(userId, status);
  successResponse(res, result.message, result.user, httpStatus.OK);
});

