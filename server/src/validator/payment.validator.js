import { z } from "zod";

// ================= Create Payment Order Validation =================
export const createPaymentOrderValidator = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number format")
    .trim(),
  amount: z
    .number()
    .min(1, "Amount must be greater than 0")
    .max(100000, "Amount is too large"),
  type: z
    .enum(["DONATION", "SIP"])
    .default("DONATION"),
  durationMonths: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 month")
    .max(60, "Duration must be at most 60 months")
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
});

// ================= Verify Payment Validation =================
export const verifyPaymentValidator = z
  .object({
    razorpayOrderId: z.string().optional(),
    razorpaySubscriptionId: z.string().optional(),
    razorpayPaymentId: z.string().min(1, "Payment ID is required"),
    razorpaySignature: z.string().min(1, "Signature is required"),
  })
  .refine((data) => Boolean(data.razorpayOrderId || data.razorpaySubscriptionId), {
    message: "Either razorpayOrderId or razorpaySubscriptionId is required",
    path: ["razorpayOrderId", "razorpaySubscriptionId"],
  });

// ================= Refund Payment Validation =================
export const refundPaymentValidator = z.object({
  paymentId: z
    .string()
    .min(1, "Payment ID is required"),
  amount: z
    .number()
    .min(1, "Amount must be greater than 0")
    .optional(),
  reason: z
    .string()
    .max(500, "Reason must be at most 500 characters")
    .optional(),
});

// ================= Get Payment Status Validation =================
export const getPaymentValidator = z.object({
  paymentId: z
    .string()
    .min(1, "Payment ID is required"),
});

// ================= Update Payment Status Validation (Admin) =================
export const updatePaymentStatusValidator = z.object({
  paymentId: z
    .string()
    .min(1, "Payment ID is required"),
  status: z
    .enum(["pending", "completed", "failed", "refunded"])
    .optional(),
  failureReason: z
    .string()
    .max(500, "Failure reason must be at most 500 characters")
    .optional(),
});
