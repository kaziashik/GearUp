# 🎨 Professional Frontend Project Template

> **Use this template when creating any new frontend project with Next.js 15, TypeScript, and Tailwind CSS**

---

## 📁 Folder Structure

```
Frontend/
├── app/
│   ├── (publicGroup)/
│   │   ├── page.tsx                    # Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── [feature]/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── _components/
│   │   │   └── FeatureCard.tsx        # Shared components for this group
│   │   └── layout.tsx                  # Public layout
│   ├── (authGroup)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── _components/
│   │   │   └── AuthForms.tsx
│   │   ├── _actions/
│   │   │   └── authAction.ts          # Server actions
│   │   └── layout.tsx                  # Auth layout
│   ├── (dashboardGroup)/
│   │   ├── customer-dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── orders/
│   │   │       └── page.tsx
│   │   ├── provider-dashboard/
│   │   │   └── page.tsx
│   │   ├── admin-dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx                  # Dashboard layout
│   ├── api/                            # API routes (if needed)
│   ├── globals.css
│   ├── layout.tsx                      # Root layout
│   └── loading.tsx
├── components/
│   ├── ui/                             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   ├── dropdown.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── shared/                         # Shared components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── GoogleAuthProvider.tsx
│   └── charts/                         # Chart components
│       └── DashboardCharts.tsx
├── lib/
│   ├── api.ts                          # API URL config
│   ├── server-api.ts                   # Server-side fetch with cookies
│   ├── types.ts                        # TypeScript interfaces
│   ├── utils.ts                        # Utility functions (cn, etc.)
│   ├── design-system.ts                # Design tokens
│   └── imageUtils.ts                   # Image processing utilities
├── service/
│   ├── getMe.ts                        # User service
│   ├── refreshToken.ts                 # Token refresh logic
│   └── logout.ts                       # Logout action
├── utils/
│   └── jwt.ts                          # JWT utilities (decode, verify)
├── public/
│   ├── images/
│   └── icons/
├── .env.local                          # Environment variables (never commit)
├── .env.example                        # Template
├── .gitignore
├── middleware.ts                       # Next.js middleware for auth
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── components.json                     # shadcn/ui config
├── SECURITY.md                         # Security documentation
└── RESPONSIVE.md                       # Responsive design guide
```

---

## 🔧 Essential Configuration Files

### 1. `package.json`

```json
{
  "name": "project-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "latest",
    "sonner": "^1.3.0",
    "recharts": "^2.10.0",
    "jsonwebtoken": "^9.0.0",
    "@react-oauth/google": "^0.12.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### 2. `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 4. `.env.example`

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_API_URL=https://your-backend.vercel.app

# Frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# JWT Secrets (must match backend)
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Google OAuth (if needed)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🔐 Security Implementation

### 1. JWT Utilities (`utils/jwt.ts`)

```typescript
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "@/lib/types";

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = {
  verifyToken,
};

// Legacy decoder for middleware (Edge Runtime compatible)
export function decodeTokenPayload(token: string): { role?: Role } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded;
  } catch {
    return null;
  }
}

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin-dashboard";
    case "PROVIDER":
      return "/provider-dashboard";
    case "CUSTOMER":
    default:
      return "/customer-dashboard";
  }
}
```

### 2. Token Refresh Service (`service/refreshToken.ts`)

```typescript
"use server";

import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh token not found!",
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    }
  );

  const result = await res.json();
  return result;
};

export const getAccessToken = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      )
    : null;
  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      )
    : null;

  // Auto-refresh if access token expired but refresh token valid
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();
    if (result.success) {
      let newAccessToken = result.data.accessToken;
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
      });
      accessToken = newAccessToken;
    }
  }

  return accessToken;
};
```

### 3. Server-Side API (`lib/server-api.ts`)

```typescript
import "server-only";
import { cookies } from "next/headers";
import { API_URL } from "./api";
import { ApiResponse } from "./types";
import { getAccessToken } from "@/service/refreshToken";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const accessToken = await getAccessToken();

    if (
      !accessToken &&
      !path.includes("/auth/login") &&
      !path.includes("/auth/register") &&
      !path.includes("/auth/google")
    ) {
      return {
        success: false,
        message: "User not logged in!",
      } as ApiResponse<T>;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (accessToken) {
      (headers as Record<string, string>)[
        "Cookie"
      ] = `accessToken=${accessToken}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });

    const data = (await res.json().catch(() => ({
      success: false,
      message: "Unexpected server response",
    }))) as ApiResponse<T>;

    return data;
  } catch (error) {
    console.error("apiFetch error:", error);
    return {
      success: false,
      message: "Something went wrong while making the request",
    } as ApiResponse<T>;
  }
}
```

### 4. Middleware (`middleware.ts`)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeTokenPayload } from "@/utils/jwt";
import { Role } from "@/lib/types";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/features",
  "/pricing",
  "/blog",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("accessToken")?.value;
  const payload = accessToken ? decodeTokenPayload(accessToken) : null;
  const userRole = payload?.role as Role | null;

  // Logged in users trying to access auth pages → redirect to dashboard
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "CUSTOMER") {
      return NextResponse.redirect(
        new URL("/customer-dashboard", request.url)
      );
    } else if (userRole === "PROVIDER") {
      return NextResponse.redirect(
        new URL("/provider-dashboard", request.url)
      );
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const isPublic =
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    ) || pathname.startsWith("/features/");

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Protected pages → require login
  if (!accessToken && !isPublic && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (
    pathname.startsWith("/customer-dashboard") &&
    userRole !== "CUSTOMER" &&
    userRole !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (
    pathname.startsWith("/admin-dashboard") &&
    userRole !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (
    pathname.startsWith("/provider-dashboard") &&
    userRole !== "PROVIDER" &&
    userRole !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
};
```

