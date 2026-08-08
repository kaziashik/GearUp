"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function ReviewPage() {
  const { id: rentalOrderId } = useParams<{ id: string }>();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [gearItemId, setGearItemId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/rentals/${rentalOrderId}`)
      .then((r) => r.json())
      .then((j) => setGearItemId(j.data?.items?.[0]?.gearItemId || j.data?.items?.[0]?.gearItem?.id));
  }, [rentalOrderId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/reviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gearItemId, rentalOrderId, rating, comment }),
    });
    const json = await res.json();
    setLoading(false);

    if (json.success) {
      toast.success("Review submitted!");
      router.push("/customer-dashboard/orders");
    } else {
      toast.error(json.message);
    }
  }

  return (
    <Card className="max-w-md mx-auto animate-fade-in">
      <CardHeader><CardTitle>Leave a Review</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating: {rating}/5</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-none text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Comment</Label>
            <Textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this gear..."
              rows={5}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
