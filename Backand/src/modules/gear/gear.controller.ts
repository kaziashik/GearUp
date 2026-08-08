import { z } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { getParam } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { gearService } from "./gear.service";

const getAllGear = catchAsync(async (req, res) => {
  const filters = {
    categoryId: req.query.categoryId as string | undefined,
    brand: req.query.brand as string | undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    search: req.query.search as string | undefined,
    available: req.query.available === "true",
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
  };

  const result = await gearService.getAllGear(filters);

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Gear items retrieved successfully", data: result.items,
    meta: result.meta,
   });
});

const getGearById = catchAsync(async (req, res) => {
  const gear = await gearService.getGearById(getParam(req.params.id));

  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Gear item retrieved successfully", data: gear,
   });
});

export const gearController = {
  getAllGear,
  getGearById,
};
