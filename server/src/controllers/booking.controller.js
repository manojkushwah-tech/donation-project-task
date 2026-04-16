import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../helper/response.helper.js";
import { httpStatus } from "../helper/constants.js";
import {
  createBookingService,
  getBookingService,
  getUserBookingsService,
  getAllBookingsService,
  cancelBookingService,
  isRoomAvailable,
} from "../services/booking.service.js";

export const createBooking = asyncHandler(async (req, res) => {
  const result = await createBookingService(req.validatedData, req.user._id);
  successResponse(res, result.message, result.booking, httpStatus.CREATED);
});

export const getBookingDetails = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === "ADMIN";
  const result = await getBookingService(req.params.bookingId, req.user._id, isAdmin);
  successResponse(res, result.message, result.booking, httpStatus.OK);
});

export const getUserBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const result = await getUserBookingsService({
    userId: req.user._id,
    page,
    limit,
    status,
  });
  successResponse(res, result.message, result, httpStatus.OK);
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, roomId, userId, sortBy } = req.query;
  const result = await getAllBookingsService({
    page,
    limit,
    status,
    roomId,
    userId,
    sortBy,
  });
  successResponse(res, result.message, result, httpStatus.OK);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === "ADMIN";
  const result = await cancelBookingService(req.params.bookingId, req.user._id, isAdmin);
  successResponse(res, result.message, result.booking, httpStatus.OK);
});

export const checkRoomAvailability = asyncHandler(async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.validatedData;
  const available = await isRoomAvailable({
    roomId,
    checkInDate: new Date(checkInDate),
    checkOutDate: new Date(checkOutDate),
  });
  successResponse(res, "Availability checked successfully", { available }, httpStatus.OK);
});