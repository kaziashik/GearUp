"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GearItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function GearCard({ gear }: { gear: GearItem }) {
  const image = gear.images?.[0] || "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={gear.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          {gear.availableQuantity > 0 ? (
            <Badge className="absolute top-3 right-3 bg-emerald-600">Available</Badge>
          ) : (
            <Badge variant="secondary" className="absolute top-3 right-3">Unavailable</Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">{gear.brand}</p>
              <h3 className="font-semibold line-clamp-1">{gear.name}</h3>
            </div>
            {gear.averageRating != null && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {gear.averageRating.toFixed(1)}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              {formatCurrency(Number(gear.pricePerDay))}
              <span className="text-sm font-normal text-muted-foreground">/day</span>
            </p>
            <Button size="sm" asChild>
              <Link href={`/gearDetails/${gear.id}`}>
                Rent <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
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
