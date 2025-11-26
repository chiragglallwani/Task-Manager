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
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
