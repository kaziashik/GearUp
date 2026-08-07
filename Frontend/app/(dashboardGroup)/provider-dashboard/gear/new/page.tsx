"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddGearPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/provider/gear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: form.get("categoryId"),
        name: form.get("name"),
        description: form.get("description"),
        brand: form.get("brand"),
        pricePerDay: Number(form.get("pricePerDay")),
        quantity: Number(form.get("quantity")),
        images: [(form.get("imageUrl") as string) || "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800"],
      }),
    });
    const json = await res.json();
    setLoading(false);

    if (json.success) {
      toast.success("Gear added successfully!");
      router.push("/provider-dashboard/gear");
    } else {
      toast.error(json.message);
    }
  }

  return (
    <Card className="max-w-2xl animate-fade-in">
      <CardHeader><CardTitle>Add New Gear</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Category ID</Label><Input name="categoryId" required placeholder="UUID from categories" /></div>
          <div className="space-y-2"><Label>Name</Label><Input name="name" required /></div>
          <div className="space-y-2"><Label>Brand</Label><Input name="brand" required /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea name="description" required minLength={10} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Price/Day ($)</Label><Input name="pricePerDay" type="number" step="0.01" required /></div>
            <div className="space-y-2"><Label>Quantity</Label><Input name="quantity" type="number" required /></div>
          </div>
          <div className="space-y-2"><Label>Image URL</Label><Input name="imageUrl" type="url" placeholder="https://..." /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving..." : "Add Gear"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
