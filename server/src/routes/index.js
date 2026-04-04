import express from "express";
import eventRoutes from "./event.route.js";
import committeeRoutes from "./committee.route.js";
import faqRoutes from "./faq.route.js";
import authRoutes from "./auth.route.js";
const router = express.Router();

// ========================= Base Route =========================
router.use("/auth", authRoutes);
router.use("/event", eventRoutes);
router.use("/committee", committeeRoutes);
router.use("/faq", faqRoutes);


export default router;