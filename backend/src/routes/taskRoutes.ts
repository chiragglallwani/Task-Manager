import { Router } from "express";
import {
  createTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/tasks";
import { authMiddleware } from "../middleware/auth";

export const taskRoutes = Router();

taskRoutes.post("/", authMiddleware, createTaskController);
taskRoutes.get("/", authMiddleware, getAllTasksController);
taskRoutes.get("/:id", authMiddleware, getTaskByIdController);
taskRoutes.put("/:id", authMiddleware, updateTaskController);
taskRoutes.delete("/:id", authMiddleware, deleteTaskController);
