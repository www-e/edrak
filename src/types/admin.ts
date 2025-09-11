import { z } from 'zod';
import { Role, CourseVisibility, CouponType } from '@prisma/client';

// USER SCHEMAS
export const CreateUserInputSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.nativeEnum(Role),
  isActive: z.boolean().default(true),
});
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const UpdateUserInputSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().min(1).optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;

export const ResetPasswordInputSchema = z.object({
  id: z.string().uuid(),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;

// COURSE & LESSON SCHEMAS
export const CreateCourseInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes only"),
  description: z.string().min(1),
  price: z.number().min(0),
  language: z.string().min(1),
  visibility: z.nativeEnum(CourseVisibility).default('DRAFT'),
  professorId: z.string().uuid(),
  categoryId: z.string().uuid().nullable().optional(), // Prisma: String? => nullable and optional
});
export type CreateCourseInput = z.infer<typeof CreateCourseInputSchema>;

export const CreateLessonInputSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1),
  order: z.number().int().min(1),
  content: z.string(),
  isVisible: z.boolean().default(true),
  videoUrl: z.string().url().nullable().optional(), // Prisma: String? => nullable and optional
});
export type CreateLessonInput = z.infer<typeof CreateLessonInputSchema>;

// COMMERCE SCHEMAS
export const CouponInputSchema = z.object({
    code: z.string().min(3),
    type: z.nativeEnum(CouponType),
    amount: z.number().positive(),
    startDate: z.date(),
    maxUsesPerUser: z.number().int().positive().default(1),
    isActive: z.boolean().default(true),
    maxUses: z.number().int().positive().nullable().optional(), // Prisma: Int? => nullable and optional
    endDate: z.date().nullable().optional(), // Prisma: DateTime? => nullable and optional
});
export type CouponInput = z.infer<typeof CouponInputSchema>;