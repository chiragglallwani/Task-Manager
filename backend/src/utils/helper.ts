import * as jwt from "jsonwebtoken";
import { Role } from "../models/User";
import { CookieOptions } from "express";

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

export const COOKIE_OPTIONS_ACCESS_TOKEN: CookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 15 * 60 * 1000,
  sameSite: "none",
};

export const COOKIE_OPTIONS_REFRESH_TOKEN: CookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "none",
};
