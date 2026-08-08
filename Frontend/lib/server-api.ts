import "server-only";
import { API_URL } from "./api";
import { ApiResponse } from "./types";
import { getAccessToken } from "@/service/refreshToken";

/** Public API paths that work without an access token. */
function isPublicApiPath(path: string): boolean {
  const clean = path.split("?")[0] || path;
  return (
    clean.startsWith("/api/gear") ||
    clean.startsWith("/api/categories") ||
    clean.startsWith("/api/reviews") ||
    clean.startsWith("/api/auth/login") ||
    clean.startsWith("/api/auth/register") ||
    clean.startsWith("/api/auth/google") ||
    clean.startsWith("/api/auth/refresh-token")
  );
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const publicPath = isPublicApiPath(path);

    let accessToken: string | null = null;
    try {
      accessToken = await getAccessToken();
    } catch {
      // Cookie refresh can fail in Server Components — public paths still proceed
      accessToken = null;
    }

    if (!accessToken && !publicPath) {
      return {
        success: false,
        message: "User not logged in!",
      } as ApiResponse<T>;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (accessToken) {
      (headers as Record<string, string>)["Cookie"] = `accessToken=${accessToken}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });

    const data = (await res.json().catch(() => ({
      success: false,
      message: "Unexpected server response",
    }))) as ApiResponse<T>;

    return data;
  } catch (error) {
    console.error("apiFetch error:", error);
    return {
      success: false,
      message: "Something went wrong while making the request",
    } as ApiResponse<T>;
  }
}
