"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function PayOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{ totalAmount: number; status: string } | null>(null);

  useEffect(() => {
    fetch(`/api/rentals/${id}`)
      .then((r) => r.json())
      .then((j) => setOrder(j.data));
  }, [id]);

  async function pay(method: "STRIPE" | "SSLCOMMERZ") {
    setLoading(true);
    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rentalOrderId: id, method }),
    });
    const json = await res.json();
    setLoading(false);

    if (json.success && json.data?.checkoutUrl) {
      window.location.href = json.data.checkoutUrl;
    } else if (json.success) {
      toast.success(json.message || "Payment initiated");
      router.push("/success");
    } else {
      toast.error(json.message || "Payment failed");
    }
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order && (
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(Number(order.totalAmount))}
            </p>
          )}
          <Button className="w-full" disabled={loading} onClick={() => pay("STRIPE")}>
            Pay with Stripe
          </Button>
          <Button className="w-full" variant="outline" disabled={loading} onClick={() => pay("SSLCOMMERZ")}>
            Pay with SSLCommerz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
