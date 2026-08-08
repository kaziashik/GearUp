import { Role } from "../../../prisma/generated/prisma";

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
  address?: string;
  image?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleLoginInput {
  idToken: string;
  role?: Role;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string | null;
  address: string | null;
  image: string | null;
  status: string;
  createdAt: Date;
}
