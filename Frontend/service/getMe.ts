"use server";

import { cookies } from "next/headers";
import { apiFetch } from "@/lib/server-api";
import { User } from "@/lib/types";
import { getAccessToken } from "./refreshToken";

export async function getMe(): Promise<User | null> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return null;
    }

    const res = await apiFetch<User>("/api/auth/me");
    if (!res.success || !res.data) return null;
    return res.data;
  } catch (error) {
    console.error("Get me error:", error);
    return null;
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  
  // Delete cookies (no need to call backend as tokens are stateless JWT)
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
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    cookieStore.set("refreshToken", res.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return res.data;
  }
  return null;
}
