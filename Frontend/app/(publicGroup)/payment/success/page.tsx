"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      confirmPayment(sessionId);
    }
  }, [sessionId]);

  const confirmPayment = async (sessionId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/payments/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Payment confirmed successfully!");
      } else {
        toast.error(data.message || "Payment confirmation failed");
        console.error("Payment confirmation failed:", data);
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      toast.error("Payment confirmation failed");
    }
  };

  if (sessionId && !toast) {
    return (
      <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
        <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
        <h1 className="text-3xl font-bold mb-4">Confirming Payment...</h1>
        <p className="text-muted-foreground">Please wait while we verify your payment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your rental payment has been processed successfully. You can track your order status in your dashboard.
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/customer-dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/gear">Browse More Gear</Link>
        </Button>
      </div>
    </div>
  );
}
