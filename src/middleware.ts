import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated and trying to access root path, redirect to student dashboard
    if (req.nextUrl.pathname === "/" && req.nextauth.token?.role === "STUDENT") {
      return NextResponse.redirect(new URL("/student", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Define routes that are always public (no authentication required)
        const publicRoutes = ["/", "/auth", "/courses"];
        const isPublicRoute = publicRoutes.some(route =>
          req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + "/")
        );

        // Always allow access to public routes
        if (isPublicRoute) {
          return true;
        }

        // For all other routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};