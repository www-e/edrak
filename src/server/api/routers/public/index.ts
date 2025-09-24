import { createTRPCRouter } from "@/server/api/trpc";
import { publicCourseRouter } from "./course";

/**
 * Public router for endpoints that don't require authentication
 */
export const publicRouter = createTRPCRouter({
  course: publicCourseRouter,
});

export type PublicRouter = typeof publicRouter;