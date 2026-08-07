import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma";
import { authenticate, authorize } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const rentalRouter = Router();

rentalRouter.use(authenticate);

rentalRouter.post("/", authorize(Role.CUSTOMER), rentalController.createRental);
rentalRouter.get("/", authorize(Role.CUSTOMER), rentalController.getMyRentals);
rentalRouter.get(
  "/:id",
  authorize(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  rentalController.getRentalById
);
rentalRouter.patch(
  "/:id/cancel",
  authorize(Role.CUSTOMER),
  rentalController.cancelRental
);

export default rentalRouter;
