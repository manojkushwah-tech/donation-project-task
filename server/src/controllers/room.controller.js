import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../helper/response.helper.js";
import { httpStatus } from "../helper/constants.js";
import {
  createRoomService,
  getRoomsService,
  getRoomService,
  updateRoomService,
  deleteRoomService,
} from "../services/room.service.js";

export const createRoom = asyncHandler(async (req, res) => {
  const result = await createRoomService(req.validatedData, req.user._id);
  successResponse(res, result.message, result.room, httpStatus.CREATED);
});

export const getRooms = asyncHandler(async (req, res) => {
  const result = await getRoomsService(req.query);
  successResponse(res, result.message, result, httpStatus.OK);
});

export const getRoomDetails = asyncHandler(async (req, res) => {
  const result = await getRoomService(req.params.roomId);
  successResponse(res, result.message, result.room, httpStatus.OK);
});

export const updateRoom = asyncHandler(async (req, res) => {
  const result = await updateRoomService(req.params.roomId, req.validatedData);
  successResponse(res, result.message, result.room, httpStatus.OK);
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const result = await deleteRoomService(req.params.roomId);
  successResponse(res, result.message, result.room, httpStatus.OK);
});