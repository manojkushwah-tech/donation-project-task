import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      index: true,
    },
    type: {
      type: String,
      enum: [
        "ORDER_CREATED",
        "SUBSCRIPTION_CREATED",
        "PAYMENT_COMPLETED",
        "SUBSCRIPTION_AUTHORIZED",
        "REFUND_PROCESSED",
      ],
      required: [true, "Transaction type is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be zero or greater"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "created"],
      default: "pending",
    },
    paymentMode: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    razorpaySubscriptionId: {
      type: String,
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
    notes: {
      type: Map,
      of: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ razorpayOrderId: 1, razorpaySubscriptionId: 1, razorpayPaymentId: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
