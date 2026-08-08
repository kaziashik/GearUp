"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthenticationFallback() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 2 seconds if still showing this
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground mb-2">Authenticating...</p>
        <p className="text-sm text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
}
