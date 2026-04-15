import asyncHandler from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../helper/response.helper.js";
import { getUserService } from "../services/user.services.js";
import { httpStatus, roles } from "../helper/constants.js";
import { User } from "../models/index.js";


// ================= Get User Details Controller =================
export const getUserDetails = asyncHandler(async (req, res) => {
    const isAdmin = req.user?.role === roles.ADMIN;
    const userId = isAdmin && req.params.userId ? req.params.userId : req.user._id;
    const result = await getUserService(userId);
    successResponse(res, result.message, result.user, httpStatus.OK);
});

