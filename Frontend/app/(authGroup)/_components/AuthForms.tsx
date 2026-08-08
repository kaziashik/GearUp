"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAction, googleLoginAction } from "../_actions/authAction";
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

    if (result.success && (result as any).dashboardPath) {
      toast.success("Welcome back!");
      window.location.href = (result as any).dashboardPath; // Hard redirect to ensure cookies are sent
    } else {
      toast.error(result.message || "Login failed");
    }
  }

  async function handleGoogle(credential: string) {
    setLoading(true);
    const result = await googleLoginAction(credential);
    setLoading(false);

    if (result.success && (result as any).dashboardPath) {
      toast.success("Signed in with Google!");
      window.location.href = (result as any).dashboardPath;
    } else {
      toast.error(result.message || "Google login failed");
    }
  }

  function fillDemoCredentials(email: string, password: string) {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = password;
  }

  return (
    <Card className="w-full max-w-md shadow-xl animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your GearUp account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demo Login Buttons */}
        <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20 space-y-3">
          <p className="text-sm font-medium text-center">Quick Demo Login</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("customer@gearup.com", "Customer@123")}
              className="text-xs"
            >
              Customer
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("provider@gearup.com", "Provider@123")}
              className="text-xs"
            >
              Provider
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("admin@gearup.com", "Admin@123")}
              className="text-xs"
            >
              Admin
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Click to auto-fill credentials, then sign in
          </p>
        </div>

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
              width="400"
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
  const [imagePreview, setImagePreview] = useState<string>("");

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      e.target.value = "";
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    // Handle image compression if image is present
    let compressedImage: string | undefined;
    const imageFile = (form.get("image") as File);
    if (imageFile && imageFile.size > 0) {
      try {
        const { compressImage } = await import("@/lib/imageUtils");
        compressedImage = await compressImage(imageFile, 400, 400, 0.8);
      } catch (error) {
        toast.error("Failed to process image");
        setLoading(false);
        return;
      }
    }

    const { registerAction } = await import("../_actions/authAction");
    const result = await registerAction({
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      role,
      phone: (form.get("phone") as string) || undefined,
      image: compressedImage,
    });
    setLoading(false);

    if (result.success && (result as any).dashboardPath) {
      toast.success("Account created successfully!");
      window.location.href = (result as any).dashboardPath;
    } else {
      toast.error(result.message || "Registration failed");
    }
  }

  async function handleGoogle(credential: string) {
    setLoading(true);
    const result = await googleLoginAction(credential, role);
    setLoading(false);

    if (result.success && (result as any).dashboardPath) {
      toast.success("Account created with Google!");
      window.location.href = (result as any).dashboardPath;
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
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image (optional)</Label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <Input 
                id="image" 
                name="image" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">Maximum file size: 5MB (will be compressed automatically)</p>
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
              width="400"
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
