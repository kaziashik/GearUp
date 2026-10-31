"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ConfirmState = "idle" | "loading" | "success" | "error";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<ConfirmState>(
    sessionId ? "loading" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("idle");
      return;
    }

    let cancelled = false;

    (async () => {
      setStatus("loading");
      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();

        if (cancelled) return;

        if (data.success) {
          setStatus("success");
          toast.success("Payment confirmed successfully!");
        } else {
          // Never show green success UI with a red failure toast
          setStatus("error");
          setErrorMessage(data.message || "Payment confirmation failed");
        }
      } catch (error) {
        console.error("Payment confirmation error:", error);
        if (cancelled) return;
        setStatus("error");
        setErrorMessage("Payment confirmation failed");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
        <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
        <h1 className="text-3xl font-bold mb-4">Confirming Payment...</h1>
        <p className="text-muted-foreground">
          Please wait while we verify your payment with Stripe.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
        <XCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Confirmation Issue</h1>
        <p className="text-muted-foreground mb-2 max-w-md mx-auto">
          {errorMessage}
        </p>
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          If Stripe charged you, your order may still update shortly via webhook.
          Check your dashboard or contact support.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/customer-dashboard/orders">View Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customer-dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {sessionId
          ? "Your rental payment has been confirmed. You can track your order status in your dashboard."
          : "Your rental payment has been processed. You can track your order status in your dashboard."}
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
