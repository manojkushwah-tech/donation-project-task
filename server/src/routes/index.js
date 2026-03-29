import express from "express";
import eventRoutes from "./event.route.js";
const router = express.Router();

// Routes
router.use("/events", eventRoutes);

export default router;

