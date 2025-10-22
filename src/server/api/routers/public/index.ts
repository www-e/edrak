import { createTRPCRouter } from "@/server/api/trpc";
import { publicCourseRouter } from "./course";
import { publicCategoryRouter } from "./category";

/**
 * Public router for endpoints that don't require authentication
 */
export const publicRouter = createTRPCRouter({
  course: publicCourseRouter,
  category: publicCategoryRouter,
});

export type PublicRouter = typeof publicRouter;