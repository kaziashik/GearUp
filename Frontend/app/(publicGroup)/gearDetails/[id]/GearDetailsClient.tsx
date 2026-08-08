"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, MapPin, Shield, Package, Clock, User, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
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

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: { name: string };
  createdAt: string;
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

  const images = gear.images && gear.images.length > 0
    ? gear.images
    : ["https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200"];
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Fetch reviews
    fetch(`${API_URL}/api/reviews?gearId=${gear.id}&limit=5`)
      .then((r) => r.json())
      .then((j) => setReviews(j.data || []))
      .catch(() => {});

    // Fetch related gear (same category)
    if (gear.categoryId) {
      fetch(`${API_URL}/api/gear?categoryId=${gear.categoryId}&limit=3`)
        .then((r) => r.json())
        .then((j) => setRelatedGear((j.data || []).filter((g: GearItem) => g.id !== gear.id).slice(0, 3)))
        .catch(() => {});
    }
  }, [gear.id, gear.categoryId]);

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

  function nextImage() {
    setSelectedImageIdx((prev) => (prev + 1) % images.length);
  }

  function prevImage() {
    setSelectedImageIdx((prev) => (prev - 1 + images.length) % images.length);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/gear" className="hover:text-primary">Browse Gear</Link>
            <span>/</span>
            <span className="text-foreground">{gear.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 animate-fade-in">
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-72 md:h-[480px] rounded-2xl overflow-hidden bg-muted group">
              <Image
                src={images[selectedImageIdx]}
                alt={gear.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              {gear.availableQuantity < 1 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">Currently Unavailable</Badge>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={cn(
                      "relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                      selectedImageIdx === idx ? "border-primary ring-2 ring-primary" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt={`${gear.name} ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Booking */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{gear.category?.name}</Badge>
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
                  <span className="font-semibold">{gear.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">({gear.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(Number(gear.pricePerDay))}
              </p>
              <span className="text-muted-foreground">per day</span>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className="font-semibold">{gear.availableQuantity} available</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Condition</p>
                  <p className="font-semibold">{gear.condition}</p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{gear.description}</p>

            {gear.provider && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Provided by</p>
                    <p className="font-semibold text-lg">{gear.provider.name}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Select Rental Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
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
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements or questions..."
                    rows={3}
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleRent}
                  disabled={loading || gear.availableQuantity < 1}
                >
                  {gear.availableQuantity < 1 ? "Currently Unavailable" : loading ? "Processing..." : "Rent Now"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Free cancellation up to 24 hours before rental start
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{review.user.name}</p>
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
                              i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related Items */}
        {relatedGear.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">You Might Also Like</h2>
              <Button variant="outline" asChild>
                <Link href={`/gear?categoryId=${gear.categoryId}`}>View More</Link>
              </Button>
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
