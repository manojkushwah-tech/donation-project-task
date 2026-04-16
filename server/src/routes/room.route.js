import express from "express";
import { verifyAdmin } from "../middlewares/token.verify.middleware.js";
import { validate } from "../middlewares/zod.validate.middleware.js";
import {
  createRoom,
  getRooms,
  getRoomDetails,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";
import { createRoomValidator, updateRoomValidator, checkAvailabilityValidator } from "../validator/room.validator.js";
import { checkRoomAvailability } from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getRooms);
router.post("/", verifyAdmin, validate(createRoomValidator), createRoom);
router.post("/availability", validate(checkAvailabilityValidator), checkRoomAvailability);
router.get("/:roomId", getRoomDetails);
router.patch("/:roomId", verifyAdmin, validate(updateRoomValidator), updateRoom);
router.delete("/:roomId", verifyAdmin, deleteRoom);

export default router;