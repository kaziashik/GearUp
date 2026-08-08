"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GearItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const FALLBACK_IMAGE = "https://placehold.co/800x600/0f766e/ffffff/png?text=GearUp";

export function GearCard({ gear }: { gear: GearItem }) {
  const [imgSrc, setImgSrc] = useState(
    gear.images?.[0] || FALLBACK_IMAGE
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/gearDetails/${gear.id}`} className="block h-full">
        <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="relative h-48 overflow-hidden bg-muted">
            <Image
              src={imgSrc}
              alt={gear.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 100vw, 33vw"
              onError={() => setImgSrc(FALLBACK_IMAGE)}
            />
            {gear.availableQuantity > 0 ? (
              <Badge className="absolute top-3 right-3 bg-emerald-600">Available</Badge>
            ) : (
              <Badge variant="secondary" className="absolute top-3 right-3">
                Unavailable
              </Badge>
            )}
            {gear.category?.name && (
              <Badge
                variant="secondary"
                className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm"
              >
                {gear.category.name}
              </Badge>
            )}
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{gear.brand}</p>
                <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                  {gear.name}
                </h3>
              </div>
              {gear.averageRating != null && (
                <div className="flex items-center gap-1 text-sm shrink-0">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {gear.averageRating.toFixed(1)}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {gear.description || "Premium rental gear ready for your next adventure."}
            </p>
            <div className="flex items-center justify-between gap-2 pt-1">
              <p className="text-lg font-bold text-primary">
                {formatCurrency(Number(gear.pricePerDay))}
                <span className="text-sm font-normal text-muted-foreground">/day</span>
              </p>
              <Button
                size="sm"
                className="pointer-events-none"
                tabIndex={-1}
              >
                View <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    PLACED: "bg-amber-100 text-amber-800 border-amber-200",
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
    PAID: "bg-purple-100 text-purple-800 border-purple-200",
    PICKED_UP: "bg-emerald-100 text-emerald-800 border-emerald-200",
    RETURNED: "bg-gray-100 text-gray-700 border-gray-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge variant="outline" className={config[status] || ""}>
      {status.replace("_", " ")}
    </Badge>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground px-4">
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
