import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  url: process.env.MONGODB_URI || "mongodb://localhost:27017/donationDB",
};

const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.url);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
