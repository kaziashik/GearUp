import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/rentals/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return NextResponse.json(await res.json());
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/rentals/${id}/cancel`, {
    method: "PATCH",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return NextResponse.json(await res.json());
}
