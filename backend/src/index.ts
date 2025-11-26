import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { taskRoutes } from "./routes/taskRoutes";
import { authRoutes } from "./routes/authRoutes";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://task-manager-frontend-two-mu.vercel.app",
      process.env.FRONTEND_URL ?? "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

connectDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
