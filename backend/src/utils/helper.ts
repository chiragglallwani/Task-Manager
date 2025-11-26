import * as jwt from "jsonwebtoken";
import { Role } from "../models/User";

export const generateRefreshToken = (
  userId: string,
  email: string,
  role: Role
) => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

export const generateAccessToken = (
  userId: string,
  email: string,
  role: Role
) => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );
};
