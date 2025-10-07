import { z } from 'zod';
import { Role, CourseVisibility, CouponType } from '@prisma/client';
import { egyptianPhoneNumberSchema, optionalEgyptianPhoneNumberSchema } from '@/lib/validation-schemas';

// ATTACHMENT TYPE DEFINITION
// Centralized type for Attachment to ensure consistency across components
export interface Attachment {
  id: string;
  lessonId: string; // Added missing field from database schema
  name: string;
  fileName: string;
  mimeType: string;
  fileSize: number; // Using number for JavaScript compatibility (Prisma Int maps to number)
  bunnyCdnPath: string;
  bunnyCdnUrl: string;
  createdAt: Date; // Using Date for JavaScript compatibility (Prisma DateTime maps to Date)
  updatedAt: Date;
}

// USER SCHEMAS
export const CreateUserInputSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: egyptianPhoneNumberSchema,
    role: z.nativeEnum(Role),
    isActive: z.boolean(), // Default will be set in the form's defaultValues
  });
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const UpdateUserInputSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(3, "Username must be at least 3 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phoneNumber: egyptianPhoneNumberSchema.optional(),
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
  visibility: z.nativeEnum(CourseVisibility),
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
    maxUsesPerUser: z.number().int().positive(),
    isActive: z.boolean(),
    maxUses: z.number().int().positive().nullable().optional(), // Prisma: Int? => nullable and optional
    endDate: z.date().nullable().optional(), // Prisma: DateTime? => nullable and optional
});
export type CouponInput = z.infer<typeof CouponInputSchema>;
export const UpdateCourseInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes only").optional(),
  description: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  language: z.string().min(1).optional(),
  visibility: z.nativeEnum(CourseVisibility).optional(),
  professorId: z.string().uuid().optional(),
  categoryId: z.string().uuid().nullable().optional(),
});
export type UpdateCourseInput = z.infer<typeof UpdateCourseInputSchema>;
export const UpdateLessonInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  order: z.number().int().min(1).optional(),
  content: z.string().optional(),
  isVisible: z.boolean().optional(),
  videoUrl: z.string().url().nullable().optional(),
});
export type UpdateLessonInput = z.infer<typeof UpdateLessonInputSchema>;
export const UpdateCouponInputSchema = CouponInputSchema.extend({
  id: z.string().uuid(),
}).partial(); // Makes all fields, except the new 'id', optional.
export type UpdateCouponInput = z.infer<typeof UpdateCouponInputSchema>;