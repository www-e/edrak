import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { AdminCourseService } from "@/server/services/courseService";
import { z } from "zod";
import { UpdateCourseInputSchema, UpdateLessonInputSchema } from "@/types/admin";
import {
  createCourseSchema,
  createLessonSchema,
  listQuerySchema,
  idParamSchema,
  lessonParamSchema,
  courseParamSchema
} from "@/lib/validation-schemas";

// Use shared schemas
const CreateCourseInputSchema = createCourseSchema;
const CreateLessonInputSchema = createLessonSchema;

// Use shared schemas for parameters
const GetLessonInputSchema = idParamSchema;
const GetLessonAttachmentsInputSchema = lessonParamSchema;
const GetCourseByIdInputSchema = courseParamSchema;

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
    * Get a list of all courses with pagination and search support.
    */
   getAll: adminProcedure
     .input(listQuerySchema.optional())
     .query(async ({ input }) => {
       return AdminCourseService.getAllCourses(input);
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