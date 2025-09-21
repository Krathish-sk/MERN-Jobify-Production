// db/connect.js
import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, // 30 seconds
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully!");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected!");
    });

  } catch (error) {
    console.error("❌ Could not connect to MongoDB:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectDB;
