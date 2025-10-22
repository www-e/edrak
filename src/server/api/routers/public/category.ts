import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { AdminCategoryService } from "@/server/services/categoryService";

export const publicCategoryRouter = createTRPCRouter({
  /**
   * Get a list of all course categories.
   */
  getAll: publicProcedure.query(async () => {
    return AdminCategoryService.getAllCategories();
  }),
});