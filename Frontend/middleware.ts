import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeTokenPayload, getDashboardPath } from "@/utils/jwt";
import { Role } from "@/lib/types";

const publicPaths = ["/", "/gear", "/about", "/contact", "/services", "/success", "/cancel"];
const authPaths = ["/login", "/register"];

function isPublicPath(pathname: string) {
  if (publicPaths.includes(pathname)) return true;
  if (pathname.startsWith("/gearDetails/")) return true;
  return false;
}

function isAuthPath(pathname: string) {
  return authPaths.some((p) => pathname.startsWith(p));
}

function isDashboardPath(pathname: string) {
  return (
    pathname.startsWith("/customer-dashboard") ||
    pathname.startsWith("/provider-dashboard") ||
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/dashboard")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const payload = token ? decodeTokenPayload(token) : null;
  const role = payload?.role as Role | undefined;

  if (isAuthPath(pathname) && token && role) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  if (isDashboardPath(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/customer-dashboard") && role && role !== "CUSTOMER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  if (pathname.startsWith("/provider-dashboard") && role && role !== "PROVIDER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  if (pathname.startsWith("/admin-dashboard") && role && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  if (!isPublicPath(pathname) && !isAuthPath(pathname) && !isDashboardPath(pathname) && pathname.startsWith("/payment")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
