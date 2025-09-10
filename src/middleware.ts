import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/professor/:path*",
    "/student/:path*",
  ],
};