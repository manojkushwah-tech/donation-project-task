import { createEvent } from "../controllers/event.controller.js";
import express from "express";
// image 

const router = express.Router();
import {validate} from "../middlewares/zod.validate.middleware.js";
import { createEventSchema } from "../validator/event.validator.js";
import {upload} from "../middlewares/upload.middleware.js";
// Create a new event
router.post("/", upload.single("image"), validate(createEventSchema), createEvent);

export default router;
