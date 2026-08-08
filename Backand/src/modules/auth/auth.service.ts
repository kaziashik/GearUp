import bcrypt from "bcryptjs";
import { TokenPayload } from "google-auth-library";
import {
  AuthProvider,
  Role,
  User,
} from "../../../prisma/generated/prisma";
import prisma from "../../lib/prisma";
import { config } from "../../config";
import { googleClient } from "../../lib/googleAuth";
import { jwtUtils } from "../../utils/jwt";
import { badRequest, conflict, forbidden, unauthorized } from "../../utils/AppError";
import {
  AuthUser,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
} from "./auth.interface";
import { JwtPayload } from "jsonwebtoken";

const sanitizeUser = (user: AuthUser) => {
  const { ...rest } = user;
  return rest;
};

const setTokenCookies = (
  res: { cookie: (name: string, val: string, opts: object) => void },
  accessToken: string,
  refreshToken: string
) => {
  const cookieOptions = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const issueAuthTokens = async (
  user: Pick<User, "id" | "email" | "role" | "name">,
  res: { cookie: (name: string, val: string, opts: object) => void }
) => {
  const tokenPayload = { 
    userId: user.id, 
    email: user.email, 
    role: user.role,
    name: user.name 
  };
  
  const accessToken = jwtUtils.createToken(
    tokenPayload,
    config.jwt.accessSecret,
    config.jwt.accessExpiresIn
  );
  
  const refreshToken = jwtUtils.createToken(
    tokenPayload,
    config.jwt.refreshSecret,
    config.jwt.refreshExpiresIn
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  setTokenCookies(res, accessToken, refreshToken);

  return { accessToken, refreshToken };
};

const register = async (
  input: RegisterInput,
  res: { cookie: (name: string, val: string, opts: object) => void }
) => {
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    if (existing.authProvider === AuthProvider.GOOGLE && !existing.password) {
      throw conflict("Email registered with Google. Please login with Google.");
    }
    throw conflict("Email already registered");
  }

  if (input.role === Role.ADMIN) {
    throw badRequest("Cannot register as admin");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: input.name,
      role: input.role,
      phone: input.phone,
      address: input.address,
      image: input.image,
      authProvider: AuthProvider.CREDENTIALS,
      emailVerified: false,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true,
      image: true,
      status: true,
      authProvider: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  const tokens = await issueAuthTokens(user, res);

  return { user: sanitizeUser(user as AuthUser), ...tokens };
};

const login = async (
  input: LoginInput,
  res: { cookie: (name: string, val: string, opts: object) => void }
) => {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw unauthorized("Invalid email or password");
  }

  if (user.status === "SUSPENDED") {
    throw unauthorized("Account suspended");
  }

  if (!user.password && user.googleId) {
    throw badRequest(
      "Account registered with Google. Please login with Google."
    );
  }

  if (!user.password) {
    throw unauthorized("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(input.password, user.password);

  if (!isMatch) {
    throw unauthorized("Invalid email or password");
  }

  const tokens = await issueAuthTokens(user, res);

  const { password: _, refreshToken: __, ...safeUser } = user;

  return { user: safeUser, ...tokens };
};

const verifyGoogleIdToken = async (idToken: string): Promise<TokenPayload> => {
  if (!config.google.clientId) {
    throw badRequest("Google login is not configured");
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.name || !payload.sub) {
      throw badRequest("Invalid Google token payload");
    }

    return payload;
  } catch {
    throw unauthorized("Invalid or expired Google ID token");
  }
};

const googleLogin = async (
  input: GoogleLoginInput,
  res: { cookie: (name: string, val: string, opts: object) => void }
) => {
  const googlePayload = await verifyGoogleIdToken(input.idToken);
  const email = googlePayload.email!.trim().toLowerCase();

  let user = await prisma.user.findFirst({
    where: {
      googleId: googlePayload.sub,
      email,
    },
  });

  if (!user) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.status === "SUSPENDED") {
        throw forbidden("Account suspended");
      }

      if (existingUser.googleId && existingUser.googleId !== googlePayload.sub) {
        throw conflict("Email already linked to another Google account");
      }

      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId: googlePayload.sub,
          emailVerified: true,
          authProvider:
            existingUser.password === null
              ? AuthProvider.GOOGLE
              : existingUser.authProvider,
        },
      });
    } else {
      const role = input.role || Role.CUSTOMER;

      if (role === Role.ADMIN) {
        throw badRequest("Cannot register as admin with Google");
      }

      user = await prisma.user.create({
        data: {
          name: googlePayload.name!,
          email,
          role,
          googleId: googlePayload.sub,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
        },
      });
    }
  }

  if (user.status === "SUSPENDED") {
    throw forbidden("Account suspended");
  }

  const tokens = await issueAuthTokens(user, res);

  const safeUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true,
      status: true,
      authProvider: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return { user: safeUser, ...tokens };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true,
      status: true,
      authProvider: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw unauthorized("User not found");
  }

  return user;
};

const refreshToken = async (
  token: string,
  res: { cookie: (name: string, val: string, opts: object) => void }
) => {
  if (!token) {
    throw unauthorized("Refresh token required");
  }

  const verifiedToken = jwtUtils.verifyToken(token, config.jwt.refreshSecret);
  
  if (!verifiedToken.success) {
    throw unauthorized(verifiedToken.error || "Invalid refresh token");
  }

  const { userId } = verifiedToken.data as JwtPayload;

  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, status: true, refreshToken: true }
  });

  if (!user || user.refreshToken !== token) {
    throw unauthorized("Invalid refresh token");
  }

  if (user.status === "SUSPENDED") {
    throw forbidden("Account suspended");
  }

  return issueAuthTokens(user, res);
};

const logout = async (
  userId: string,
  res: { clearCookie: (name: string) => void }
) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

export const authService = {
  register,
  login,
  googleLogin,
  getMe,
  refreshToken,
  logout,
};
