import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import {globalErrorHandler} from "./middlewares/error.middlewaare.js";
import rateLimit from "express-rate-limit";

const app = express();

// ========================= Middleware =========================
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(helmet());
// check comming data 
app.use((req, res, next) => {
  console.log(req.method, "Incoming request data:", req.body, req.query, req.params);
  next();
});

// ========================= Rate Limiting =========================
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: "Too many requests from this IP, please try again later.",
//   })
// );

// ========================= Routes =========================
app.use("/api/v1", routes);

// ========================= Error Handler =========================
app.use(globalErrorHandler);

export default app;