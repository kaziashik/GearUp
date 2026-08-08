import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { badRequest, notFound, unauthorized } from "../../utils/AppError";
import { ChangePasswordInput, UpdateProfileInput } from "./user.interface";

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true,
      image: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw notFound("User");

  return user;
};

const updateMyProfile = async (userId: string, input: UpdateProfileInput) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: input,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true,
      image: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const changePassword = async (userId: string, input: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw notFound("User");

  if (!user.password) {
    throw badRequest("Google account has no password. Login with Google instead.");
  }

  const isMatch = await bcrypt.compare(input.currentPassword, user.password);

  if (!isMatch) {
    throw unauthorized("Current password is incorrect");
  }

  if (input.newPassword.length < 6) {
    throw badRequest("New password must be at least 6 characters");
  }

  const hashed = await bcrypt.hash(input.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
};

const deleteAccount = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
};

export const userService = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteAccount,
};
