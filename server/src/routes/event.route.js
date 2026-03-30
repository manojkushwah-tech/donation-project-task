import {
    createEvent,
    getAllEvents,
} from "../controllers/event.controller.js";
import express from "express";
const router = express.Router();
import { validate } from "../middlewares/zod.validate.middleware.js";
import { createEventSchema } from "../validator/event.validator.js";
import { upload } from "../middlewares/upload.middleware.js";
// import { verifyAdmin } from "../middlewares/token.verify.middleware.js";


// ========================= Create Event =========================
router.post(
    "/",
    // verifyAdmin,
    upload.single("image"),
    validate(createEventSchema),
    createEvent
);

// ========================= Get All Events =========================
router.get("/", getAllEvents);

// ========================= Get Event By ID =========================
// router.get("/:id", getEventById);

// ========================= Update Event =========================
// router.put("/:id", verifyAdmin, upload.single("image"), validate(updateEventSchema), updateEvent);

// ========================= Delete Event =========================
// router.delete("/:id", verifyAdmin, deleteEvent);


export default router;
