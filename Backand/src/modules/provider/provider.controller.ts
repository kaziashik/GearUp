import { z } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "../../utils/httpStatus";
import { getParam } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth";
import { providerGearService } from "../gear/gear.service";
import { rentalService } from "../rental/rental.service";

const createGearSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().min(10),
  brand: z.string().min(1),
  pricePerDay: z.number().positive(),
  quantity: z.number().int().min(1),
  specifications: z.record(z.unknown()).optional(),
  images: z.array(z.string().url()).optional(),
});

const updateGearSchema = createGearSchema.partial().extend({
  availableQuantity: z.number().int().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "PICKED_UP", "RETURNED"]),
});

const createGear = catchAsync(async (req, res) => {
  const data = createGearSchema.parse(req.body);
  const gear = await providerGearService.createGear(
    (req as AuthRequest).user!.userId,
    data
  );

  sendResponse(res, { success: true, statusCode: 201, message: "Gear item created successfully", data: gear,
   });
});

const getMyGear = catchAsync(async (req, res) => {
  const gear = await providerGearService.getMyGear(
    (req as AuthRequest).user!.userId
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Gear inventory retrieved successfully", data: gear,
   });
});

const updateGear = catchAsync(async (req, res) => {
  const data = updateGearSchema.parse(req.body);
  const gear = await providerGearService.updateGear(
    (req as AuthRequest).user!.userId,
    getParam(req.params.id),
    data
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Gear item updated successfully", data: gear,
   });
});

const deleteGear = catchAsync(async (req, res) => {
  await providerGearService.deleteGear(
    (req as AuthRequest).user!.userId,
    getParam(req.params.id)
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Gear item deleted successfully" });
});

const getProviderOrders = catchAsync(async (req, res) => {
  const orders = await rentalService.getProviderOrders(
    (req as AuthRequest).user!.userId
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Provider orders retrieved successfully", data: orders,
   });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const data = updateOrderStatusSchema.parse(req.body);
  const order = await rentalService.updateProviderOrderStatus(
    (req as AuthRequest).user!.userId,
    getParam(req.params.id),
    data
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Order status updated successfully", data: order,
   });
});

export const providerController = {
  createGear,
  getMyGear,
  updateGear,
  deleteGear,
  getProviderOrders,
  updateOrderStatus,
};
