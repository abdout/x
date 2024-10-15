import mongoose from "mongoose";
import { MongoClient } from "mongodb";

// MongoDB URI from environment
const uri: string = process.env.MONGODB_URI as string;
if (!uri) throw new Error("Please add your Mongo URI to .env.local");

// MongoClient options
const clientOptions = {};

// Extend the global type to store clientPromise in development to prevent multiple connections
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// MongoClient connection (for NextAuth)
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, clientOptions);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, clientOptions);
  clientPromise = client.connect();
}

// Mongoose connection (for the rest of the app)
const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB via Mongoose.");
    } catch (error) {
      console.error("Mongoose connection error:", error);
    }
  }
};

export { clientPromise, connectDB };
