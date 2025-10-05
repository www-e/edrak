import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Skip middleware for payment-related URLs to avoid delays
    if (
      req.nextUrl.pathname === "/payments/return" ||
      (req.nextUrl.pathname === "/" && (
        req.nextUrl.searchParams.has("success") ||
        req.nextUrl.searchParams.has("id") ||
        req.nextUrl.searchParams.has("order")
      ))
    ) {
      return null;
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { nextUrl } = req;

        // Skip auth check for payment-related URLs
        if (
          nextUrl.pathname === "/payments/return" ||
          (nextUrl.pathname === "/" && (
            nextUrl.searchParams.has("success") ||
            nextUrl.searchParams.has("id") ||
            nextUrl.searchParams.has("order")
          ))
        ) {
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
  matcher: [
    "/student/:path*",
    "/admin/:path*",
    "/payments/:path*",
    "/"
  ],
};