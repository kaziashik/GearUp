import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch(`${API_URL}/api/provider/orders`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return NextResponse.json(await res.json());
}
