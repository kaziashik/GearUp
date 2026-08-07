import prisma from "../../lib/prisma";
import { notFound } from "../../utils/AppError";
import { UserStatus } from "../../../prisma/generated/prisma";

const getAllUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw notFound("User");

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });
};

const getAllGear = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [gear, total] = await Promise.all([
    prisma.gearItem.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        provider: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.gearItem.count(),
  ]);

  return {
    gear,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getAllRentals = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [rentals, total] = await Promise.all([
    prisma.rentalOrder.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            gearItem: { select: { id: true, name: true, brand: true } },
          },
        },
        payments: true,
      },
    }),
    prisma.rentalOrder.count(),
  ]);

  return {
    rentals,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};
