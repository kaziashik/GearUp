import { z } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { getParam } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth";
import { rentalService } from "./rental.service";

const createRentalSchema = z.object({
  startDate: z.string().datetime({ offset: true }).or(z.string().date()),
  endDate: z.string().datetime({ offset: true }).or(z.string().date()),
  items: z
    .array(
      z.object({
        gearItemId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
  notes: z.string().optional(),
});

const createRental = catchAsync(async (req, res) => {
  const data = createRentalSchema.parse(req.body);
  const rental = await rentalService.createRental(
    (req as AuthRequest).user!.userId,
    data
  );

  sendResponse(res, { success: true, statusCode: 201, message: "Rental order created successfully", data: rental,
   });
});

const getMyRentals = catchAsync(async (req, res) => {
  const rentals = await rentalService.getMyRentals(
    (req as AuthRequest).user!.userId
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Rental orders retrieved successfully", data: rentals,
   });
});

const getRentalById = catchAsync(async (req, res) => {
  const authReq = req as AuthRequest;
  const rental = await rentalService.getRentalById(
    getParam(req.params.id),
    authReq.user!.userId,
    authReq.user!.role
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Rental order retrieved successfully", data: rental,
   });
});

const cancelRental = catchAsync(async (req, res) => {
  const rental = await rentalService.cancelRental(
    (req as AuthRequest).user!.userId,
    getParam(req.params.id)
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Rental order cancelled successfully", data: rental,
   });
});

export const rentalController = {
  createRental,
  getMyRentals,
  getRentalById,
  cancelRental,
};
