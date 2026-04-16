import ApiError from "../utils/ApiError.js";
import { Booking, Room } from "../models/index.js";
import { httpStatus } from "../helper/constants.js";

export const isRoomAvailable = async ({ roomId, checkInDate, checkOutDate }) => {
  const room = await Room.findById(roomId);
  if (!room || !room.isActive) {
    return false;
  }

  const bookingCount = await Booking.countDocuments({
    room: roomId,
    status: { $in: ["PENDING", "CONFIRMED"] },
    $or: [
      {
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate },
      },
    ],
  });

  return bookingCount < room.totalRooms;
};

export const createBookingService = async (data, userId) => {
  try {
    const { roomId, checkInDate, checkOutDate, totalGuests, totalPrice, note } = data;
    const room = await Room.findById(roomId);

    if (!room || !room.isActive) {
      throw new ApiError("Room is not available", httpStatus.BAD_REQUEST);
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      throw new ApiError("Check-out date must be after check-in date", httpStatus.BAD_REQUEST);
    }

    if (totalGuests > room.maxGuests) {
      throw new ApiError(`Maximum guests allowed is ${room.maxGuests}`, httpStatus.BAD_REQUEST);
    }

    const available = await isRoomAvailable({ roomId, checkInDate: new Date(checkInDate), checkOutDate: new Date(checkOutDate) });
    if (!available) {
      throw new ApiError("Room is not available for the selected dates", httpStatus.BAD_REQUEST);
    }

    const booking = new Booking({
      user: userId,
      room: roomId,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      totalGuests,
      totalPrice,
      note,
    });

    await booking.save();

    return {
      message: "Booking created successfully",
      booking,
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to create booking", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const getBookingService = async (bookingId, userId, isAdmin = false) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate("room")
      .populate("user", "firstname lastname email phone")
      .lean();

    if (!booking) {
      throw new ApiError("Booking not found", httpStatus.NOT_FOUND);
    }

    const bookingUserId = booking.user?._id?.toString() || booking.user?.toString();
    if (!isAdmin && bookingUserId !== userId.toString()) {
      throw new ApiError("Access denied", httpStatus.FORBIDDEN);
    }

    return {
      message: "Booking fetched successfully",
      booking,
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to fetch booking", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const getUserBookingsService = async ({ userId, page = 1, limit = 20, status }) => {
  try {
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const skip = (Math.max(Number(page), 1) - 1) * Math.max(Number(limit), 1);
    const [bookings, totalRecords] = await Promise.all([
      Booking.find(query)
        .populate("room")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Math.max(Number(limit), 1))
        .lean(),
      Booking.countDocuments(query),
    ]);

    return {
      message: "User bookings fetched successfully",
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalRecords / Math.max(Number(limit), 1)),
        totalRecords,
        limit: Number(limit),
      },
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to fetch bookings", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const getAllBookingsService = async ({ page = 1, limit = 20, status, roomId, userId, sortBy = "-createdAt" }) => {
  try {
    const query = {};
    if (status) query.status = status;
    if (roomId) query.room = roomId;
    if (userId) query.user = userId;

    const skip = (Math.max(Number(page), 1) - 1) * Math.max(Number(limit), 1);
    const [bookings, totalRecords] = await Promise.all([
      Booking.find(query)
        .populate("room")
        .populate("user", "firstname lastname email phone")
        .sort(sortBy)
        .skip(skip)
        .limit(Math.max(Number(limit), 1))
        .lean(),
      Booking.countDocuments(query),
    ]);

    return {
      message: "Bookings fetched successfully",
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalRecords / Math.max(Number(limit), 1)),
        totalRecords,
        limit: Number(limit),
      },
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to fetch bookings", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const cancelBookingService = async (bookingId, userId, isAdmin = false) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError("Booking not found", httpStatus.NOT_FOUND);
    }

    if (!isAdmin && booking.user.toString() !== userId.toString()) {
      throw new ApiError("Access denied", httpStatus.FORBIDDEN);
    }

    if (booking.status === "CANCELLED") {
      throw new ApiError("Booking is already cancelled", httpStatus.BAD_REQUEST);
    }

    booking.status = "CANCELLED";
    await booking.save();

    return {
      message: "Booking cancelled successfully",
      booking,
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to cancel booking", httpStatus.INTERNAL_SERVER_ERROR);
  }
};