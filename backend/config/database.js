import mongoose from "mongoose";
import { setServers } from "node:dns";

const connectDatabase = async () => {
  try {
    if (process.env.MONGODB_DNS_SERVER) {
      setServers([process.env.MONGODB_DNS_SERVER]);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    });

    console.log("MongoDB Connected successfully: ");
  } catch (error) {
    console.log("========== FULL ERROR ==========");
    console.error(error);
    console.log("================================");
    process.exit(1);
  }
};
;
export default connectDatabase;
