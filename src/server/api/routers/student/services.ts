import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { PaymentStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export const studentServicesRouter = createTRPCRouter({
  /**
   * Get all services purchased by the current user
   */
  getMyServices: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get user's payments for services
    const payments = await db.payment.findMany({
      where: {
        userId,
        paymentType: 'SERVICE', // Only service payments
        status: PaymentStatus.COMPLETED // Only completed payments
      },
      include: {
        service: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get user's email to match applications
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }

    // Get associated applications for these services
    const [nutritionApps, psychologyApps, trainingApps] = await db.$transaction([
      db.nutritionApplication.findMany({
        where: { email: user.email },
        select: { id: true, status: true, createdAt: true }
      }),
      db.psychologyApplication.findMany({
        where: { email: user.email },
        select: { id: true, status: true, createdAt: true }
      }),
      db.trainingApplication.findMany({
        where: { email: user.email },
        select: { id: true, status: true, createdAt: true }
      })
    ]);

    // Map payments to service objects with form status
    const services: Array<{
      id: string;
      name: string;
      type: string;
      paymentStatus: PaymentStatus;
      formStatus: string;
      createdAt: Date;
      serviceId: string | null;
    }> = payments.map(payment => {
      const serviceType = payment.service?.name?.toUpperCase() || '';
      let formStatus = 'not_started';
      let application: { id: string; status: string; createdAt: Date } | null | undefined = null;

      if (serviceType === 'NUTRITION') {
        application = nutritionApps.find(app =>
          new Date(app.createdAt) > new Date(payment.createdAt)
        );
      } else if (serviceType === 'PSYCHOLOGY') {
        application = psychologyApps.find(app =>
          new Date(app.createdAt) > new Date(payment.createdAt)
        );
      } else if (serviceType === 'TRAINING') {
        application = trainingApps.find(app =>
          new Date(app.createdAt) > new Date(payment.createdAt)
        );
      }

      // Ensure application is either an object or null, not undefined
      application = application || null;

      if (application) {
        formStatus = application.status === 'PENDING' ? 'pending' : 'completed';
      }

      return {
        id: payment.id,
        name: payment.service?.name || 'Service',
        type: serviceType,
        paymentStatus: payment.status,
        formStatus,
        createdAt: payment.createdAt,
        serviceId: payment.serviceId
      };
    });

    return services;
  }),

  /**
   * Check if user has access to a specific service type
   */
  hasServiceAccess: protectedProcedure
    .input(z.object({
      serviceType: z.enum(['NUTRITION', 'PSYCHOLOGY', 'TRAINING']),
      userId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      // Only check for the currently authenticated user
      if (ctx.session.user.id !== input.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot check access for another user'
        });
      }

      // Check for completed payment for the specified service type
      const service = await db.service.findFirst({
        where: {
          name: input.serviceType,
          isActive: true
        }
      });

      if (!service) {
        return { hasAccess: false };
      }

      const payment = await db.payment.findFirst({
        where: {
          userId: input.userId,
          serviceId: service.id,
          status: PaymentStatus.COMPLETED
        }
      });

      return { hasAccess: !!payment };
    }),

  /**
   * Get form submission for a specific service type
   */
  getFormSubmission: protectedProcedure
    .input(z.object({
      serviceType: z.enum(['NUTRITION', 'PSYCHOLOGY', 'TRAINING']),
      userId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      // Only check for the currently authenticated user
      if (ctx.session.user.id !== input.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot check form for another user'
        });
      }

      // Get user's email to match applications
      const user = await db.user.findUnique({
        where: { id: input.userId },
        select: { email: true }
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        });
      }

      let application:
        | Prisma.NutritionApplicationGetPayload<Prisma.NutritionApplicationDefaultArgs>
        | Prisma.PsychologyApplicationGetPayload<Prisma.PsychologyApplicationDefaultArgs>
        | Prisma.TrainingApplicationGetPayload<Prisma.TrainingApplicationDefaultArgs>
        | null = null;

      if (input.serviceType === 'NUTRITION') {
        const result = await db.nutritionApplication.findFirst({
          where: { email: user.email },
          orderBy: { createdAt: 'desc' }
        });
        application = result || null;
      } else if (input.serviceType === 'PSYCHOLOGY') {
        const result = await db.psychologyApplication.findFirst({
          where: { email: user.email },
          orderBy: { createdAt: 'desc' }
        });
        application = result || null;
      } else if (input.serviceType === 'TRAINING') {
        const result = await db.trainingApplication.findFirst({
          where: { email: user.email },
          orderBy: { createdAt: 'desc' }
        });
        application = result || null;
      }

      return application;
    }),

  /**
   * Get all form submissions for a user by service type
   */
  getFormSubmissionsByType: protectedProcedure
    .input(z.object({
      serviceType: z.enum(['NUTRITION', 'PSYCHOLOGY', 'TRAINING']),
      userId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      // Only check for the currently authenticated user
      if (ctx.session.user.id !== input.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot check forms for another user'
        });
      }

      // Get user's email to match applications
      const user = await db.user.findUnique({
        where: { id: input.userId },
        select: { email: true }
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        });
      }

      let applications: (
        | Prisma.NutritionApplicationGetPayload<Prisma.NutritionApplicationDefaultArgs>
        | Prisma.PsychologyApplicationGetPayload<Prisma.PsychologyApplicationDefaultArgs>
        | Prisma.TrainingApplicationGetPayload<Prisma.TrainingApplicationDefaultArgs>
      )[] = [];

      if (input.serviceType === 'NUTRITION') {
        applications = await db.nutritionApplication.findMany({
          where: { email: user.email },
          orderBy: { createdAt: 'desc' }
        });
      } else if (input.serviceType === 'PSYCHOLOGY') {
        applications = await db.psychologyApplication.findMany({
          where: { email: user.email },
          orderBy: { createdAt: 'desc' }
        });
      } else if (input.serviceType === 'TRAINING') {
        applications = await db.trainingApplication.findMany({
          where: { email: user.email },
          orderBy: { createdAt: 'desc' }
        });
      }

      return applications;
    }),

  /**
   * Create psychology application (protected, requires service payment)
   */
  createPsychologyApplication: protectedProcedure
    .input(z.object({
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
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Verify user has purchased psychology service
      const service = await db.service.findFirst({
        where: { name: 'PSYCHOLOGY', isActive: true }
      });

      if (!service) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Psychology service is not available'
        });
      }

      const payment = await db.payment.findFirst({
        where: {
          userId,
          serviceId: service.id,
          status: PaymentStatus.COMPLETED
        }
      });

      if (!payment) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You must purchase the psychology service before submitting an application'
        });
      }

      // Get user's email to match applications
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        });
      }

      // Check if user has already submitted a psychology application
      const existingApplication = await db.psychologyApplication.findFirst({
        where: {
          email: user.email,
          createdAt: {
            gte: payment.createdAt // Only consider applications after this payment
          }
        }
      });

      if (existingApplication) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You have already submitted a psychology application for this service purchase'
        });
      }

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
   * Create training application (protected, requires service payment)
   */
  createTrainingApplication: protectedProcedure
    .input(z.object({
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
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Verify user has purchased training service
      const service = await db.service.findFirst({
        where: { name: 'TRAINING', isActive: true }
      });

      if (!service) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Training service is not available'
        });
      }

      const payment = await db.payment.findFirst({
        where: {
          userId,
          serviceId: service.id,
          status: PaymentStatus.COMPLETED
        }
      });

      if (!payment) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You must purchase the training service before submitting an application'
        });
      }

      // Get user's email to match applications
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        });
      }

      // Check if user has already submitted a training application
      const existingApplication = await db.trainingApplication.findFirst({
        where: {
          email: user.email,
          createdAt: {
            gte: payment.createdAt // Only consider applications after this payment
          }
        }
      });

      if (existingApplication) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You have already submitted a training application for this service purchase'
        });
      }

      // Process input (convert string values to required types)
      const processedInput = {
        ...input,
        age: parseInt(input.age) || 0,
      };

      return await db.trainingApplication.create({
        data: processedInput,
      });
    }),

  /**
   * Create nutrition application (protected, requires service payment)
   */
  createNutritionApplication: protectedProcedure
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
      const userId = ctx.session.user.id;

      // Verify user has purchased nutrition service
      const service = await db.service.findFirst({
        where: { name: 'NUTRITION', isActive: true }
      });

      if (!service) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Nutrition service is not available'
        });
      }

      const payment = await db.payment.findFirst({
        where: {
          userId,
          serviceId: service.id,
          status: PaymentStatus.COMPLETED
        }
      });

      if (!payment) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You must purchase the nutrition service before submitting an application'
        });
      }

      // Get user's email to match applications
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        });
      }

      // Check if user has already submitted a nutrition application
      const existingApplication = await db.nutritionApplication.findFirst({
        where: {
          email: user.email,
          createdAt: {
            gte: payment.createdAt // Only consider applications after this payment
          }
        }
      });

      if (existingApplication) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You have already submitted a nutrition application for this service purchase'
        });
      }

      // Process input (convert string values to required types)
      const processedInput = {
        ...input,
        age: parseInt(input.age) || 0,
      };

      return await db.nutritionApplication.create({
        data: processedInput,
      });
    })
});