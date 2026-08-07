import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/server-api";
import { GearItem } from "@/lib/types";
import { GearDetailsClient } from "./GearDetailsClient";

export default async function GearDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await apiFetch<GearItem>(`/api/gear/${id}`);
  if (!res.success || !res.data) notFound();

  return <GearDetailsClient gear={res.data} />;
}
