import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = [
  "/",
  "/gear",
  "/about",
  "/contact",
  "/services",
  "/blog",
  "/help",
  "/privacy",
  "/terms",
];

type TokenPayload = {
  role?: string;
  exp?: number;
};

/** Edge-safe JWT payload decode (no Node crypto / jsonwebtoken). */
function decodeTokenPayload(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return decoded;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: TokenPayload | null): boolean {
  if (!payload?.exp) return true;
  // exp is in seconds
  return payload.exp * 1000 <= Date.now();
}

function getDashboardPath(role: string): string {
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

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;

  const payload = accessToken ? decodeTokenPayload(accessToken) : null;
  const tokenValid = !!payload && !isTokenExpired(payload) && !!payload.role;
  const userRole = tokenValid ? payload!.role! : null;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isPublic =
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    ) ||
    pathname.startsWith("/gearDetails/") ||
    pathname.startsWith("/payment/");

  // Valid session on login/register → go to dashboard
  if (isAuthRoute && tokenValid && userRole) {
    return NextResponse.redirect(
      new URL(getDashboardPath(userRole), request.url)
    );
  }

  // Stale/invalid cookie on login/register → allow page, clear bad cookies
  if (isAuthRoute && accessToken && !tokenValid) {
    const response = NextResponse.next();
    return clearAuthCookies(response);
  }

  // Protected routes require a valid token
  if (!tokenValid && !isPublic && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (accessToken) clearAuthCookies(response);
    return response;
  }

  // Role-based access (only when authenticated)
  if (tokenValid && userRole) {
    if (
      pathname.startsWith("/customer-dashboard") &&
      userRole !== "CUSTOMER" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (
      pathname.startsWith("/provider-dashboard") &&
      userRole !== "PROVIDER" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
};
