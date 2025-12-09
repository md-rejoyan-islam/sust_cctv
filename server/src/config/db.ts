import mongoose from "mongoose";
import secret from "../app/secret";

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(secret.mongo_uri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
