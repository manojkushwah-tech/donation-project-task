import express from "express";
import { verifyUser, verifyAdmin } from "../middlewares/token.verify.middleware.js";
import { validate } from "../middlewares/zod.validate.middleware.js";
import {
  createBooking,
  getBookingDetails,
  getUserBookings,
  getAllBookings,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { createBookingValidator, cancelBookingValidator } from "../validator/booking.validator.js";

const router = express.Router();

router.post("/create", verifyUser, validate(createBookingValidator), createBooking);
router.get("/user/my-bookings", verifyUser, getUserBookings);
router.get("/admin/all-bookings", verifyAdmin, getAllBookings);
router.get("/:bookingId", verifyUser, getBookingDetails);
router.patch("/:bookingId/cancel", verifyUser, validate(cancelBookingValidator), cancelBooking);

export default router;