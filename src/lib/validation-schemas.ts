/**
 * Shared Zod schema patterns for common input validation
 */

import { z } from "zod";
import { CourseVisibility } from "@prisma/client";

/**
 * Egyptian phone number validation schema
 * Supports formats like: 01111111111, 01211111111, 01011111111
 */
export const egyptianPhoneNumberSchema = z.string()
  .min(11, "Phone number must be exactly 11 digits")
  .max(11, "Phone number must be exactly 11 digits")
  .regex(/^01[0-2,5,9]\d{8}$/, "Please enter a valid Egyptian phone number (01xxxxxxxxx)");

/**
 * Optional Egyptian phone number validation schema
 */
export const optionalEgyptianPhoneNumberSchema = egyptianPhoneNumberSchema.optional();

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
  isVisible: z.boolean().default(true),
  youtubeUrl: z.string().url().optional().refine((url) => {
    if (!url) return true;
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/.test(url);
  }, "Must be a valid YouTube URL"),
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
export const updateLessonSchema = createLessonSchema.partial().extend({
  youtubeUrl: z.string().url().optional().refine((url) => {
    if (!url) return true;
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/.test(url);
  }, "Must be a valid YouTube URL").nullable(),
});
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

/**
 * Psychology Application Validation Schema
 */
export const psychologyApplicationSchema = z.object({
  // Personal Data
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum(["male", "female"]),
  age: z.number().int().min(16, "Must be at least 16 years old").max(100, "Must be under 100 years old"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  previousTrainer: z.enum(["yes", "no"]),
  previousPsychologist: z.enum(["yes", "no"]),
  medications: z.string().min(1, "Please specify medications or write 'No'"),
  injuries: z.string().min(1, "Please specify injuries or write 'No'"),

  // Sports Data
  primarySport: z.string().min(1, "Primary sport is required"),
  trainingAge: z.string().min(1, "Training age is required"),
  weeklyDays: z.string().min(1, "Weekly training days is required"),
  workoutDuration: z.string().min(1, "Workout duration is required"),
  preparingForCompetition: z.enum(["yes", "no"]),
  competitionDate: z.string().optional(),

  // Current Mental State
  affectingPerformance: z.string().min(1, "Please describe what affects your performance"),
  previousBreakdown: z.enum(["yes", "no"]),
  generalMentalState: z.enum(["stable", "unstable", "stressed", "unclear"]),
  sleepDifficulties: z.enum(["yes", "no"]),
  anxietyEpisodes: z.enum(["yes", "no"]),

  // Goals
  primaryGoal: z.enum([
    "performance-improvement",
    "stress-management",
    "confidence-building",
    "pre-competition-support",
    "psychological-rehabilitation"
  ]),
  sessionPreference: z.enum(["individual", "general"]),
  combineWithTraining: z.string().optional(),
  selectedPackage: z.enum(["silver", "gold", "diamond"]).optional(),
});

/**
 * Training Application Validation Schema
 */
export const trainingApplicationSchema = z.object({
  // Personal Data
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum(["male", "female"]),
  age: z.number().int().min(16, "Must be at least 16 years old").max(100, "Must be under 100 years old"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  previousTrainer: z.enum(["yes", "no"]),
  injuries: z.string().min(1, "Please specify injuries or write 'No'"),
  
  // Training Data
  trainingAge: z.string().min(1, "Training age is required"),
  weeklyDays: z.string().min(1, "Weekly training days is required"),
  dailyExercises: z.string().min(1, "Daily exercises count is required"),
  workoutDuration: z.string().min(1, "Workout duration is required"),
  exerciseTypes: z.enum(["cardio", "resistance", "flexibility", "mixed"]),
  primarySport: z.string().optional(),
  
  // Body Measurements
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  chestCircumference: z.string().optional(),
  waistCircumference: z.string().optional(),
  hipCircumference: z.string().optional(),
  armCircumference: z.string().optional(),
  thighCircumference: z.string().optional(),
  
  // Fitness Tests
  squatTest: z.string().optional(),
  pushupTest: z.string().optional(),
  enduranceTest: z.string().optional(),
  flexibilityTest: z.string().optional(),
  
  // Body Photos (will be handled separately for file uploads)
  frontPhoto: z.string().optional(),
  sidePhoto: z.string().optional(),
  backPhoto: z.string().optional(),
  
  // Goals
  primaryGoal: z.enum([
    "muscle-gain",
    "weight-loss",
    "performance",
    "rehabilitation",
    "general-fitness"
  ]),
  timeframe: z.string().optional(),
  nutritionPlan: z.string().optional(),
  selectedPackage: z.enum(["silver", "gold", "diamond"]).optional(),
});

/**
 * Nutrition Application Validation Schema
 */
export const nutritionApplicationSchema = z.object({
  // Personal Data
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum(["male", "female"]),
  age: z.number().int().min(16, "Must be at least 16 years old").max(100, "Must be under 100 years old"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),

  // Health Data
  injuries: z.string().min(1, "Please specify injuries or write 'No'"),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),

  // Nutrition Data
  currentWeight: z.string().min(1, "Current weight is required"),
  currentHeight: z.string().min(1, "Current height is required"),
  targetWeight: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  currentEatingHabits: z.string().min(1, "Please describe your current eating habits"),
  mealsPerDay: z.string().min(1, "Number of meals per day is required"),
  waterIntake: z.string().optional(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very-active"]),

  // Goals
  primaryGoal: z.enum([
    "weight-loss",
    "muscle-gain",
    "performance",
    "health-improvement",
    "body-recomposition"
  ]),
  timeframe: z.string().optional(),
  selectedPackage: z.enum(["silver", "gold", "diamond"]).optional(),
});

/**
 * Application Status Enum
 */
export const ApplicationStatusEnum = z.enum([
  "PENDING",
  "UNDER_REVIEW", 
  "APPROVED",
  "REJECTED",
  "IN_PROGRESS",
  "COMPLETED"
]);

/**
 * Schema for updating psychology application status
 */
export const updatePsychologyApplicationSchema = z.object({
  status: ApplicationStatusEnum,
  notes: z.string().optional(),
  assignedPsychologist: z.string().optional(),
  firstSessionDate: z.date().optional(),
});

/**
 * Schema for updating nutrition application
 */
export const updateNutritionApplicationSchema = z.object({
  status: ApplicationStatusEnum,
  notes: z.string().optional(),
  assignedNutritionist: z.string().optional(),
});

/**
 * Schema for updating training application status
 */
export const updateTrainingApplicationSchema = z.object({
  status: ApplicationStatusEnum,
  notes: z.string().optional(),
  assignedTrainer: z.string().optional(),
  preferredProgram: z.enum(["home", "gym", "sportSpecific"]).optional(),
});

/**
 * Wallet Usage Schema - For using wallet balance in course purchase
 */
export const walletUsageSchema = z.object({
  walletAmountToUse: z.number()
    .min(0, "Wallet amount cannot be negative")
    .optional(),
});

/**
 * Admin Wallet Adjustment Schema - For admin adding/removing funds
 */
export const adminWalletAdjustmentSchema = z.object({
  userId: uuidSchema,
  amount: z.number()
    .refine((val) => val !== 0, "Amount cannot be zero"),
  reason: z.string()
    .min(5, "Please provide a reason (minimum 5 characters)")
    .max(500, "Reason too long (maximum 500 characters)"),
});

/**
 * Cashback Configuration Schema - For setting course cashback
 */
export const cashbackConfigSchema = z.object({
  cashbackType: z.enum(["NONE", "PERCENTAGE", "FIXED"]),
  cashbackValue: z.number()
    .min(0, "Cashback value cannot be negative")
    .optional(),
}).refine(
  (data) => {
    // If cashbackType is not NONE, cashbackValue is required
    if (data.cashbackType !== "NONE" && (data.cashbackValue === undefined || data.cashbackValue === null)) {
      return false;
    }
    // If cashbackType is PERCENTAGE, value must be between 0 and 100
    if (data.cashbackType === "PERCENTAGE" && data.cashbackValue && data.cashbackValue > 100) {
      return false;
    }
    return true;
  },
  {
    message: "Invalid cashback configuration",
  }
);

/**
 * Wallet Transaction Query Schema - For filtering transaction history
 */
export const walletTransactionQuerySchema = paginationSchema.extend({
  type: z.enum(["PURCHASE_DEBIT", "CASHBACK_CREDIT", "ADMIN_CREDIT", "ADMIN_DEBIT", "REFUND_CREDIT"]).optional(),
});