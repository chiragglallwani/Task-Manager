import { Router } from "express";
import {
  loginController,
  registerController,
  refreshTokenController,
  logoutController,
  getUserController,
} from "../controllers/auth";
import { authMiddleware } from "../middleware/auth";

export const authRoutes = Router();

authRoutes.post("/login", loginController);
authRoutes.post("/register", registerController);
authRoutes.get("/refresh", refreshTokenController);
authRoutes.get("/user", authMiddleware, getUserController);
authRoutes.post("/logout", authMiddleware, logoutController);
