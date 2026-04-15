import asyncHandler from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../helper/response.helper.js";
import {
  createPaymentOrderService,
  verifyPaymentService,
  getPaymentService,
  getAllPaymentsService,
  getUserTransactionsService,
  refundPaymentService,
  updatePaymentStatusService,
  getPaymentAnalyticsService,
} from "../services/payment.service.js";
import { httpStatus } from "../helper/constants.js";
import { Payment } from "../models/index.js";

// ================= USER ROUTES =================

// ================= Create Payment Order Controller =================
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const data = req.validatedData;
  const userId = req.user?._id ? req.user._id : null;
  const result = await createPaymentOrderService(data, userId);
  successResponse(res, result.message, result, httpStatus.CREATED);
});

// ================= Verify Payment Controller =================
export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await verifyPaymentService(req.body);
  successResponse(res, result.message, result, httpStatus.OK);
});

// ================= Get Payment Details Controller =================
export const getPaymentDetails = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const result = await getPaymentService(paymentId);
  successResponse(res, result.message, result.payment, httpStatus.OK);
});

// ================= Get User's Payments Controller =================
export const getUserPayments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, status } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    status,
  };

  // Add user filter
  const payments = await Payment.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip((filters.page - 1) * filters.limit)
    .limit(filters.limit)
    .lean();

  const totalPayments = await Payment.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalPayments / filters.limit);

  successResponse(
    res,
    "User payments fetched successfully",
    {
      payments,
      pagination: {
        currentPage: filters.page,
        totalPages,
        totalRecords: totalPayments,
        limit: filters.limit,
      },
    },
    httpStatus.OK
  );
});

export const getUserTransactions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, type, status } = req.query;
  const result = await getUserTransactionsService({
    userId,
    page: parseInt(page),
    limit: parseInt(limit),
    type,
    status,
  });

  successResponse(res, result.message, result, httpStatus.OK);
});

// ================= ADMIN ROUTES =================

// ================= Get All Payments Controller (Admin) =================
export const getAllPayments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20, sortBy = "-createdAt" } = req.query;

  const filters = {
    status,
    page: parseInt(page),
    limit: parseInt(limit),
    sortBy,
  };

  const result = await getAllPaymentsService(filters);
  successResponse(res, result.message, result, httpStatus.OK);
});

// ================= Update Payment Status Controller (Admin) =================
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const result = await updatePaymentStatusService(paymentId, req.body);
  successResponse(res, result.message, result.payment, httpStatus.OK);
});

// ================= Refund Payment Controller (Admin) =================
export const refundPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { amount, reason } = req.body;
  const result = await refundPaymentService(paymentId, amount, reason);
  successResponse(res, result.message, result.refund, httpStatus.OK);
});

// ================= Payment Statistics Controller (Admin) =================
export const getPaymentStatistics = asyncHandler(async (req, res) => {
  const { dateRange = "30d" } = req.query;

  // Get all payments with filtering
  const filters = {
    page: 1,
    limit: 1000, // Get large number for stats
  };

  const result = await getAllPaymentsService(filters);
  successResponse(res, "Statistics fetched successfully", result.statistics, httpStatus.OK);
});

// ================= Payment Analytics Controller (Admin) =================
export const getPaymentAnalytics = asyncHandler(async (req, res) => {
  const { dateRange = "30d" } = req.query;
  const result = await getPaymentAnalyticsService(dateRange);
  successResponse(res, result.message, result.analytics, httpStatus.OK);
});

// ================= Export Payment Report Controller (Admin) =================
export const exportPaymentReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, format = "json" } = req.query;

  const query = {};
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const payments = await Payment.find(query)
    .populate("user", "firstname lastname email phone")
    .sort({ createdAt: -1 })
    .lean();

  if (format === "csv") {
    // Return CSV format
    let csv = "ID,User,Email,Phone,Amount,Status,Date\n";
    payments.forEach((payment) => {
      csv += `${payment._id},"${payment.user.firstname} ${payment.user.lastname}",${payment.email},${payment.phone},${payment.amount},${payment.status},${new Date(payment.createdAt).toISOString()}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=payment-report.csv");
    return res.send(csv);
  }

  // Default JSON format
  successResponse(res, "Report exported successfully", payments, httpStatus.OK);
});

// ================= Get Top Donors Controller (Admin) =================
export const getTopDonors = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const topDonors = await Payment.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: "$user",
        totalAmount: { $sum: "$amount" },
        totalCount: { $sum: 1 },
        email: { $first: "$email" },
        name: { $first: "$name" },
      },
    },
    { $sort: { totalAmount: -1 } },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
  ]);

  successResponse(res, "Top donors fetched successfully", topDonors, httpStatus.OK);
});

// ================= Get Payment Summary Controller (Admin) =================
export const getPaymentSummary = asyncHandler(async (req, res) => {
  const summary = await Payment.aggregate([
    {
      $facet: {
        totalStats: [
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              totalTransactions: { $sum: 1 },
              averageAmount: { $avg: "$amount" },
            },
          },
        ],
        statusBreakdown: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              amount: { $sum: "$amount" },
            },
          },
        ],
        recentPayments: [
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "userDetails",
            },
          },
        ],
      },
    },
  ]);

  successResponse(
    res,
    "Payment summary fetched successfully",
    summary[0],
    httpStatus.OK
  );
});
