"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
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
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";

  const fetchGear = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "9" });
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (brand) params.set("brand", brand);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    params.set("available", "true");

    const res = await fetch(`${API_URL}/api/gear?${params}`);
    const json = await res.json();
    setGear(json.data || []);
    setMeta(json.meta || { page: 1, totalPages: 1, total: 0 });
    setLoading(false);
  }, [page, search, categoryId, brand, minPrice, maxPrice, sort]);

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

  const hasFilters = search || categoryId || brand || minPrice || maxPrice;

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Gear</h1>
            <p className="text-lg text-muted-foreground">
              Find the perfect equipment for your next adventure from our curated collection
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {hasFilters && <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">{[search, categoryId, brand, minPrice, maxPrice].filter(Boolean).length}</span>}
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="rounded-xl border bg-card p-6 space-y-5 lg:sticky top-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  Filters
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search gear..."
                    defaultValue={search}
                    className="pl-9"
                    onKeyDown={(e) => e.key === "Enter" && updateParams("search", (e.target as HTMLInputElement).value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryId || "all"} onValueChange={(v) => updateParams("categoryId", v === "all" ? "" : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Input
                  placeholder="Filter by brand"
                  defaultValue={brand}
                  onBlur={(e) => updateParams("brand", e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range (per day)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min $"
                    type="number"
                    defaultValue={minPrice}
                    onBlur={(e) => updateParams("minPrice", e.target.value)}
                  />
                  <Input
                    placeholder="Max $"
                    type="number"
                    defaultValue={maxPrice}
                    onBlur={(e) => updateParams("maxPrice", e.target.value)}
                  />
                </div>
              </div>

              {hasFilters && (
                <Button variant="outline" className="w-full" onClick={() => router.push("/gear")}>
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : `${meta.total || 0} items found`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sort || "default"} onValueChange={(v) => updateParams("sort", v === "default" ? "" : v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name: A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gear Grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <GearCardSkeleton key={i} />
                ))}
              </div>
            ) : gear.length === 0 ? (
              <div className="text-center py-20 border rounded-xl">
                <p className="text-muted-foreground mb-2">No gear found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
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
    </div>
  );
}
