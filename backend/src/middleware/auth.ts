import type { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import type { Role } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: { id: string; email: string; role: Role };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    req.user = user as { id: string; email: string; role: Role };
    next();
  });
};
