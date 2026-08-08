import "server-only";
import { cookies } from "next/headers";
import { API_URL } from "./api";
import { ApiResponse } from "./types";
import { getAccessToken } from "@/service/refreshToken";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken && !path.includes("/auth/login") && !path.includes("/auth/register") && !path.includes("/auth/google")) {
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
