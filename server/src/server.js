import dotenv from "dotenv";
import app from "./app.js";
import dbConnect from "./config/db.config.js";

// Load environment variables from .env file
dotenv.config();

// ================= Connect to the database =================
dbConnect();

const PORT = process.env.PORT || 3040;

// ================= Start the server =================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});