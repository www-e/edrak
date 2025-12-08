import { createTRPCRouter } from "@/server/api/trpc";
import { publicCourseRouter } from "./course";
import { publicCategoryRouter } from "./category";
import { publicApplicationsRouter } from "./applications";
import { publicServicesRouter } from "./services";

/**
 * Public router for endpoints that don't require authentication
 */
export const publicRouter = createTRPCRouter({
  course: publicCourseRouter,
  category: publicCategoryRouter,
  applications: publicApplicationsRouter,
  services: publicServicesRouter,
});

export type PublicRouter = typeof publicRouter;