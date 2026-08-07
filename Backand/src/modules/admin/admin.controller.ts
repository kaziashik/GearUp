import { z } from "zod";
import catchAsync from "../../utils/catchAsync";
import { getParam } from "../../utils/getParam";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

const getAllUsers = catchAsync(async (req, res) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const result = await adminService.getAllUsers(page, limit);

  sendResponse({
    res,
    message: "Users retrieved successfully",
    data: result.users,
    meta: result.meta,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { status } = updateUserStatusSchema.parse(req.body);
  const user = await adminService.updateUserStatus(getParam(req.params.id), status);

  sendResponse({
    res,
    message: "User status updated successfully",
    data: user,
  });
});

const getAllGear = catchAsync(async (req, res) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const result = await adminService.getAllGear(page, limit);

  sendResponse({
    res,
    message: "All gear listings retrieved successfully",
    data: result.gear,
    meta: result.meta,
  });
});

const getAllRentals = catchAsync(async (req, res) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const result = await adminService.getAllRentals(page, limit);

  sendResponse({
    res,
    message: "All rental orders retrieved successfully",
    data: result.rentals,
    meta: result.meta,
  });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};
