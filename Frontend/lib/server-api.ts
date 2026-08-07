import "server-only";
import { cookies } from "next/headers";
import { API_URL } from "./api";
import { ApiResponse } from "./types";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<ApiResponse<T>> {
  const cookieStore = await cookies();
  const accessToken = token || cookieStore.get("accessToken")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (accessToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
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
}
