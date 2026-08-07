import { ApiResponse } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function clientFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  return res.json();
}
