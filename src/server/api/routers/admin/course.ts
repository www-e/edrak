import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { AdminCourseService } from "@/server/services/courseService";
import { z } from "zod";
import { CourseVisibility } from "@prisma/client";
import { UpdateCourseInputSchema, UpdateLessonInputSchema } from "@/types/admin";
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

// Schema for getting a lesson
const GetLessonInputSchema = z.object({
    id: z.string().uuid(),
});

// Schema for getting lesson attachments
const GetLessonAttachmentsInputSchema = z.object({
    lessonId: z.string().uuid(),
});

const GetCourseByIdInputSchema = z.object({
  id: z.string().uuid(),
});

export const adminCourseRouter = createTRPCRouter({
  /**
   * Create a new course.
   */
  createCourse: adminProcedure
    .input(CreateCourseInputSchema)
    .mutation(async ({ input }) => {
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
        const data = {
          ...input,
          videoUrl: input.videoUrl ?? null,
        };
        return AdminCourseService.createLesson(data);
    }),
    
  /**
   * Get a lesson by ID.
   */
  getLesson: adminProcedure
    .input(GetLessonInputSchema)
    .query(async ({ input }) => {
        return AdminCourseService.getLesson(input.id);
    }),
    
  /**
   * Get attachments for a lesson.
   */
  getLessonAttachments: adminProcedure
    .input(GetLessonAttachmentsInputSchema)
    .query(async ({ input }) => {
        return AdminCourseService.getLessonAttachments(input.lessonId);
    }),
    
  /**
   * Get a list of all courses.
   */
  getAll: adminProcedure.query(async () => {
    return AdminCourseService.getAllCourses();
  }),

  /**
   * Get a single course by ID.
   */
  getById: adminProcedure
    .input(GetCourseByIdInputSchema)
    .query(async ({ input }) => {
      return AdminCourseService.getCourseById(input.id);
    }),
  
  /**
   * Update an existing course.
   */
  update: adminProcedure
    .input(UpdateCourseInputSchema)
    .mutation(async ({ input }) => {
      return AdminCourseService.updateCourse(input);
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
    /**
   * Update an existing lesson.
   */
  updateLesson: adminProcedure
    .input(UpdateLessonInputSchema)
    .mutation(async ({ input }) => {
      return AdminCourseService.updateLesson(input);
    }),
});