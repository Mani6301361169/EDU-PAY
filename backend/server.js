import app from "./app.js";
import connectDatabase from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

try {
  await connectDatabase();

  const server = app.listen(port, () => {
    console.log(`🚀 EDU-PAY Server running at http://localhost:${port}`);

    // 24/7 Keep-Alive: Ping server every 14 minutes to prevent cloud platform (e.g. Render) idle sleep
    const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
    const keepAliveUrl = process.env.RENDER_EXTERNAL_URL
      ? `${process.env.RENDER_EXTERNAL_URL}/api/health/ping`
      : `http://localhost:${port}/api/health/ping`;

    setInterval(async () => {
      try {
        await fetch(keepAliveUrl);
        console.log(`[24/7 Keep-Alive] Self-ping successful at ${new Date().toISOString()}`);
      } catch (err) {
        console.warn("[24/7 Keep-Alive] Self-ping failed:", err.message);
      }
    }, PING_INTERVAL);
  });
} catch (error) {
  console.error("Server startup failed:", error);
  process.exit(1);
}