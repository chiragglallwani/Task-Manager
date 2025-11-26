import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { UserModel } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/helper";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or invalid credentials",
      });
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const accessToken = generateAccessToken(
      user._id.toString(),
      user.email,
      user.role
    );
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.email,
      user.role
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
      },
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

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      role,
    });
    const accessToken = generateAccessToken(
      newUser._id.toString(),
      newUser.email,
      newUser.role
    );
    const refreshToken = generateRefreshToken(
      newUser._id.toString(),
      newUser.email,
      newUser.role
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    res.json({
      success: true,
      message: "User created successfully",
      data: {
        accessToken,
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          role: newUser.role,
        },
      },
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

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as jwt.JwtPayload;
    const user = await UserModel.findById({ _id: decoded.id as string });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = generateAccessToken(
      user._id.toString(),
      user.email,
      user.role
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken,
        user: { id: user._id.toString(), email: user.email, role: user.role },
      },
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

export const logoutController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
  }
};
