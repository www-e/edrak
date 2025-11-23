import { createTRPCRouter } from "@/server/api/trpc";
import { adminUserRouter } from "./user";
import { adminCourseRouter } from "./course";
import { adminCommerceRouter } from "./commerce";
import { adminCategoryRouter } from "./category"; 
import { adminApplicationsRouter } from "./applications";
import { adminQuizRouter } from "./quiz";

/**
 * This is the primary router for all admin-related API endpoints.
 * It merges other routers into a single, namespaced API structure.
 *
 * For example, procedures in `adminUserRouter` will be accessible via `admin.user.*`.
 */
export const adminRouter = createTRPCRouter({
  user: adminUserRouter,
  course: adminCourseRouter,
  commerce: adminCommerceRouter,
  category: adminCategoryRouter,
  applications: adminApplicationsRouter,
  quiz: adminQuizRouter,
});