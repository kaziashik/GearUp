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
      <div className="w-full px-3 md:px-4 py-6">
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

        <div className="grid lg:grid-cols-4 gap-3 md:gap-4">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="p-2 md:p-3 space-y-3 lg:sticky top-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-sm">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Filters
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden h-7 w-7"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search gear..."
                    defaultValue={search}
                    className="pl-8 h-8 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && updateParams("search", (e.target as HTMLInputElement).value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Category</label>
                <Select value={categoryId || "all"} onValueChange={(v) => updateParams("categoryId", v === "all" ? "" : v)}>
                  <SelectTrigger className="h-8 text-sm">
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
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Brand</label>
                <Input
                  placeholder="Filter by brand"
                  defaultValue={brand}
                  className="h-8 text-sm"
                  onBlur={(e) => updateParams("brand", e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Price Range (per day)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min $"
                    type="number"
                    defaultValue={minPrice}
                    className="h-8 text-sm"
                    onBlur={(e) => updateParams("minPrice", e.target.value)}
                  />
                  <Input
                    placeholder="Max $"
                    type="number"
                    defaultValue={maxPrice}
                    className="h-8 text-sm"
                    onBlur={(e) => updateParams("maxPrice", e.target.value)}
                  />
                </div>
              </div>

              {hasFilters && (
                <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => router.push("/gear")}>
                  Clear All
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : `${meta.total || 0} items found`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sort || "default"} onValueChange={(v) => updateParams("sort", v === "default" ? "" : v)}>
                  <SelectTrigger className="w-[150px] md:w-[180px]">
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
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <GearCardSkeleton key={i} />
                ))}
              </div>
            ) : gear.length === 0 ? (
              <div className="text-center py-16 border rounded-xl">
                <p className="text-muted-foreground mb-2">No gear found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {gear.map((g) => (
                    <GearCard key={g.id} gear={g} />
                  ))}
                </div>
                <div className="mt-6">
                  <Pagination
                    page={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={(p) => updateParams("page", String(p))}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
