import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

// ================ Razorpay Configuration =================
const razorpayConfig = {
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
};

if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
  throw new Error(
    "Razorpay configuration error: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables."
  );
}

// ================ Razorpay Instance =================
const razorpayInstance = new Razorpay({
  key_id: razorpayConfig.keyId,
  key_secret: razorpayConfig.keySecret,
});

export { razorpayInstance, razorpayConfig };
