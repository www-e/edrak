import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { AdminCourseService } from "@/server/services/courseService";
import { z } from "zod";
import { CourseVisibility } from "@prisma/client";

// Schema for creating a course
const CreateCourseInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes only"),
  description: z.string().min(1),
  price: z.number().min(0),
  language: z.string().min(1),
  visibility: z.nativeEnum(CourseVisibility).default('DRAFT'),
  categoryId: z.string().uuid().nullable().optional(),
  professorId: z.string().uuid(),
});

// Schema for creating a lesson
const CreateLessonInputSchema = z.object({
    courseId: z.string().uuid(),
    title: z.string().min(1),
    order: z.number().int().min(1),
    content: z.string(),
    videoUrl: z.string().url().nullable().optional(),
    isVisible: z.boolean().default(true),
});

export const adminCourseRouter = createTRPCRouter({
  /**
   * Create a new course.
   */
  createCourse: adminProcedure
    .input(CreateCourseInputSchema)
    .mutation(async ({ input }) => {
      // Convert undefined to null for optional fields
      const data = {
        ...input,
        categoryId: input.categoryId ?? null,
      };
      return AdminCourseService.createCourse(data);
    }),
    
  /**
   * Create a new lesson for a course.
   */
  createLesson: adminProcedure
    .input(CreateLessonInputSchema)
    .mutation(async ({ input }) => {
        // Convert undefined to null for optional fields
        const data = {
          ...input,
          videoUrl: input.videoUrl ?? null,
        };
        return AdminCourseService.createLesson(data);
    }),
    
  /**
   * Soft delete a lesson.
   */
  softDeleteLesson: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
        return AdminCourseService.softDeleteLesson(input.id);
    }),
    
  /**
   * Restore a soft-deleted lesson.
   */
  restoreLesson: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
        return AdminCourseService.restoreLesson(input.id);
    }),

  // Attachment procedures will be added in a future step when we
  // integrate the Bunny CDN file upload logic. For now, this is complete.
});