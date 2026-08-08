import { Response } from "express";
import { z } from "zod";
import { Role } from "../../../prisma/generated/prisma";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth";
import { authService } from "./auth.service";
import httpStatus from "http-status";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum([Role.CUSTOMER, Role.PROVIDER]),
  phone: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const googleLoginSchema = z.object({
  idToken: z.string().min(1),
  role: z.enum([Role.CUSTOMER, Role.PROVIDER]).optional(),
});

const register = catchAsync(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const result = await authService.register(data, res as Response);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Registration successful",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data, res as Response);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: result,
  });
});

const googleLogin = catchAsync(async (req, res) => {
  const data = googleLoginSchema.parse(req.body);
  const result = await authService.googleLogin(data, res as Response);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Google login successful",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe((req as AuthRequest).user!.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: user,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  const result = await authService.refreshToken(token, res as Response);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Token refreshed successfully",
    data: result,
  });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout((req as AuthRequest).user!.userId, res as Response);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logged out successfully",
  });
});

export const authController = {
  register,
  login,
  googleLogin,
  getMe,
  refreshToken,
  logout,
};
