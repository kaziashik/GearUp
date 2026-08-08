import { z } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { getParam } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth";
import { paymentService } from "./payment.service";

const createPaymentSchema = z.object({
  rentalOrderId: z.string().uuid(),
  method: z.enum(["STRIPE", "SSLCOMMERZ"]).optional(),
});

const createPayment = catchAsync(async (req, res) => {
  const data = createPaymentSchema.parse(req.body);
  const result = await paymentService.createPayment(
    (req as AuthRequest).user!.userId,
    data
  );

  sendResponse({
    res,
    statusCode: 201,
    message: result.message || "Payment session created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "sessionId is required",
    });
  }

  const payment = await paymentService.confirmStripePayment(sessionId);

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment confirmed successfully", data: payment,
   });
});

const getMyPayments = catchAsync(async (req, res) => {
  const payments = await paymentService.getMyPayments(
    (req as AuthRequest).user!.userId
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment history retrieved successfully", data: payments,
   });
});

const getPaymentById = catchAsync(async (req, res) => {
  const authReq = req as AuthRequest;
  const payment = await paymentService.getPaymentById(
    getParam(req.params.id),
    authReq.user!.userId,
    authReq.user!.role
  );

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment retrieved successfully", data: payment,
   });
});

export const paymentController = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
