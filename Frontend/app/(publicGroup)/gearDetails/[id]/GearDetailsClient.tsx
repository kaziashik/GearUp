"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Calendar,
  Package,
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GearCard } from "../../_components/GearCard";
import { GearItem } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { API_URL } from "@/lib/api";

const FALLBACK_IMAGE = "https://placehold.co/1200x800/0f766e/ffffff/png?text=GearUp";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user?: { name: string };
  customer?: { name: string };
  createdAt: string;
}

function formatSpecKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function daysBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) return 0;
  return Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24));
}

export function GearDetailsClient({ gear }: { gear: GearItem }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedGear, setRelatedGear] = useState<GearItem[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const rawImages =
    gear.images && gear.images.length > 0 ? gear.images : [FALLBACK_IMAGE];
  const images = rawImages.map((img, idx) =>
    imageErrors[idx] ? FALLBACK_IMAGE : img
  );
  const today = new Date().toISOString().split("T")[0];
  const rentalDays = daysBetween(startDate, endDate);
  const estimatedTotal = rentalDays * Number(gear.pricePerDay);

  const specs = useMemo(() => {
    if (!gear.specifications || typeof gear.specifications !== "object") return [];
    return Object.entries(gear.specifications).filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    );
  }, [gear.specifications]);

  useEffect(() => {
    fetch(`${API_URL}/api/reviews?gearId=${gear.id}&limit=6`)
      .then((r) => r.json())
      .then((j) => setReviews(j.data || []))
      .catch(() => {});

    if (gear.category?.id) {
      fetch(`${API_URL}/api/gear?categoryId=${gear.category.id}&limit=4`)
        .then((r) => r.json())
        .then((j) =>
          setRelatedGear(
            (j.data || [])
              .filter((g: GearItem) => g.id !== gear.id)
              .slice(0, 3)
          )
        )
        .catch(() => {});
    }
  }, [gear.id, gear.category?.id]);

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
      toast.error(json.message || "Failed to create rental. Please login first.");
      if (json.message?.toLowerCase().includes("auth") || res.status === 401) {
        router.push(`/login?redirectTo=/gearDetails/${gear.id}`);
      }
    }
  }

  function nextImage() {
    setSelectedImageIdx((prev) => (prev + 1) % images.length);
  }

  function prevImage() {
    setSelectedImageIdx((prev) => (prev - 1 + images.length) % images.length);
  }

  function markImageError(idx: number) {
    setImageErrors((prev) => ({ ...prev, [idx]: true }));
  }

  function scrollToRent() {
    document.getElementById("rent-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div>
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
            <Link
              href="/gear"
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Link>
            <span className="opacity-40">/</span>
            {gear.category?.name && (
              <>
                <Link
                  href={`/gear?categoryId=${gear.category.id}`}
                  className="hover:text-primary"
                >
                  {gear.category.name}
                </Link>
                <span className="opacity-40">/</span>
              </>
            )}
            <span className="text-foreground line-clamp-1">{gear.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10 animate-fade-in">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 mb-14">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative h-72 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden bg-muted group">
              <Image
                src={images[selectedImageIdx]}
                alt={gear.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => markImageError(selectedImageIdx)}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-xs">
                    {selectedImageIdx + 1} / {images.length}
                  </div>
                </>
              )}
              {gear.availableQuantity < 1 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge className="text-base px-4 py-2 bg-red-600">
                    Currently Unavailable
                  </Badge>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={cn(
                      "relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                      selectedImageIdx === idx
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${gear.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      onError={() => markImageError(idx)}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description + Specs */}
            <div className="space-y-6 pt-2">
              <section>
                <h2 className="text-xl font-bold mb-3">About this gear</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {gear.description ||
                    "High-quality rental gear maintained and verified by trusted providers."}
                </p>
              </section>

              {specs.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-3">Specifications</h2>
                  <div className="rounded-xl border overflow-hidden">
                    <dl className="divide-y">
                      {specs.map(([key, value]) => (
                        <div
                          key={key}
                          className="grid grid-cols-2 gap-4 px-4 py-3 text-sm bg-card"
                        >
                          <dt className="text-muted-foreground">
                            {formatSpecKey(key)}
                          </dt>
                          <dd className="font-medium text-right">
                            {String(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </section>
              )}

              <section className="grid sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: Shield,
                    title: "Verified Provider",
                    text: "Quality-checked gear",
                  },
                  {
                    icon: Clock,
                    title: "Flexible Dates",
                    text: "Pick your rental window",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Easy Cancel",
                    text: "Free within 24 hours",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border bg-muted/30 p-4 space-y-1"
                  >
                    <item.icon className="h-5 w-5 text-primary mb-2" />
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </section>

              {gear.provider && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Provided by</p>
                      <p className="font-semibold text-lg">{gear.provider.name}</p>
                      {gear.provider.email && (
                        <p className="text-xs text-muted-foreground">
                          {gear.provider.email}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sticky rent panel */}
          <div className="lg:sticky lg:top-24 h-fit space-y-5" id="rent-panel">
            <div>
              {gear.category?.name && (
                <Badge variant="secondary" className="mb-2">
                  {gear.category.name}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{gear.name}</h1>
              <p className="text-lg text-muted-foreground">{gear.brand}</p>
              {gear.averageRating != null && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.floor(gear.averageRating!)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">
                    {gear.averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ({gear.reviewCount || reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(Number(gear.pricePerDay))}
              </p>
              <span className="text-muted-foreground">per day</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/50 border">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Availability</p>
                  <p className="font-semibold">
                    {gear.availableQuantity > 0
                      ? `${gear.availableQuantity} in stock`
                      : "Out of stock"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">
                    {gear.status?.toLowerCase() || "active"}
                  </p>
                </div>
              </div>
            </div>

            <Card className="shadow-md border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Rent this gear
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      min={startDate || today}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Pickup notes, size preference, etc."
                    rows={3}
                  />
                </div>

                {rentalDays > 0 && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {formatCurrency(Number(gear.pricePerDay))} × {rentalDays}{" "}
                        day{rentalDays > 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(estimatedTotal)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Final amount confirmed at checkout
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleRent}
                  disabled={loading || gear.availableQuantity < 1}
                >
                  {gear.availableQuantity < 1
                    ? "Currently Unavailable"
                    : loading
                      ? "Processing..."
                      : "Rent Now"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Free cancellation up to 24 hours before start
                </p>
              </CardContent>
            </Card>

            {/* Mobile quick CTA duplicate removed; sticky panel covers it */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-primary">
                  {formatCurrency(Number(gear.pricePerDay))}
                  <span className="text-xs font-normal text-muted-foreground">
                    /day
                  </span>
                </p>
              </div>
              <Button onClick={scrollToRent} disabled={gear.availableQuantity < 1}>
                Rent Now
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {review.user?.name ||
                            review.customer?.name ||
                            "Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {relatedGear.length > 0 && (
          <div className="pb-20 lg:pb-0">
            <div className="flex items-center justify-between mb-6 gap-3">
              <h2 className="text-2xl font-bold">You Might Also Like</h2>
              {gear.category?.id && (
                <Button variant="outline" asChild>
                  <Link href={`/gear?categoryId=${gear.category.id}`}>
                    View More
                  </Link>
                </Button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedGear.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
