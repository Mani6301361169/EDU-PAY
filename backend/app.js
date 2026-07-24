import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import feeRoutes from "./routes/feeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");

// Allow frontend origins
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Stripe webhook
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// JSON parser
app.use(express.json());

/* ===========================
   ROOT & HEALTH ROUTES
=========================== */

// Root Route
app.get("/", (_req, res) => {
  res.send("🚀 EDU-PAY Backend is Running");
});

// API Welcome Route
app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to EDU-PAY API",
  });
});

// Health Check Route
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "college-fees-api",
  });
});

/* ===========================
   API ROUTES
=========================== */

app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/payments", paymentRoutes);

/* ===========================
   SERVE FRONTEND (Production)
=========================== */

if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

/* ===========================
   ERROR HANDLERS
=========================== */

app.use(notFound);
app.use(errorHandler);

export default app;