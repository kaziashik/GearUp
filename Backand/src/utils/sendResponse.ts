import { Response } from "express";

interface SendResponseOptions<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

const sendResponse = <T>({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
  meta,
}: SendResponseOptions<T>) => {
  res.status(statusCode).json({
    success,
    message,
    data,
    meta,
  });
};

export default sendResponse;
