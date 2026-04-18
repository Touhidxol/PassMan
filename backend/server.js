import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

dotenv.config();

const REQUIRED_ENV = [
  "JWT_SECRET",
  "ENCRYPTION_KEY",
  "ENCRYPTION_SALT",
  "MONGO_URI",
];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[startup] Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

import userRoutes from "./routes/userRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import requireAuth from './middlewares/requireAuth.js';


const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later"
});
app.use(limiter);

// Public routes — no auth needed
app.use("/api/users", userRoutes);   // register, login, logout are public; /me is guarded inside the router
app.use("/api/auth", otpRoutes);     // forgot-password, reset-password are public

// Protected routes — requireAuth runs before the router
app.use("/api/passwords", requireAuth, passwordRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Passman API is running." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/passman")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });