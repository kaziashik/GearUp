"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-6">We encountered an unexpected error. Please try again.</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
