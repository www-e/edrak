import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { AdminCategoryService } from "@/server/services/categoryService";

export const adminCategoryRouter = createTRPCRouter({
  /**
   * Get a list of all course categories.
   */
  getAll: adminProcedure.query(async () => {
    return AdminCategoryService.getAllCategories();
  }),
  // We can add create, update, delete procedures here later if needed.
});