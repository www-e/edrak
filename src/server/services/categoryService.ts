import { db } from "@/server/db";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class AdminCategoryService {
  /**
    * Retrieves all categories.
    */
   static async getAllCategories(): Promise<Category[]> {
     const categories = await db.category.findMany({
       orderBy: {
         name: "asc",
       },
     });

     return categories;
   }
}