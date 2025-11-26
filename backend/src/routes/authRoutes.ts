import { Router } from "express";
import {
  loginController,
  registerController,
  refreshTokenController,
  logoutController,
} from "../controllers/auth";
import { authMiddleware } from "../middleware/auth";

export const authRoutes = Router();

authRoutes.post("/login", loginController);
authRoutes.post("/register", registerController);
authRoutes.post("/refresh", refreshTokenController);
authRoutes.post("/logout", authMiddleware, logoutController);
