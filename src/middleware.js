import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (/^\/(_next|static|.*\.(css|js|ico|png|jpg|svg|woff2?))$/.test(pathname)) {
    return NextResponse.next();
  }

  const publicRoutes = [
    "/",
    "/forgot-password",
    "/reset-password",
    "/email-sent",
    "/email-verification",
  ];

  const isPublicRoute = publicRoutes.includes(pathname) || 
                        pathname.startsWith("/reset-password/") || 
                        pathname.startsWith("/__/auth/");

  try {
    const token = req.cookies.get("token");

    if (!token) {
      if (isPublicRoute) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/", req.url));
    }

    if (token && publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/:path*"],
};
