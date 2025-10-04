import { publicProcedure, createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod";
import { CourseService } from "@/server/services/courseService";

export const publicCourseRouter = createTRPCRouter({
  getAllCourses: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      price: z.enum(['free', 'paid']).optional(),
      search: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(12),
    }).optional())
    .query(async ({ input }) => CourseService.getPublishedCourses(input)),

  getCourseBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => CourseService.getCourseBySlug(input.slug)),
});