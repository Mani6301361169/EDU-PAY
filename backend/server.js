import app from "./app.js";
import connectDatabase from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

try {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
} catch (error) {
  console.error("Server startup failed:", error);
  process.exit(1);
}