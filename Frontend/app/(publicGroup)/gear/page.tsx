"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GearCardSkeleton } from "@/components/ui/skeleton";
import { GearCard, Pagination } from "../_components/GearCard";
import { GearItem, Category } from "@/lib/types";
import { API_URL } from "@/lib/api";

export default function GearBrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gear, setGear] = useState<GearItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const fetchGear = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "9" });
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (brand) params.set("brand", brand);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("available", "true");

    const res = await fetch(`${API_URL}/api/gear?${params}`);
    const json = await res.json();
    setGear(json.data || []);
    setMeta(json.meta || { page: 1, totalPages: 1 });
    setLoading(false);
  }, [page, search, categoryId, brand, minPrice, maxPrice]);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((r) => r.json())
      .then((j) => setCategories(j.data || []));
  }, []);

  useEffect(() => {
    fetchGear();
  }, [fetchGear]);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/gear?${params.toString()}`);
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Browse Gear</h1>
        <p className="text-muted-foreground">Find the perfect equipment for your next adventure</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border p-4 space-y-4 sticky top-24">
            <div className="flex items-center gap-2 font-semibold">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gear..."
                defaultValue={search}
                className="pl-9"
                onKeyDown={(e) => e.key === "Enter" && updateParams("search", (e.target as HTMLInputElement).value)}
              />
            </div>
            <Select value={categoryId || "all"} onValueChange={(v) => updateParams("categoryId", v === "all" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Brand" defaultValue={brand} onBlur={(e) => updateParams("brand", e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Min $" type="number" defaultValue={minPrice} onBlur={(e) => updateParams("minPrice", e.target.value)} />
              <Input placeholder="Max $" type="number" defaultValue={maxPrice} onBlur={(e) => updateParams("maxPrice", e.target.value)} />
            </div>
            <Button variant="outline" className="w-full" onClick={() => router.push("/gear")}>
              Clear Filters
            </Button>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <GearCardSkeleton key={i} />
              ))}
            </div>
          ) : gear.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No gear found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {gear.map((g) => (
                  <GearCard key={g.id} gear={g} />
                ))}
              </div>
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(p) => updateParams("page", String(p))}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
