import { NextFunction, Request, Response } from "express";
import { Role } from "../../prisma/generated/prisma";
import { verifyAccessToken } from "../utils/jwt";
import { forbidden, unauthorized } from "../utils/AppError";
import prisma from "../lib/prisma";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw unauthorized("Access token required");
    }

    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      throw unauthorized("User not found");
    }

    if (user.status === "SUSPENDED") {
      throw forbidden("Account suspended");
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(forbidden("Insufficient permissions"));
    }

    next();
  };
};
