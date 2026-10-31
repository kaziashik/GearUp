import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/service/refreshToken";

export async function POST(req: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to create a payment" },
        { status: 401 }
      );
    }

    const body = await req.text();
    const res = await fetch(`${API_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}`,
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
    console.error("Payment create proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Payment session creation failed" },
      { status: 500 }
    );
  }
}
