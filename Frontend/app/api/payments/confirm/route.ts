import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/service/refreshToken";

export async function POST(req: NextRequest) {
  try {
    // Auth optional — backend verifies session_id with Stripe
    const accessToken = await getAccessToken().catch(() => null);
    const body = await req.text();

    const res = await fetch(`${API_URL}/api/payments/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
              Cookie: `accessToken=${accessToken}`,
            }
          : {}),
      },
      body,
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({
      success: false,
      message: "Unexpected server response",
    }));

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Payment confirm proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Payment confirmation failed" },
      { status: 500 }
    );
  }
}
