import { createTRPCRouter } from "@/server/api/trpc";
import { adminRouter } from "@/server/api/routers/admin";
import { publicRouter } from "@/server/api/routers/public";
import { studentRouter } from "@/server/api/routers/student"; // Import the new student router
import { professorRouter } from "@/server/api/routers/professor";

/**
 * This is the primary router for your server.
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  public: publicRouter,
  student: studentRouter, // Register the student router
  professor: professorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;