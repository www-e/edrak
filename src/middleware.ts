import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
    console.log("Token:", req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect student routes
        if (req.nextUrl.pathname.startsWith("/student")) {
          return token?.role === "STUDENT";
        }

        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/student/:path*", "/admin/:path*"],
};