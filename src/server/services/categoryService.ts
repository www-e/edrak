import { db } from "@/server/db";
import { cacheData, getCachedData } from "@/lib/redis";

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
    * Retrieves all categories with Redis caching.
    */
   static async getAllCategories(): Promise<Category[]> {
     const cacheKey = 'categories:all';

     // Try Redis cache first (categories rarely change)
     const cachedCategories = await getCachedData<Category[]>(cacheKey);
     if (cachedCategories) {
       return cachedCategories;
     }

     const categories = await db.category.findMany({
       orderBy: {
         name: "asc",
       },
     });

     // Cache for 1 hour (categories rarely change)
     await cacheData(cacheKey, categories, 3600);

     return categories;
   }
}