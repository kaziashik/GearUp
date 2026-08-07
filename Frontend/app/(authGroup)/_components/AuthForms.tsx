"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAction, googleLoginAction } from "../_actions/authAction";
import { getDashboardPath } from "@/utils/jwt";
import { Role } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await loginAction(email, password);
    setLoading(false);

    if (result.success && result.data) {
      toast.success("Welcome back!");
      const path = redirect || getDashboardPath(result.data.user.role);
      router.push(path);
      router.refresh();
    } else {
      toast.error(result.message || "Login failed");
    }
  }

  async function handleGoogle(credential: string) {
    setLoading(true);
    const result = await googleLoginAction(credential);
    setLoading(false);

    if (result.success && result.data) {
      toast.success("Signed in with Google!");
      router.push(redirect || getDashboardPath(result.data.user.role));
      router.refresh();
    } else {
      toast.error(result.message || "Google login failed");
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your GearUp account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        )}

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(res) => res.credential && handleGoogle(res.credential)}
              onError={() => toast.error("Google sign-in failed")}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export function RegisterForm({ defaultRole }: { defaultRole?: Role }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>(defaultRole || "CUSTOMER");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const { registerAction } = await import("../_actions/authAction");
    const result = await registerAction({
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      role,
      phone: (form.get("phone") as string) || undefined,
    });
    setLoading(false);

    if (result.success && result.data) {
      toast.success("Account created successfully!");
      router.push(getDashboardPath(result.data.user.role));
      router.refresh();
    } else {
      toast.error(result.message || "Registration failed");
    }
  }

  async function handleGoogle(credential: string) {
    setLoading(true);
    const result = await googleLoginAction(credential, role);
    setLoading(false);

    if (result.success && result.data) {
      toast.success("Account created with Google!");
      router.push(getDashboardPath(result.data.user.role));
      router.refresh();
    } else {
      toast.error(result.message || "Google sign-up failed");
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>Join GearUp as a customer or provider</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {(["CUSTOMER", "PROVIDER"] as Role[]).map((r) => (
            <Button
              key={r}
              type="button"
              variant={role === r ? "default" : "outline"}
              onClick={() => setRole(r)}
              className="w-full"
            >
              {r === "CUSTOMER" ? "Customer" : "Provider"}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" name="phone" type="tel" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(res) => res.credential && handleGoogle(res.credential)}
              onError={() => toast.error("Google sign-up failed")}
              text="signup_with"
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
