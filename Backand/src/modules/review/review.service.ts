import prisma from "../../lib/prisma";
import { badRequest, conflict, forbidden, notFound } from "../../utils/AppError";
import { CreateReviewInput } from "./review.interface";

const createReview = async (customerId: string, input: CreateReviewInput) => {
  if (input.rating < 1 || input.rating > 5) {
    throw badRequest("Rating must be between 1 and 5");
  }

  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: input.rentalOrderId,
      customerId,
      status: "RETURNED",
    },
    include: {
      items: true,
    },
  });

  if (!rental) {
    throw badRequest("Can only review gear from returned rental orders");
  }

  const hasGear = rental.items.some(
    (item) => item.gearItemId === input.gearItemId
  );

  if (!hasGear) {
    throw forbidden("Gear item was not part of this rental order");
  }

  const existing = await prisma.review.findUnique({
    where: {
      customerId_rentalOrderId_gearItemId: {
        customerId,
        rentalOrderId: input.rentalOrderId,
        gearItemId: input.gearItemId,
      },
    },
  });

  if (existing) {
    throw conflict("Review already submitted for this gear item");
  }

  return prisma.review.create({
    data: {
      ...input,
      customerId,
    },
    include: {
      gearItem: { select: { id: true, name: true, brand: true } },
      customer: { select: { id: true, name: true } },
    },
  });
};

const getGearReviews = async (gearItemId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id: gearItemId },
  });

  if (!gear) throw notFound("Gear item");

  return prisma.review.findMany({
    where: { gearItemId },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true } },
    },
  });
};

export const reviewService = {
  createReview,
  getGearReviews,
};
