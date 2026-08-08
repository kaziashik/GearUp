import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeTokenPayload } from "@/utils/jwt";
import { Role } from "@/lib/types";

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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("accessToken")?.value;
  const payload = accessToken ? decodeTokenPayload(accessToken) : null;
  const userRole = payload?.role as Role | null;

  // User is logged in and trying to access login or register page, redirect to dashboard
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
    ) ||
    pathname.startsWith("/gearDetails/") ||
    pathname.startsWith("/payment/");

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Authenticated pages Protection
  // Note: Token verification with refresh happens in server actions, not here
  if (!accessToken && !isPublic && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authorization: Role based access control
  if (pathname.startsWith("/customer-dashboard") && userRole !== "CUSTOMER" && userRole !== "ADMIN") {
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
