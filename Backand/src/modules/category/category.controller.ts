import { z } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { getParam } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

const getAllCategories = catchAsync(async (_req, res) => {
  const categories = await categoryService.getAllCategories();

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Categories retrieved successfully", data: categories,
   });
});

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(getParam(req.params.id));

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Category retrieved successfully", data: category,
   });
});

const createCategory = catchAsync(async (req, res) => {
  const data = createCategorySchema.parse(req.body);
  const category = await categoryService.createCategory(data);

  sendResponse(res, { success: true, statusCode: 201, message: "Category created successfully", data: category,
   });
});

const updateCategory = catchAsync(async (req, res) => {
  const data = updateCategorySchema.parse(req.body);
  const category = await categoryService.updateCategory(getParam(req.params.id), data);

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Category updated successfully", data: category,
   });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(getParam(req.params.id));

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Category deleted successfully" });
});

export const categoryController = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
