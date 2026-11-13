import mongoose from "mongoose";
import { ENV } from "./env.js";
let mongodInstance = null;
export async function connectDatabase() {
  const uri = ENV.MONGODB_URI;
  if (uri && uri.trim().length > 0) {
    try {
      console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/.*@/, "//***@")}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5e3,
        autoIndex: true
      });
      console.log("Successfully connected to configured MongoDB database.");
      return;
    } catch (err) {
      console.warn("Could not connect to configured MONGODB_URI. Falling back to in-memory database for local evaluation...");
    }
  }
  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    console.log("Started embedded in-memory MongoDB server for local development/testing.");
    await mongoose.connect(memoryUri);
    console.log("Connected to embedded in-memory MongoDB database.");
  } catch (error) {
    console.error("Fatal error initializing in-memory database:", error);
    throw error;
  }
}
export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
}
