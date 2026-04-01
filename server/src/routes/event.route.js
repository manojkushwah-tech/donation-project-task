import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent

} from "../controllers/event.controller.js";
import express from "express";
const router = express.Router();
import { validate } from "../middlewares/zod.validate.middleware.js";
import { createEventSchema, updateEventSchema } from "../validator/event.validator.js";
import { upload } from "../middlewares/upload.middleware.js";
import { verifyAdmin } from "../middlewares/token.verify.middleware.js";


// ============================== Admin Routes ==============================
router.get("/admin", verifyAdmin, getAllEvents);
router.get("/admin/:id", verifyAdmin, getEventById);
router.post("/admin", verifyAdmin, upload.single("image"), validate(createEventSchema), createEvent);
router.put("/admin/:id", verifyAdmin, upload.single("image"), validate(updateEventSchema), updateEvent);
router.delete("/admin/:id", verifyAdmin, deleteEvent);

// ============================== User Routes ==============================
router.get("/", getAllEvents);
router.get("/:id", getEventById);


export default router;
