import prisma from "../../lib/prisma";
import { conflict, notFound } from "../../utils/AppError";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.interface";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { gearItems: true } } },
  });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { gearItems: true } } },
  });

  if (!category) throw notFound("Category");

  return category;
};

const createCategory = async (input: CreateCategoryInput) => {
  const slug = slugify(input.name);

  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: input.name }, { slug }] },
  });

  if (existing) throw conflict("Category already exists");

  return prisma.category.create({
    data: { ...input, slug },
  });
};

const updateCategory = async (id: string, input: UpdateCategoryInput) => {
  await getCategoryById(id);

  const data: UpdateCategoryInput & { slug?: string } = { ...input };

  if (input.name) {
    data.slug = slugify(input.name);
  }

  return prisma.category.update({ where: { id }, data });
};

const deleteCategory = async (id: string) => {
  await getCategoryById(id);
  await prisma.category.delete({ where: { id } });
};

export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
