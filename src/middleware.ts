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
    pages: {
      signIn: "/auth/student/signin",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};