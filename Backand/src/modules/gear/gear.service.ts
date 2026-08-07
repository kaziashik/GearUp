import { Prisma } from "../../../prisma/generated/prisma";
import prisma from "../../lib/prisma";
import { notFound } from "../../utils/AppError";
import { CreateGearInput, GearFilters, UpdateGearInput } from "./gear.interface";

const gearInclude = {
  category: { select: { id: true, name: true, slug: true } },
  provider: { select: { id: true, name: true, email: true } },
  reviews: {
    select: { rating: true },
  },
};

const withAverageRating = <T extends { reviews: { rating: number }[] }>(
  gear: T
) => {
  const avgRating =
    gear.reviews.length > 0
      ? gear.reviews.reduce((sum, r) => sum + r.rating, 0) / gear.reviews.length
      : null;

  const { reviews, ...rest } = gear;
  return { ...rest, averageRating: avgRating, reviewCount: reviews.length };
};

const getAllGear = async (filters: GearFilters) => {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.GearItemWhereInput = {
    status: "ACTIVE",
  };

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.brand) where.brand = { contains: filters.brand, mode: "insensitive" };
  if (filters.available) where.availableQuantity = { gt: 0 };
  if (filters.minPrice || filters.maxPrice) {
    where.pricePerDay = {};
    if (filters.minPrice) where.pricePerDay.gte = filters.minPrice;
    if (filters.maxPrice) where.pricePerDay.lte = filters.maxPrice;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { brand: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.gearItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: gearInclude,
    }),
    prisma.gearItem.count({ where }),
  ]);

  return {
    items: items.map(withAverageRating),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getGearById = async (id: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id },
    include: {
      ...gearInclude,
      reviews: {
        include: {
          customer: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!gear) throw notFound("Gear item");

  return withAverageRating(gear);
};

export const gearService = {
  getAllGear,
  getGearById,
};

export const providerGearService = {
  createGear: async (providerId: string, input: CreateGearInput) => {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) throw notFound("Category");

    return prisma.gearItem.create({
      data: {
        ...input,
        providerId,
        availableQuantity: input.quantity,
        specifications: input.specifications as Prisma.InputJsonValue,
      },
      include: gearInclude,
    });
  },

  getMyGear: async (providerId: string) => {
    return prisma.gearItem.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
      include: gearInclude,
    });
  },

  updateGear: async (
    providerId: string,
    gearId: string,
    input: UpdateGearInput
  ) => {
    const gear = await prisma.gearItem.findFirst({
      where: { id: gearId, providerId },
    });

    if (!gear) throw notFound("Gear item");

    return prisma.gearItem.update({
      where: { id: gearId },
      data: {
        ...input,
        specifications: input.specifications as Prisma.InputJsonValue | undefined,
      },
      include: gearInclude,
    });
  },

  deleteGear: async (providerId: string, gearId: string) => {
    const gear = await prisma.gearItem.findFirst({
      where: { id: gearId, providerId },
    });

    if (!gear) throw notFound("Gear item");

    await prisma.gearItem.delete({ where: { id: gearId } });
  },
};
