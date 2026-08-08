import { z } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth";
import { userService } from "./user.service";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

const getMyProfile = catchAsync(async (req, res) => {
  const user = await userService.getMyProfile((req as AuthRequest).user!.userId);

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Profile retrieved successfully", data: user  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const data = updateProfileSchema.parse(req.body);
  const user = await userService.updateMyProfile(
    (req as AuthRequest).user!.userId,
    data
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Profile updated successfully", data: user  });
});

const changePassword = catchAsync(async (req, res) => {
  const data = changePasswordSchema.parse(req.body);
  await userService.changePassword((req as AuthRequest).user!.userId, data);

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Password changed successfully" });
});

const deleteAccount = catchAsync(async (req, res) => {
  await userService.deleteAccount((req as AuthRequest).user!.userId);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Account deleted successfully" });
});

export const userController = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteAccount,
};
