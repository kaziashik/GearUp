import { notFound } from "next/navigation";
import { API_URL } from "@/lib/api";
import { GearItem, ApiResponse } from "@/lib/types";
import { GearDetailsClient } from "./GearDetailsClient";

export default async function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Public page: fetch gear directly (no auth required)
  let gear: GearItem | null = null;
  try {
    const res = await fetch(`${API_URL}/api/gear/${id}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    const json = (await res.json()) as ApiResponse<GearItem>;
    if (json.success && json.data) gear = json.data;
  } catch {
    gear = null;
  }

  if (!gear) notFound();

  return <GearDetailsClient gear={gear} />;
}
