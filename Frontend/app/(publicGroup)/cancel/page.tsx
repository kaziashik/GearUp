import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
      <XCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your payment was not completed. You can try again from your dashboard when ready.
      </p>
      <Button asChild><Link href="/customer-dashboard">Back to Dashboard</Link></Button>
    </div>
  );
}
