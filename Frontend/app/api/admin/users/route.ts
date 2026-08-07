import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch(`${API_URL}/api/admin/users${req.nextUrl.search}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return NextResponse.json(await res.json());
}
