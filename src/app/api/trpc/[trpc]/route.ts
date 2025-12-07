import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { getToken } from "next-auth/jwt";
import { type NextRequest } from "next/server";
import { type SessionUser } from "@/types/auth";

const createContext = async (req: NextRequest) => {
  // For App Router API routes, we get the JWT token directly from cookies
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Map the token to the expected session format
  const session = token ? {
    user: {
      id: token.id as string,
      name: token.name as string,
      email: token.email as string,
      image: token.picture as string,
      role: token.role as string,
      firstName: (token as { firstName?: string }).firstName || null,
      lastName: (token as { lastName?: string }).lastName || null,
      phoneNumber: (token as { phoneNumber?: string }).phoneNumber || null,
    } as SessionUser
  } : null;

  return {
    session,
    db,
  };
};

const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
  });
};

export { handler as GET, handler as POST };