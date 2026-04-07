import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import userRoutes from "./routes/userRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import requireAuth from './middlewares/requireAuth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
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

app.use(requireAuth);

app.use("/api/users", userRoutes);
app.use("/api/passwords", passwordRoutes);

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