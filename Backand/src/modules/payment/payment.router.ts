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

// Confirm is public: Stripe session_id is verified with Stripe API.
// Keeps success-page confirm working even if auth cookies drop after checkout.
paymentRouter.post("/confirm", paymentController.confirmPayment);

paymentRouter.use(authenticate);
paymentRouter.use(authorize(Role.CUSTOMER, Role.ADMIN));

paymentRouter.post("/create", paymentController.createPayment);
paymentRouter.get("/", paymentController.getMyPayments);
paymentRouter.get("/:id", paymentController.getPaymentById);

export default paymentRouter;
