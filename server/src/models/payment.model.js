import mongoose from "mongoose";
import { paymentMessages } from "../helper/constants.js";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR"],
    },
    type: {
      type: String,
      enum: ["DONATION", "SIP"],
      default: "DONATION",
      index: true,
    },
    // Razorpay Order and Subscription Details
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    razorpaySignature: {
      type: String,
      sparse: true,
    },
    razorpaySubscriptionId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    razorpayPlanId: {
      type: String,
      index: true,
    },
    razorpayCustomerId: {
      type: String,
      index: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ["created", "active", "authenticated", "paused", "cancelled", "completed", "pending"],
      default: "pending",
      index: true,
    },
    subscriptionStartAt: {
      type: Date,
    },
    subscriptionEndAt: {
      type: Date,
    },
    // Payment Status
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    // Additional Details
    description: {
      type: String,
      trim: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    refundId: {
      type: String,
      sparse: true,
    },
    refundStatus: {
      type: String,
      enum: ["none", "partial", "full", "processed", "failed"],
      default: "none",
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    // Receipt and Invoice
    receipt: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Metadata
    metadata: {
      type: Map,
      of: String,
    },
    // IP and User Agent for tracking
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for efficient querying
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ email: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
