import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db"; // Import used for potential implementation
import { z } from "zod";

// Form-specific schemas that accept string values from HTML forms
const psychologyFormSchema = z.object({
  // Personal Data
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum(["male", "female"]),
  age: z.string().min(1, "Age is required"),
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
});

const trainingFormSchema = z.object({
  // Personal Data
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum(["male", "female"]),
  age: z.string().min(1, "Age is required"),
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
});

export const publicApplicationsRouter = createTRPCRouter({
  /**
   * Create psychology application (now requires service purchase)
   * This endpoint is kept for API compatibility but should not be used directly
   * Use the protected endpoint in student/services instead
   */
  createPsychologyApplication: publicProcedure
    .input(psychologyFormSchema)
    .mutation(async ({ input, ctx }) => {
      // This endpoint is deprecated in favor of protected endpoint
      // that verifies payment before allowing form submission
      // input and ctx are intentionally unused but required for TRPC signature
      throw new Error("Psychology applications must be submitted through your dashboard after service purchase");
    }),

  /**
   * Create training application (now requires service purchase)
   * This endpoint is kept for API compatibility but should not be used directly
   * Use the protected endpoint in student/services instead
   */
  createTrainingApplication: publicProcedure
    .input(trainingFormSchema)
    .mutation(async ({ input, ctx }) => {
      // This endpoint is deprecated in favor of protected endpoint
      // that verifies payment before allowing form submission
      // input and ctx are intentionally unused but required for TRPC signature
      throw new Error("Training applications must be submitted through your dashboard after service purchase");
    }),

  /**
   * Create nutrition application (now requires service purchase)
   * This endpoint is kept for API compatibility but should not be used directly
   * Use the protected endpoint in student/services instead
   */
  createNutritionApplication: publicProcedure
    .input(z.object({
      // Personal Data
      fullName: z.string().min(1, "Full name is required"),
      gender: z.enum(["male", "female"]),
      age: z.string().min(1, "Age is required"),
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
    }))
    .mutation(async ({ input, ctx }) => {
      // This endpoint is deprecated in favor of protected endpoint
      // that verifies payment before allowing form submission
      // input and ctx are intentionally unused but required for TRPC signature
      throw new Error("Nutrition applications must be submitted through your dashboard after service purchase");
    }),
});