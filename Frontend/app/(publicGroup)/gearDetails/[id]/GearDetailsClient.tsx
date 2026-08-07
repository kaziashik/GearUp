"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GearItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { API_URL } from "@/lib/api";

export function GearDetailsClient({ gear }: { gear: GearItem }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const image = gear.images?.[0] || "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200";
  const today = new Date().toISOString().split("T")[0];

  async function handleRent() {
    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/rentals/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        items: [{ gearItemId: gear.id, quantity: 1 }],
        notes,
      }),
    });
    const json = await res.json();
    setLoading(false);

    if (json.success && json.data?.id) {
      toast.success("Rental order placed!");
      router.push(`/customer-dashboard/orders/${json.data.id}/pay`);
    } else {
      toast.error(json.message || "Failed to create rental");
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="relative h-72 lg:h-[480px] rounded-2xl overflow-hidden">
          <Image src={image} alt={gear.name} fill className="object-cover" priority />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{gear.category?.name}</Badge>
            <h1 className="text-3xl font-bold">{gear.name}</h1>
            <p className="text-muted-foreground">{gear.brand}</p>
            {gear.averageRating != null && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{gear.averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">({gear.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          <p className="text-lg font-bold text-primary">
            {formatCurrency(Number(gear.pricePerDay))}
            <span className="text-sm font-normal text-muted-foreground"> / day</span>
          </p>

          <p className="text-muted-foreground leading-relaxed">{gear.description}</p>

          {gear.provider && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Provided by</p>
                <p className="font-semibold">{gear.provider.name}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" /> Rent This Gear
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special requests..." />
              </div>
              <Button className="w-full" size="lg" onClick={handleRent} disabled={loading || gear.availableQuantity < 1}>
                {gear.availableQuantity < 1 ? "Unavailable" : loading ? "Processing..." : "Rent Now"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
