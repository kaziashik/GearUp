"use server";

import { cookies } from "next/headers";
import { apiFetch } from "@/lib/server-api";
import { User } from "@/lib/types";

export async function getMe(): Promise<User | null> {
  const res = await apiFetch<User>("/api/auth/me");
  if (!res.success || !res.data) return null;
  return res.data;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  await apiFetch("/api/auth/logout", { method: "POST" });
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

export async function refreshTokenAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) return null;

  const res = await apiFetch<{ accessToken: string; refreshToken: string }>(
    "/api/auth/refresh-token",
    {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }
  );

  if (res.success && res.data) {
    cookieStore.set("accessToken", res.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });
    cookieStore.set("refreshToken", res.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res.data;
  }
  return null;
}
