import { z } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { getParam } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth";
import { reviewService } from "./review.service";

const createReviewSchema = z.object({
  gearItemId: z.string().uuid(),
  rentalOrderId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const createReview = catchAsync(async (req, res) => {
  const data = createReviewSchema.parse(req.body);
  const review = await reviewService.createReview(
    (req as AuthRequest).user!.userId,
    data
  );

  sendResponse(res, { success: true, statusCode: 201, message: "Review submitted successfully", data: review,
   });
});

const getGearReviews = catchAsync(async (req, res) => {
  const reviews = await reviewService.getGearReviews(getParam(req.params.gearId));

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Reviews retrieved successfully", data: reviews,
   });
});

export const reviewController = {
  createReview,
  getGearReviews,
};
