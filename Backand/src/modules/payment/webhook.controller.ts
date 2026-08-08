import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

export const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Missing stripe-signature header",
    });
  }

  const result = await paymentService.handleStripeWebhook(req.body, signature);

  sendResponse(res, { 
    success: true, 
    statusCode: httpStatus.OK, 
    message: "Webhook processed successfully", 
    data: result,
  });
});
