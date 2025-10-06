/**
 * Shared Zod schema patterns for common input validation
 */

import { z } from "zod";
import { CourseVisibility } from "@prisma/client";

/**
 * Common pagination schema used across multiple endpoints
 */
export const paginationSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
});

/**
 * Common sorting schema
 */
export const sortingSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Extended pagination with sorting
 */
export const listQuerySchema = paginationSchema.merge(sortingSchema);

/**
 * Course creation schema
 */
export const createCourseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes only"),
  description: z.string().min(1),
  price: z.number().min(0),
  language: z.string().min(1),
  visibility: z.nativeEnum(CourseVisibility).default('DRAFT'),
  categoryId: z.string().uuid().nullable().optional(),
  professorId: z.string().uuid(),
});

/**
 * Lesson creation schema
 */
export const createLessonSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1),
  order: z.number().int().min(1),
  content: z.string(),
  videoUrl: z.string().url().nullable().optional(),
  isVisible: z.boolean().default(true),
});

/**
 * Coupon creation schema
 */
export const createCouponSchema = z.object({
  code: z.string(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  amount: z.number(),
  maxUses: z.number().nullable().optional(),
  maxUsesPerUser: z.number().default(1),
  startDate: z.date(),
  endDate: z.date().nullable().optional(),
  isActive: z.boolean().default(true),
});

/**
 * Generic UUID schema
 */
export const uuidSchema = z.string().uuid();

/**
 * Generic ID parameter schema
 */
export const idParamSchema = z.object({
  id: uuidSchema
});

/**
 * Lesson ID parameter schema
 */
export const lessonParamSchema = z.object({
  lessonId: uuidSchema
});

/**
 * Course ID parameter schema
 */
export const courseParamSchema = z.object({
  id: uuidSchema
});

/**
 * Common update schemas that extend creation schemas
 */
export const updateCourseSchema = createCourseSchema.partial();
export const updateLessonSchema = createLessonSchema.partial();
export const updateCouponSchema = createCouponSchema.partial();

/**
 * Schema for lesson operations that require both course and lesson IDs
 */
export const courseLessonParamsSchema = z.object({
  id: uuidSchema, // course ID
  lessonId: uuidSchema
});

/**
 * Schema for lesson creation within a course
 */
export const createLessonInCourseSchema = createLessonSchema.omit({ courseId: true });