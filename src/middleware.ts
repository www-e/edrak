import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Skip middleware for payment return URLs to avoid delays
    if (req.nextUrl.pathname === "/" && (
      req.nextUrl.searchParams.has("success") ||
      req.nextUrl.searchParams.has("id") ||
      req.nextUrl.searchParams.has("order")
    )) {
      return null;
    }

    // Additional middleware logic can go here
    console.log("Token:", req.nextauth?.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { nextUrl } = req;

        // Skip auth check for payment return URLs
        if (nextUrl.pathname === "/" && (
          nextUrl.searchParams.has("success") ||
          nextUrl.searchParams.has("id") ||
          nextUrl.searchParams.has("order")
        )) {
          return true;
        }

        // Protect student routes
        if (nextUrl.pathname.startsWith("/student")) {
          return token?.role === "STUDENT";
        }

        // Protect admin routes
        if (nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/"],
};