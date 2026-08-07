import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
      <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your rental payment has been processed. You can track your order status in your dashboard.
      </p>
      <Button asChild><Link href="/customer-dashboard">Go to Dashboard</Link></Button>
    </div>
  );
}
