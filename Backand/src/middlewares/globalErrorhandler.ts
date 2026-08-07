import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import sendResponse from "../utils/sendResponse";

const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "Validation error",
      data: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return sendResponse({
      res,
      statusCode: err.statusCode,
      success: false,
      message: err.message,
    });
  }

  console.error("Unhandled error:", err);

  return sendResponse({
    res,
    statusCode: 500,
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
};

export default globalErrorHandler;
