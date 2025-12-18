import { createTRPCRouter } from "@/server/api/trpc";
import { professorPlansRouter } from "./plans";

/**
 * This is the primary router for all professor-related API endpoints.
 * It merges other routers into a single, namespaced API structure.
 *
 * For example, procedures in `professorPlansRouter` will be accessible via `professor.plans.*`.
 */
export const professorRouter = createTRPCRouter({
  plans: professorPlansRouter,
});