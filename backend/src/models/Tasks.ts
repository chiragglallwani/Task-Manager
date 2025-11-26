import { Schema, Document, model } from "mongoose";

export type TaskStatus = "Pending" | "Completed";

export interface Task extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TaskModel = model<Task>("Task", taskSchema);
