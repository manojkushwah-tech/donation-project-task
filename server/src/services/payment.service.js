import crypto from "crypto";
import { razorpayInstance } from "../config/razorpay.config.js";
import { Payment, Transaction, User } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import { paymentMessages, httpStatus } from "../helper/constants.js";

// ================= Generate Receipt ID =================
const generateReceiptId = () => {
  return `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ================= Verify Razorpay Signature =================
export const verifyRazorpaySignature = (orderId, paymentId, signature, keySecret) => {
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expectedSignature === signature;
};

// ================= Create Transaction Record =================
const createTransactionRecord = async (payload) => {
  const transaction = new Transaction(payload);
  await transaction.save();
  return transaction;
};

// ================= Find or Create Razorpay Customer =================
const findOrCreateRazorpayCustomer = async ({ name, email, phone }) => {
  const normalizedEmail = email.toLowerCase();
  try {
    const customers = await razorpayInstance.customers.all({ email: normalizedEmail });
    if (customers && customers.items && customers.items.length > 0) {
      return customers.items[0];
    }
  } catch (error) {
    // ignore and create a new customer if list lookup fails
  }

  const customer = await razorpayInstance.customers.create({
    name,
    email: normalizedEmail,
    contact: phone,
  });

  return customer;
};

// ================= Create Razorpay Plan =================
const createRazorpayPlan = async ({ amount, description, name }) => {
  const plan = await razorpayInstance.plans.create({
    period: "monthly",
    interval: 1,
    item: {
      name: `${name} Monthly SIP`,
      amount,
      currency: "INR",
      description,
    },
  });

  return plan;
};

// ================= Create Razorpay Subscription =================
const createRazorpaySubscription = async ({ planId, customerId, totalCount, notes }) => {
  const subscription = await razorpayInstance.subscriptions.create({
    plan_id: planId,
    customer_id: customerId,
    total_count: totalCount,
    quantity: 1,
    customer_notify: true,
    notes,
  });

  return subscription;
};

// ================= Create Payment Order Service =================
export const createPaymentOrderService = async (data, userId) => {
  const { name, email, phone, amount
    , type = "DONATION" } = data;
  const paymentType = type.toUpperCase() === "SIP" ? "SIP" : "DONATION";

  try {
    // Validate amount
    if (amount < 1 || amount > 100000) {
      throw new ApiError(paymentMessages.INVALID_AMOUNT, httpStatus.BAD_REQUEST);
    }

    let user = await User.findById(userId);
    let userCreated = false;

    // If user doesn't exist in DB, create a new account
    if (!user) {
      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new ApiError("User with this email already exists", httpStatus.CONFLICT);
      }

      // Password is required for new account creation
      if (!password) {
        throw new ApiError("Password is required for new account creation", httpStatus.BAD_REQUEST);
      }

      const newUser = new User({
        firstname: name.split(" ")[0] || name,
        lastname: name.split(" ").slice(1).join(" ") || "",
        email: email.toLowerCase(),
        phone,
        password: await User.prototype.encryptPassword(password),
        isVerified: true, // Auto-verify for payment users
        status: true,
      });

      user = await newUser.save();
      userCreated = true;
    } else {
      // Verify email match for existing user
      if (user.email !== email.toLowerCase()) {
        throw new ApiError(paymentMessages.ACCOUNT_MISMATCH, httpStatus.BAD_REQUEST);
      }
    }

    const receiptId = generateReceiptId();
    let payment = null;
    let paymentResponse = null;

    if (paymentType === "SIP") {
      const normalizedEmail = email.toLowerCase();
      const razorpayCustomer = await findOrCreateRazorpayCustomer({ name, email: normalizedEmail, phone });
      const plan = await createRazorpayPlan({
        amount: Math.round(amount * 100),
        description: description || "Monthly SIP donation",
        name,
      });

      const totalCount = durationMonths || 12;
      const subscription = await createRazorpaySubscription({
        planId: plan.id,
        customerId: razorpayCustomer.id,
        totalCount,
        notes: {
          userId: user._id.toString(),
          userEmail: normalizedEmail,
          userName: name,
        },
      });

      payment = new Payment({
        user: user._id,
        name,
        email: normalizedEmail,
        phone,
        amount,
        currency: "INR",
        status: "pending",
        type: "SIP",
        description: description || "Monthly SIP donation",
        razorpayCustomerId: razorpayCustomer.id,
        razorpayPlanId: plan.id,
        razorpaySubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionStartAt: subscription.start_at ? new Date(subscription.start_at * 1000) : null,
        subscriptionEndAt: subscription.end_at ? new Date(subscription.end_at * 1000) : null,
        receipt: receiptId,
        metadata: {
          createdBy: "user",
        },
      });

      await payment.save();

      await createTransactionRecord({
        user: user._id,
        payment: payment._id,
        type: "SUBSCRIPTION_CREATED",
        amount,
        currency: "INR",
        status: "created",
        paymentMode: "razorpay",
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: plan.id,
        razorpayCustomerId: razorpayCustomer.id,
        notes: {
          orderType: "SIP",
        },
        details: subscription,
      });

      paymentResponse = {
        type: "SIP",
        subscriptionId: subscription.id,
        planId: plan.id,
        customerId: razorpayCustomer.id,
        shortUrl: subscription.short_url,
        amount: amount,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
        name,
        email: normalizedEmail,
        phone,
      };
    } else {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency: "INR",
        receipt: receiptId,
        description: description || "Payment for donation",
        customer_notify: 1,
        notes: {
          userId: user._id.toString(),
          userEmail: user.email,
          userName: name,
        },
      });

      payment = new Payment({
        user: user._id,
        name,
        email: email.toLowerCase(),
        phone,
        amount,
        currency: "INR",
        razorpayOrderId: razorpayOrder.id,
        receipt: receiptId,
        status: "pending",
        type: "DONATION",
        description: description || "Payment for donation",
        metadata: {
          createdBy: "user",
        },
      });

      await payment.save();

      await createTransactionRecord({
        user: user._id,
        payment: payment._id,
        type: "ORDER_CREATED",
        amount,
        currency: "INR",
        status: "created",
        paymentMode: "razorpay",
        razorpayOrderId: razorpayOrder.id,
        notes: {
          orderType: "DONATION",
        },
        details: razorpayOrder,
      });

      paymentResponse = {
        type: "DONATION",
        orderId: razorpayOrder.id,
        amount: amount,
        currency: "INR",
        receipt: receiptId,
        keyId: process.env.RAZORPAY_KEY_ID,
        name,
        email,
        phone,
      };
    }

    return {
      message: paymentMessages.ORDER_CREATED,
      payment: paymentResponse,
      userId: user._id,
      userCreated,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(paymentMessages.ORDER_CREATION_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Verify Payment Service =================
export const verifyPaymentService = async (data) => {
  const {
    razorpayOrderId,
    razorpaySubscriptionId,
    razorpayPaymentId,
    razorpaySignature,
  } = data;

  try {
    let payment = null;

    if (razorpaySubscriptionId) {
      await razorpayInstance.payments.paymentVerification(
        {
          subscription_id: razorpaySubscriptionId,
          payment_id: razorpayPaymentId,
          signature: razorpaySignature,
        },
        process.env.RAZORPAY_KEY_SECRET
      );

      payment = await Payment.findOne({ razorpaySubscriptionId });
    } else {
      const isSignatureValid = verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        process.env.RAZORPAY_KEY_SECRET
      );

      if (!isSignatureValid) {
        throw new ApiError(paymentMessages.INVALID_SIGNATURE, httpStatus.BAD_REQUEST);
      }

      payment = await Payment.findOne({ razorpayOrderId });
    }

    if (!payment) {
      throw new ApiError(paymentMessages.PAYMENT_NOT_FOUND, httpStatus.NOT_FOUND);
    }

    // Check if payment already processed
    if (payment.status === "completed") {
      throw new ApiError(paymentMessages.PAYMENT_ALREADY_PROCESSED, httpStatus.BAD_REQUEST);
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = "completed";

    if (payment.type === "SIP") {
      payment.subscriptionStatus = "active";
    }

    const updatedPayment = await payment.save();

    await createTransactionRecord({
      user: payment.user,
      payment: payment._id,
      type: payment.type === "SIP" ? "SUBSCRIPTION_AUTHORIZED" : "PAYMENT_COMPLETED",
      amount: payment.amount,
      currency: payment.currency,
      status: "completed",
      paymentMode: "razorpay",
      razorpayOrderId: payment.razorpayOrderId,
      razorpaySubscriptionId: payment.razorpaySubscriptionId,
      razorpayPaymentId,
      details: {
        razorpayOrderId,
        razorpaySubscriptionId,
        razorpayPaymentId,
      },
    });

    const user = await User.findById(payment.user);

    return {
      message: paymentMessages.PAYMENT_VERIFIED,
      payment: {
        _id: updatedPayment._id,
        amount: updatedPayment.amount,
        currency: updatedPayment.currency,
        status: updatedPayment.status,
        razorpayPaymentId: updatedPayment.razorpayPaymentId,
      },
      user: {
        _id: user._id,
        name: user.firstname + " " + user.lastname,
        email: user.email,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(paymentMessages.PAYMENT_VERIFICATION_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Get Payment by ID Service =================
export const getPaymentService = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId).populate("user", "firstname lastname email phone");

    if (!payment) {
      throw new ApiError(paymentMessages.PAYMENT_NOT_FOUND, httpStatus.NOT_FOUND);
    }

    return {
      message: "Payment fetched successfully",
      payment,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Failed to fetch payment", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Get All Payments Service (Admin) =================
export const getAllPaymentsService = async (filters = {}) => {
  try {
    const { status, page = 1, limit = 20, sortBy = "-createdAt" } = filters;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .populate("user", "firstname lastname email phone")
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPayments = await Payment.countDocuments(query);
    const totalPages = Math.ceil(totalPayments / limit);

    // Calculate statistics
    const stats = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    return {
      message: paymentMessages.PAYMENTS_FETCHED,
      payments,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: totalPayments,
        limit,
      },
      statistics: {
        stats: stats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            totalAmount: stat.totalAmount,
          };
          return acc;
        }, {}),
        totalAmount: stats.reduce((sum, stat) => sum + stat.totalAmount, 0),
        totalTransactions: totalPayments,
      },
    };
  } catch (error) {
    throw new ApiError(error.message || "Failed to fetch payments", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Refund Payment Service =================
export const refundPaymentService = async (paymentId, refundAmount = null, reason = "Refund requested") => {
  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      throw new ApiError(paymentMessages.PAYMENT_NOT_FOUND, httpStatus.NOT_FOUND);
    }

    if (payment.status !== "completed") {
      throw new ApiError("Cannot refund a payment that is not completed", httpStatus.BAD_REQUEST);
    }

    if (payment.refundStatus === "full" || payment.refundStatus === "processed") {
      throw new ApiError("This payment has already been fully refunded", httpStatus.BAD_REQUEST);
    }

    const amountToRefund = refundAmount ? Math.round(refundAmount * 100) : Math.round(payment.amount * 100);

    // Proceed with Razorpay refund
    const refund = await razorpayInstance.payments.refund(payment.razorpayPaymentId, {
      amount: amountToRefund,
      notes: {
        reason: reason,
      },
    });

    // Update payment record
    payment.refundId = refund.id;
    payment.refundAmount = refundAmount || payment.amount;
    payment.refundStatus = refundAmount && refundAmount < payment.amount ? "partial" : "full";
    payment.status = "refunded";

    await payment.save();

    await createTransactionRecord({
      user: payment.user,
      payment: payment._id,
      type: "REFUND_PROCESSED",
      amount: payment.refundAmount,
      currency: payment.currency,
      status: "refunded",
      paymentMode: "razorpay",
      razorpayOrderId: payment.razorpayOrderId,
      razorpayPaymentId: payment.razorpayPaymentId,
      razorpaySubscriptionId: payment.razorpaySubscriptionId,
      details: refund,
    });

    return {
      message: paymentMessages.REFUND_INITIATED,
      refund: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        paymentId: payment._id,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(paymentMessages.REFUND_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Update Payment Status Service (Admin) =================
export const updatePaymentStatusService = async (paymentId, updateData) => {
  try {
    const { status, failureReason } = updateData;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      throw new ApiError(paymentMessages.PAYMENT_NOT_FOUND, httpStatus.NOT_FOUND);
    }

    if (status) {
      payment.status = status;
    }

    if (failureReason && status === "failed") {
      payment.failureReason = failureReason;
    }

    await payment.save();

    return {
      message: paymentMessages.PAYMENT_STATUS_UPDATED,
      payment,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Failed to update payment status", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// ================= Get Payment Analytics Service (Admin) =================
export const getPaymentAnalyticsService = async (dateRange = "30d") => {
  try {
    let startDate = new Date();

    // Set date range
    switch (dateRange) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Aggregate data
    const dailyStats = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          completedAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const statusStats = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const overallStats = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          completedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          failedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
            },
          },
          refundedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "refunded"] }, 1, 0],
            },
          },
        },
      },
    ]);

    return {
      message: "Analytics fetched successfully",
      analytics: {
        dateRange,
        period: {
          from: startDate,
          to: new Date(),
        },
        dailyStats,
        statusStats,
        overall: overallStats[0] || {
          totalTransactions: 0,
          totalAmount: 0,
          completedCount: 0,
          failedCount: 0,
          refundedCount: 0,
        },
      },
    };
  } catch (error) {
    throw new ApiError("Failed to fetch analytics", httpStatus.INTERNAL_SERVER_ERROR);
  }
};
