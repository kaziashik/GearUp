import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";
import { getNewAccessToken } from "@/service/refreshToken";

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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookiesStore = await cookies();

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
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

  // If access token expired but refresh token is valid, get new access token
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      cookiesStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
      });

      accessToken = newAccessToken;
      decodedAccessToken = jwtUtils.verifyToken(
        accessToken!,
        process.env.JWT_ACCESS_SECRET as string
      );
    }
  }

  // If token is invalid, clear cookies
  if (!decodedAccessToken?.success && accessToken) {
    cookiesStore.delete("accessToken");
  }

  let userRole = null;
  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

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
  if (!decodedAccessToken?.success && !isPublic && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authorization: Role based access control
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
