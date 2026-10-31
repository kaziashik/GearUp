"use server";

import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

type JwtPayload = { exp?: number };

/** Decode JWT payload without verifying (backend verifies signatures). */
function decodePayload(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized)) as JwtPayload;
  } catch {
    return null;
  }
}

function isExpiringSoon(token: string, skewMs = 30_000): boolean {
  const payload = decodePayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now() + skewMs;
}

async function setTokenCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();
  try {
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }
  } catch {
    // Cookie writes only work in Server Actions / Route Handlers
  }
}

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh token not found!",
    };
  }

  const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refreshToken=${refreshToken}`,
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  const result = await res.json();
  return result;
};

/**
 * Return a usable access token for server-side API calls.
 * Does NOT verify JWT secrets locally (avoids Vercel secret mismatch / login loops).
 * Backend verifies signatures on each request.
 */
export const getAccessToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  // Fresh enough access token → use it
  if (accessToken && !isExpiringSoon(accessToken)) {
    return accessToken;
  }

  // Access missing/expiring → refresh via backend
  if (refreshToken) {
    const result = await getNewAccessToken();
    if (result.success && result.data?.accessToken) {
      await setTokenCookies(result.data.accessToken, result.data.refreshToken);
      return result.data.accessToken as string;
    }
  }

  // Last resort: still return access token if present (backend may accept)
  return accessToken;
};
