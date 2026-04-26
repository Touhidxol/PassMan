import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

dotenv.config();

// ── Startup env validation ───────────────────────────────────────────────────
const REQUIRED_ENV = [
  "JWT_SECRET",
  "ENCRYPTION_KEY",
  "ENCRYPTION_SALT",
  "MONGO_URI",
];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[startup] Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

// Warn (don't crash) if email is unconfigured — OTP will fail gracefully
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("[startup] EMAIL_USER / EMAIL_PASS not set — OTP emails will fail.");
}

// Warn if encryption salt looks weak (should be 32+ chars)
if (process.env.ENCRYPTION_SALT && process.env.ENCRYPTION_SALT.length < 16) {
  console.warn("[startup] ENCRYPTION_SALT looks short — use a random 32-char string.");
}

import userRoutes from "./routes/userRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import requireAuth from "./middlewares/requireAuth.js";

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

if (isProd) app.set("trust proxy", 1);

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — origin from env in prod, localhost fallback in dev ────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server / Postman requests (no origin header)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin "${origin}" not allowed`));
    },
    credentials: true,
  })
);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));   // prevent giant payloads
app.use(cookieParser());

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan(isProd ? "combined" : "dev"));

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Tighter limit on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, try again later." },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, try again later." },
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/users", authLimiter, userRoutes);
app.use("/api/auth", authLimiter, otpRoutes);
app.use("/api/passwords", apiLimiter, requireAuth, passwordRoutes);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "PassMan API is running." });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  // CORS errors
  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error("[error]", err.stack ?? err.message);
  res.status(500).json({
    success: false,
    message: isProd ? "Internal server error." : (err.message ?? "Internal server error."),
  });
});

// ── DB + listen ───────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("[db] MongoDB connected");
    app.listen(port, () => {
      console.log(`[server] Running on port ${port} (${isProd ? "production" : "development"})`);
    });
  })
  .catch((err) => {
    console.error("[db] Connection failed:", err.message);
    process.exit(1);
  });