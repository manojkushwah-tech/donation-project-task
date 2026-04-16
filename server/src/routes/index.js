import express from "express";
import eventRoutes from "./event.route.js";
import committeeRoutes from "./committee.route.js";
import faqRoutes from "./faq.route.js";
import authRoutes from "./auth.route.js";
import paymentRoutes from "./payment.route.js";
import userRoutes from "./user.route.js";
import roomRoutes from "./room.route.js";
import bookingRoutes from "./booking.route.js";
const router = express.Router();

// ========================= Base Route =========================
router.use("/auth", authRoutes);
router.use("/event", eventRoutes);
router.use("/committee", committeeRoutes);
router.use("/faq", faqRoutes);
router.use("/payment", paymentRoutes);
router.use("/user", userRoutes);
router.use("/room", roomRoutes);
router.use("/booking", bookingRoutes);

export default router;