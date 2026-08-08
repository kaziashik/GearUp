"use server";

import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import { AuthResponse, Role } from "@/lib/types";

async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

async function authRequest<T>(path: string, body: object): Promise<{ success: boolean; message: string; data?: T }> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function loginAction(email: string, password: string) {
  const result = await authRequest<AuthResponse>("/api/auth/login", { email, password });
  if (result.success && result.data) {
    await setAuthCookies(result.data.accessToken, result.data.refreshToken);
  }
  return result;
}

export async function registerAction(data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
  image?: string;
}) {
  const result = await authRequest<AuthResponse>("/api/auth/register", data);
  if (result.success && result.data) {
    await setAuthCookies(result.data.accessToken, result.data.refreshToken);
  }
  return result;
}

export async function googleLoginAction(idToken: string, role?: Role) {
  const result = await authRequest<AuthResponse>("/api/auth/google", { idToken, role });
  if (result.success && result.data) {
    await setAuthCookies(result.data.accessToken, result.data.refreshToken);
  }
  return result;
}
