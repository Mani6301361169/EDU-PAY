import mongoose from "mongoose";

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not set. Database operations will be disabled until MONGODB_URI is configured.");
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "college-fees-system",
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return null;
  }
};

export default connectDatabase;