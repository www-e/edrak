import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      // For API routes, we need to create a minimal context
      return {
        session: null,
        db,
      };
    },
  });

export { handler as GET, handler as POST };