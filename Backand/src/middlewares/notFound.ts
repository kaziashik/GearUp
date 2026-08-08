import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  sendResponse(res, {
    success: false,
    statusCode: 404,
    message: "API route not found",
  });
};

export default notFound;
