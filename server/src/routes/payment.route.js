import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentDetails,
  getUserPayments,
  getAllPayments,
  updatePaymentStatus,
  refundPayment,
  getPaymentStatistics,
  getPaymentAnalytics,
  exportPaymentReport,
  getTopDonors,
  getPaymentSummary,
} from "../controllers/payment.controller.js";
import { verifyUser, verifyAdmin } from "../middlewares/token.verify.middleware.js";
import { validate } from "../middlewares/zod.validate.middleware.js";
import {
  createPaymentOrderValidator,
  verifyPaymentValidator,
  refundPaymentValidator,
  updatePaymentStatusValidator,
} from "../validator/payment.validator.js";

const router = express.Router();

// ================= Public Routes =================

// Create payment order (can be called with or without auth)
router.post(
  "/create-order",
  // Optional auth - removed verifyUser to allow non-authenticated users
  validate(createPaymentOrderValidator),
  createPaymentOrder
);

// Verify payment signature
router.post(
  "/verify-payment",
  validate(verifyPaymentValidator),
  verifyPayment
);

// ================= User Routes =================

// Get user's payments
router.get("/user/my-payments", verifyUser, getUserPayments);

// Get payment details
router.get("/:paymentId", verifyUser, getPaymentDetails);

// ================= Admin Routes =================

// Get all payments (Admin)
router.get("/admin/all-payments", verifyAdmin, getAllPayments);

// Get payment statistics (Admin)
router.get("/admin/statistics", verifyAdmin, getPaymentStatistics);

// Get payment analytics (Admin)
router.get("/admin/analytics", verifyAdmin, getPaymentAnalytics);

// Export payment report (Admin)
router.get("/admin/export-report", verifyAdmin, exportPaymentReport);

// Get top donors (Admin)
router.get("/admin/top-donors", verifyAdmin, getTopDonors);

// Get payment summary (Admin)
router.get("/admin/summary", verifyAdmin, getPaymentSummary);

// Update payment status (Admin)
router.patch(
  "/admin/:paymentId/status",
  verifyAdmin,
  validate(updatePaymentStatusValidator),
  updatePaymentStatus
);

// Refund payment (Admin)
router.post(
  "/admin/:paymentId/refund",
  verifyAdmin,
  validate(refundPaymentValidator),
  refundPayment
);

export default router;
