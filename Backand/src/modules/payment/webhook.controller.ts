import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

export const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "Missing stripe-signature header",
    });
  }

  const result = await paymentService.handleStripeWebhook(req.body, signature);

  sendResponse({
    res,
    message: "Webhook processed successfully",
    data: result,
  });
});
