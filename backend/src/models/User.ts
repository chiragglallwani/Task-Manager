import mongoose, { Document, model, Schema } from "mongoose";
export type Role = "admin" | "user";

export interface User extends Document {
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], required: true },
});

export const UserModel = mongoose.model<User>("User", userSchema);