---

## 📱 Responsive Design Patterns

### Breakpoints

```css
/* Mobile-first approach */
Base:      < 640px (default, no prefix)
sm:        ≥ 640px (tablets)
md:        ≥ 768px (landscape tablets)
lg:        ≥ 1024px (laptops)
xl:        ≥ 1280px (desktops)
2xl:       ≥ 1536px (large desktops)
```

### Common Patterns

```tsx
// Responsive Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive Typography
<h1 className="text-4xl md:text-6xl font-bold">

// Responsive Padding
<section className="py-12 md:py-20">

// Responsive Flex Direction
<div className="flex flex-col md:flex-row gap-4">

// Hide/Show on Mobile
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>

// Responsive Tables
<div className="overflow-x-auto">
  <table className="w-full text-sm min-w-[640px]">
```

### Mobile Menu Pattern

```tsx
"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/">Logo</Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Links */}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t p-4 space-y-2">
          {/* Mobile links */}
        </div>
      )}
    </header>
  );
}
```

---

## 🎨 Design System (`lib/design-system.ts`)

```typescript
export const colors = {
  primary: "hsl(221, 83%, 53%)",
  secondary: "hsl(142, 76%, 36%)",
  accent: "hsl(48, 96%, 53%)",
};

export const spacing = {
  section: "py-16 md:py-24",
  container: "container mx-auto px-4",
};

export const typography = {
  h1: "text-4xl md:text-6xl font-bold",
  h2: "text-3xl md:text-5xl font-bold",
  h3: "text-2xl md:text-4xl font-semibold",
  body: "text-base md:text-lg",
};
```

---

## 🔄 URL-Based State Pattern

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read from URL
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  // Update URL
  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1"); // Reset to page 1
    router.push(`/browse?${params.toString()}`);
  }

  return (
    <div>
      <input
        value={search}
        onChange={(e) => updateParams("search", e.target.value)}
      />
    </div>
  );
}
```

---

## 🖼️ Image Processing (`lib/imageUtils.ts`)

```typescript
export async function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please select an image file";
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Image size must be less than ${maxSizeMB}MB`;
  }

  return null;
}
```

---

## ✅ Coding Standards

1. **File Naming**: 
   - Components: PascalCase (`UserCard.tsx`)
   - Pages: kebab-case (`user-profile/page.tsx`)
   - Utilities: camelCase (`imageUtils.ts`)

2. **Component Structure**:
   ```tsx
   "use client"; // if needed

   import statements...

   export default function ComponentName() {
     // Hooks first
     // Then functions
     // Then return JSX
   }
   ```

3. **Always use**:
   - `"use client"` for interactive components
   - `"use server"` for server actions
   - TypeScript interfaces from `lib/types.ts`
   - `cn()` utility for conditional classes
   - `toast` from `sonner` for notifications

4. **CSS Classes**:
   - Use Tailwind utility classes
   - Mobile-first approach
   - Consistent spacing with design system

---

## 🎯 Authentication Flow

```typescript
// Login Action
export async function loginAction(email: string, password: string) {
  const result = await authRequest<AuthResponse>("/api/auth/login", {
    email,
    password,
  });

  if (result.success && result.data) {
    const cookieStore = await cookies();

    // Set httpOnly cookies
    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  }

  return result;
}
```

---

## 🚀 Key Principles

1. ✅ **Mobile-first responsive** design
2. ✅ **URL-based state** for search/filter/pagination
3. ✅ **Server Actions** for data mutations
4. ✅ **Cookie-based authentication** with auto-refresh
5. ✅ **Route groups** for layout organization
6. ✅ **Loading states** with skeletons
7. ✅ **Error boundaries** for graceful errors
8. ✅ **Type safety** with TypeScript
9. ✅ **Accessibility** WCAG AA compliance
10. ✅ **Performance** optimized images and lazy loading

---

## 📦 Required shadcn/ui Components

```bash
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add select
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add skeleton
```

---

## 🎨 3-Color Palette Pattern

```css
:root {
  --primary: 221 83% 53%;      /* Blue - Main actions */
  --secondary: 142 76% 36%;    /* Green - Success states */
  --accent: 48 96% 53%;        /* Yellow - Highlights */
}
```

---

**Use this template for every new frontend project to maintain consistency and professional standards!** 🚀
