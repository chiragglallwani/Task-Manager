import type { Request, Response } from "express";
import { TaskModel } from "../models/Tasks";
import { Role } from "../models/User";

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { title, description, status, createdAt } = req.body;
    const task = await TaskModel.create({
      title,
      description,
      status,
      isDeleted: false,
      createdAt: createdAt || new Date(),
      userId,
    });
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "An unknown error occurred",
    });
  }
};

export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id as string;
    const userRole = req.user?.role as Role;
    if (userRole === "admin") {
      const tasks = await TaskModel.find();
      return res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: tasks,
      });
    } else {
      const tasks = await TaskModel.find({ userId: id });
      return res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: tasks,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "An unknown error occurred",
    });
  }
};

export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const task = await TaskModel.findById(id);
    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "An unknown error occurred",
    });
  }
};

export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, status } = req.body;
    const task = await TaskModel.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "An unknown error occurred",
    });
  }
};

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role as Role;
    if (userRole !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Forbidden",
        error: "You are not authorized to delete this task",
      });
    }
    const id = req.params.id as string;
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        error: "Task not found",
      });
    }
    if (task.isDeleted) {
      await TaskModel.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } else {
      await TaskModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        data: task,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "An unknown error occurred",
    });
  }
};
