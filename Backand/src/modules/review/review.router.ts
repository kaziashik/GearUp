import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma";
import { authenticate, authorize } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const reviewRouter = Router();

reviewRouter.get("/gear/:gearId", reviewController.getGearReviews);

reviewRouter.post(
  "/",
  authenticate,
  authorize(Role.CUSTOMER),
  reviewController.createReview
);

export default reviewRouter;
