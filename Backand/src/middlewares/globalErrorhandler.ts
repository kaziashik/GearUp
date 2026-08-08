import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { sendResponse } from "../utils/sendResponse";

const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Validation error",
      data: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return sendResponse(res, {
      success: false,
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  console.error("Unhandled error:", err);

  return sendResponse(res, {
    success: false,
    statusCode: 500,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
};

export default globalErrorHandler;
