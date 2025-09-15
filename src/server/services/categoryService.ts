import { db } from "@/server/db";

export class AdminCategoryService {
  /**
   * Retrieves all categories.
   */
  static async getAllCategories() {
    return db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }
}