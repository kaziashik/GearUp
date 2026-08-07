import { PaymentMethod, RentalStatus } from "../../../prisma/generated/prisma";
import prisma from "../../lib/prisma";
import stripe from "../../lib/stripe";
import { config } from "../../config";
import { badRequest, notFound } from "../../utils/AppError";
import { CreatePaymentInput } from "./payment.interface";

const createPayment = async (customerId: string, input: CreatePaymentInput) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: { id: input.rentalOrderId, customerId },
    include: { payments: true },
  });

  if (!rental) throw notFound("Rental order");

  if (["CANCELLED", "RETURNED"].includes(rental.status)) {
    throw badRequest("Cannot pay for this rental order");
  }

  const completedPayment = rental.payments.find((p) => p.status === "COMPLETED");

  if (completedPayment) {
    throw badRequest("Rental order already paid");
  }

  const method = (input.method || "STRIPE") as PaymentMethod;

  if (method === "SSLCOMMERZ") {
    const payment = await prisma.payment.create({
      data: {
        rentalOrderId: rental.id,
        customerId,
        amount: rental.totalAmount,
        method: PaymentMethod.SSLCOMMERZ,
        status: "PENDING",
        transactionId: `SSLC-${Date.now()}`,
      },
    });

    return {
      payment,
      checkoutUrl: null,
      message: "SSLCommerz integration pending - payment record created",
    };
  }

  if (!stripe) {
    throw badRequest("Stripe is not configured");
  }

  const payment = await prisma.payment.create({
    data: {
      rentalOrderId: rental.id,
      customerId,
      amount: rental.totalAmount,
      method: PaymentMethod.STRIPE,
      status: "PENDING",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `GearUp Rental #${rental.id.slice(0, 8)}`,
            description: `Rental from ${rental.startDate.toISOString().split("T")[0]} to ${rental.endDate.toISOString().split("T")[0]}`,
          },
          unit_amount: Math.round(Number(rental.totalAmount) * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${config.stripe.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: config.stripe.cancelUrl,
    metadata: {
      paymentId: payment.id,
      rentalOrderId: rental.id,
      customerId,
    },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { stripeSessionId: session.id },
  });

  return {
    payment: { ...payment, stripeSessionId: session.id },
    checkoutUrl: session.url,
  };
};

const confirmStripePayment = async (sessionId: string) => {
  if (!stripe) throw badRequest("Stripe is not configured");

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw badRequest("Payment not completed");
  }

  const paymentId = session.metadata?.paymentId;

  if (!paymentId) throw badRequest("Invalid session metadata");

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) throw notFound("Payment");

  if (payment.status === "COMPLETED") {
    return payment;
  }

  const [updatedPayment] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        transactionId: session.payment_intent as string,
        paidAt: new Date(),
      },
    }),
    prisma.rentalOrder.update({
      where: { id: payment.rentalOrderId },
      data: { status: RentalStatus.PAID },
    }),
  ]);

  return updatedPayment;
};

const handleStripeWebhook = async (rawBody: Buffer, signature: string) => {
  if (!stripe) throw badRequest("Stripe is not configured");

  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    config.stripe.webhookSecret
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.id) {
      await confirmStripePayment(session.id);
    }
  }

  return { received: true };
};

const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      rentalOrder: {
        select: {
          id: true,
          status: true,
          startDate: true,
          endDate: true,
          totalAmount: true,
        },
      },
    },
  });
};

const getPaymentById = async (paymentId: string, customerId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalOrder: {
        include: {
          items: {
            include: {
              gearItem: { select: { id: true, name: true, brand: true } },
            },
          },
        },
      },
    },
  });

  if (!payment) throw notFound("Payment");

  if (role !== "ADMIN" && payment.customerId !== customerId) {
    throw notFound("Payment");
  }

  return payment;
};

export const paymentService = {
  createPayment,
  confirmStripePayment,
  handleStripeWebhook,
  getMyPayments,
  getPaymentById,
};
