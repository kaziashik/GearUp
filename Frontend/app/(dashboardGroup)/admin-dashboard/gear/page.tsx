"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GearItem, Category } from "@/lib/types";
import { Pagination } from "@/app/(publicGroup)/_components/GearCard";
import { Search, Filter, Eye } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function AdminGearPage() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((j) => setCategories(j.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/gear?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((j) => {
        setGear(j.data || []);
        setTotalPages(j.meta?.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = gear.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || g.categoryId === categoryFilter;
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && g.availableQuantity > 0) ||
      (availabilityFilter === "unavailable" && g.availableQuantity === 0);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Gear Management</h1>
        <p className="text-muted-foreground">Manage all platform gear listings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
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
        <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {gear.length} items
      </p>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Brand</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Price/Day</th>
                <th className="text-left p-4 font-semibold">Stock</th>
                <th className="text-left p-4 font-semibold">Provider</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Loading gear...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No gear found
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g.id} className="border-b hover:bg-accent/5 transition-colors">
                    <td className="p-4 font-medium">{g.name}</td>
                    <td className="p-4 text-muted-foreground">{g.brand}</td>
                    <td className="p-4">
                      <Badge variant="secondary">{g.category?.name || "N/A"}</Badge>
                    </td>
                    <td className="p-4 font-semibold">{formatCurrency(Number(g.pricePerDay))}</td>
                    <td className="p-4">
                      <Badge
                        variant={g.availableQuantity > 0 ? "default" : "destructive"}
                        className={g.availableQuantity > 0 ? "bg-green-600" : ""}
                      >
                        {g.availableQuantity} available
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{g.provider?.name || "N/A"}</td>
                    <td className="p-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/gearDetails/${g.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
