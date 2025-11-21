import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
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
   * Create psychology application (public submission)
   */
  createPsychologyApplication: publicProcedure
    .input(psychologyFormSchema)
    .mutation(async ({ input }) => {
      // Process input (convert string values to required types)
      const processedInput = {
        ...input,
        age: parseInt(input.age) || 0,
      };

      return await db.psychologyApplication.create({
        data: processedInput,
      });
    }),

  /**
   * Create training application (public submission)
   */
  createTrainingApplication: publicProcedure
    .input(trainingFormSchema)
    .mutation(async ({ input }) => {
      // Process input (convert string values to required types)
      const processedInput = {
        ...input,
        age: parseInt(input.age) || 0,
      };

      return await db.trainingApplication.create({
        data: processedInput,
      });
    }),
});