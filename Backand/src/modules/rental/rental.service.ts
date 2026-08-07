import { RentalStatus } from "../../../prisma/generated/prisma";
import prisma from "../../lib/prisma";
import { badRequest, forbidden, notFound } from "../../utils/AppError";
import { CreateRentalInput, UpdateRentalStatusInput } from "./rental.interface";

const rentalInclude = {
  customer: { select: { id: true, name: true, email: true } },
  items: {
    include: {
      gearItem: {
        include: {
          category: { select: { id: true, name: true } },
          provider: { select: { id: true, name: true, email: true } },
        },
      },
    },
  },
  payments: true,
};

const calculateDays = (start: Date, end: Date) => {
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const createRental = async (customerId: string, input: CreateRentalInput) => {
  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  if (endDate <= startDate) {
    throw badRequest("End date must be after start date");
  }

  if (input.items.length === 0) {
    throw badRequest("At least one gear item is required");
  }

  const days = calculateDays(startDate, endDate);

  const gearIds = input.items.map((i) => i.gearItemId);
  const gearItems = await prisma.gearItem.findMany({
    where: { id: { in: gearIds }, status: "ACTIVE" },
  });

  if (gearItems.length !== gearIds.length) {
    throw notFound("One or more gear items");
  }

  let totalAmount = 0;
  const orderItems = input.items.map((item) => {
    const gear = gearItems.find((g) => g.id === item.gearItemId)!;

    if (gear.availableQuantity < item.quantity) {
      throw badRequest(`Insufficient stock for ${gear.name}`);
    }

    const pricePerDay = Number(gear.pricePerDay);
    const subtotal = pricePerDay * item.quantity * days;
    totalAmount += subtotal;

    return {
      gearItemId: item.gearItemId,
      quantity: item.quantity,
      pricePerDay: gear.pricePerDay,
      subtotal,
    };
  });

  const rental = await prisma.$transaction(async (tx) => {
    for (const item of input.items) {
      await tx.gearItem.update({
        where: { id: item.gearItemId },
        data: { availableQuantity: { decrement: item.quantity } },
      });
    }

    return tx.rentalOrder.create({
      data: {
        customerId,
        startDate,
        endDate,
        totalAmount,
        notes: input.notes,
        items: { create: orderItems },
      },
      include: rentalInclude,
    });
  });

  return rental;
};

const getMyRentals = async (customerId: string) => {
  return prisma.rentalOrder.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: rentalInclude,
  });
};

const getRentalById = async (rentalId: string, userId: string, role: string) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: { id: rentalId },
    include: rentalInclude,
  });

  if (!rental) throw notFound("Rental order");

  const isCustomer = rental.customerId === userId;
  const isProvider = rental.items.some(
    (item) => item.gearItem.providerId === userId
  );

  if (role !== "ADMIN" && !isCustomer && !isProvider) {
    throw forbidden("Access denied");
  }

  return rental;
};

const cancelRental = async (customerId: string, rentalId: string) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: { id: rentalId, customerId },
    include: { items: true },
  });

  if (!rental) throw notFound("Rental order");

  if (!["PLACED", "CONFIRMED"].includes(rental.status)) {
    throw badRequest("Cannot cancel rental in current status");
  }

  return prisma.$transaction(async (tx) => {
    for (const item of rental.items) {
      await tx.gearItem.update({
        where: { id: item.gearItemId },
        data: { availableQuantity: { increment: item.quantity } },
      });
    }

    return tx.rentalOrder.update({
      where: { id: rentalId },
      data: { status: RentalStatus.CANCELLED },
      include: rentalInclude,
    });
  });
};

const getProviderOrders = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      items: { some: { gearItem: { providerId } } },
    },
    orderBy: { createdAt: "desc" },
    include: rentalInclude,
  });
};

const updateProviderOrderStatus = async (
  providerId: string,
  rentalId: string,
  input: UpdateRentalStatusInput
) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      items: { some: { gearItem: { providerId } } },
    },
    include: { items: true },
  });

  if (!rental) throw notFound("Rental order");

  const validTransitions: Record<string, RentalStatus[]> = {
    PLACED: [RentalStatus.CONFIRMED, RentalStatus.CANCELLED],
    CONFIRMED: [RentalStatus.PICKED_UP, RentalStatus.CANCELLED],
    PAID: [RentalStatus.PICKED_UP],
    PICKED_UP: [RentalStatus.RETURNED],
  };

  const allowed = validTransitions[rental.status] || [];

  if (!allowed.includes(input.status as RentalStatus)) {
    throw badRequest(
      `Cannot transition from ${rental.status} to ${input.status}`
    );
  }

  if (input.status === "CANCELLED") {
    return prisma.$transaction(async (tx) => {
      for (const item of rental.items) {
        await tx.gearItem.update({
          where: { id: item.gearItemId },
          data: { availableQuantity: { increment: item.quantity } },
        });
      }

      return tx.rentalOrder.update({
        where: { id: rentalId },
        data: { status: RentalStatus.CANCELLED },
        include: rentalInclude,
      });
    });
  }

  if (input.status === "RETURNED") {
    return prisma.$transaction(async (tx) => {
      for (const item of rental.items) {
        await tx.gearItem.update({
          where: { id: item.gearItemId },
          data: { availableQuantity: { increment: item.quantity } },
        });
      }

      return tx.rentalOrder.update({
        where: { id: rentalId },
        data: { status: RentalStatus.RETURNED },
        include: rentalInclude,
      });
    });
  }

  return prisma.rentalOrder.update({
    where: { id: rentalId },
    data: { status: input.status as RentalStatus },
    include: rentalInclude,
  });
};

export const rentalService = {
  createRental,
  getMyRentals,
  getRentalById,
  cancelRental,
  getProviderOrders,
  updateProviderOrderStatus,
};
