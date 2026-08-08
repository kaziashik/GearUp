import { NextFunction, Request, Response } from "express";
import { Role } from "../../prisma/generated/prisma";
import { jwtUtils } from "../utils/jwt";
import { forbidden, unauthorized } from "../utils/AppError";
import prisma from "../lib/prisma";
import { config } from "../config";
import { catchAsync } from "../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: Role;
        name: string;
      };
    }
  }
}

export const authenticate = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Check cookies first, then Authorization header
    const token = req.cookies?.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization?.split(" ")[1]
      : req.headers.authorization;

    if (!token) {
      throw unauthorized("You are not logged in. Please log in to access");
    }

    // Verify token using new jwtUtils
    const verifiedToken = jwtUtils.verifyToken(token, config.jwtAccessSecret);
    
    if (!verifiedToken.success) {
      throw unauthorized(verifiedToken.error || "Invalid token");
    }

    const { userId, email, role } = verifiedToken.data as JwtPayload;

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: userId, email, role },
      select: { id: true, email: true, name: true, role: true, status: true },
    });

    if (!user) {
      throw unauthorized("User not found. Please log in again");
    }

    if (user.status === "SUSPENDED") {
      throw forbidden("Your account has been suspended. Please contact support");
    }

    // Attach user to request
    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  }
);

export const authorize = (...roles: Role[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw unauthorized("Authentication required");
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw forbidden(
        "Forbidden. You don't have permission to access this resource"
      );
    }

    next();
  });
};
