import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import feeRoutes from "./routes/feeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");

// Configured allowed origins
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (_origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

// Stripe webhook
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// JSON parser
app.use(express.json());

/* ===========================
   ROOT & 24/7 HEALTH ROUTES
=========================== */

// API Welcome Route
app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to EDU-PAY API",
  });
});

// 24/7 Health & System Status Endpoint
app.get("/api/health", (_req, res) => {
  const dbStateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const dbStatus = mongoose.connection
    ? dbStateMap[mongoose.connection.readyState] || "unknown"
    : "not initialized";

  res.json({
    status: "ok",
    service: "college-fees-api",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStatus,
    keepAlive247: true,
  });
});

// 24/7 Quick Ping Route
app.get("/api/health/ping", (_req, res) => {
  res.status(200).send("pong");
});

/* ===========================
   API ROUTES
=========================== */

app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/payments", paymentRoutes);

/* ===========================
   SERVE FRONTEND (Production SPA Fallback)
=========================== */

if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  // Fallback root endpoint when frontend dist is not built
  app.get("/", (_req, res) => {
    res.send("🚀 EDU-PAY Backend is Running");
  });
}

/* ===========================
   ERROR HANDLERS
=========================== */

app.use(notFound);
app.use(errorHandler);

export default app;