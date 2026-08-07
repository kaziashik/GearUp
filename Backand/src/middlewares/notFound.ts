import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  sendResponse({
    res,
    statusCode: 404,
    success: false,
    message: "API route not found",
  });
};

export default notFound;
