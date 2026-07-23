import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    console.log("URI exists:", !!process.env.MONGODB_URI);
    console.log("DB:", process.env.MONGODB_DB_NAME);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    });

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDatabase;