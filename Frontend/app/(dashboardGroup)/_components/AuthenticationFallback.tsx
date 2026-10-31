"use client";

import { useEffect, useState } from "react";
import { logoutAction } from "@/service/getMe";

export function AuthenticationFallback() {
  const [message, setMessage] = useState("Authenticating...");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await logoutAction();
      } catch {
        // ignore
      }
      if (cancelled) return;
      setMessage("Session expired. Redirecting to login...");
      // Hard navigation so middleware cannot bounce back with stale cookies
      window.location.replace("/login");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-lg text-muted-foreground mb-2">{message}</p>
        <p className="text-sm text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
}
