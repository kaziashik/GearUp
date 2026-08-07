import { Router } from "express";
import express from "express";
import { Role } from "../../../prisma/generated/prisma";
import { authenticate, authorize } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";
import { stripeWebhook } from "./webhook.controller";

const paymentRouter = Router();

paymentRouter.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

paymentRouter.use(authenticate);
paymentRouter.use(authorize(Role.CUSTOMER, Role.ADMIN));

paymentRouter.post("/create", paymentController.createPayment);
paymentRouter.post("/confirm", paymentController.confirmPayment);
paymentRouter.get("/", paymentController.getMyPayments);
paymentRouter.get("/:id", paymentController.getPaymentById);

export default paymentRouter;
