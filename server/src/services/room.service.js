import ApiError from "../utils/ApiError.js";
import { Room } from "../models/index.js";
import { httpStatus } from "../helper/constants.js";

export const createRoomService = async (data, userId) => {
  try {
    const room = new Room({ ...data, createdBy: userId });
    await room.save();

    return {
      message: "Room created successfully",
      room,
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to create room", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const getRoomsService = async ({ page = 1, limit = 20, search, city, roomType, minPrice, maxPrice, isActive = true, sortBy = "-createdAt" }) => {
  try {
    const query = {};

    if (search) {
      query.$text = { $search: search.trim() };
    }

    if (city) {
      query["address.city"] = new RegExp(city.trim(), "i");
    }

    if (roomType) {
      query.roomType = roomType;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.pricePerNight = {};
      if (minPrice !== undefined) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "false" ? false : true;
    }

    const skip = (Math.max(Number(page), 1) - 1) * Math.max(Number(limit), 1);
    const [rooms, totalRecords] = await Promise.all([
      Room.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(Math.max(Number(limit), 1))
        .lean(),
      Room.countDocuments(query),
    ]);

    return {
      message: "Rooms fetched successfully",
      rooms,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalRecords / Math.max(Number(limit), 1)),
        totalRecords,
        limit: Number(limit),
      },
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to fetch rooms", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const getRoomService = async (roomId) => {
  try {
    const room = await Room.findById(roomId).lean();

    if (!room) {
      throw new ApiError("Room not found", httpStatus.NOT_FOUND);
    }

    return {
      message: "Room fetched successfully",
      room,
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to fetch room details", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const updateRoomService = async (roomId, updateData) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError("Room not found", httpStatus.NOT_FOUND);
    }

    Object.assign(room, updateData);
    await room.save();

    return {
      message: "Room updated successfully",
      room,
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to update room", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const deleteRoomService = async (roomId) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError("Room not found", httpStatus.NOT_FOUND);
    }

    room.isActive = false;
    await room.save();

    return {
      message: "Room deactivated successfully",
      room,
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to delete room", httpStatus.INTERNAL_SERVER_ERROR);
  }
};