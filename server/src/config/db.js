import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  if (!env.mongodbUri) {
    throw new Error("MONGODB_URI is missing. Fill it in .env file.");
  }

  await mongoose.connect(env.mongodbUri, {
    dbName: undefined
  });

  console.log("MongoDB connected");
}
