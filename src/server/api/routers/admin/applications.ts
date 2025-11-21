import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";
import { ApplicationStatusEnum, psychologyApplicationSchema, trainingApplicationSchema, updatePsychologyApplicationSchema, updateTrainingApplicationSchema } from "@/lib/validation-schemas";
import { TRPCError } from "@trpc/server";

export const adminApplicationsRouter = createTRPCRouter({
  /**
   * Get all psychology applications with pagination and search
   */
  getPsychologyApplications: adminProcedure
    .input(z.object({
      page: z.number().min(1).optional(),
      limit: z.number().min(1).max(100).optional(),
      search: z.string().optional(),
      status: ApplicationStatusEnum.optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
    }).optional())
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const skip = (page - 1) * limit;
      const search = input?.search;
      const status = input?.status;
      const sortBy = input?.sortBy ?? 'createdAt';
      const sortOrder = input?.sortOrder ?? 'desc';

      // Build where clause
      const where: {
        OR?: Array<{
          fullName?: { contains: string; mode: 'insensitive' };
          email?: { contains: string; mode: 'insensitive' };
          primarySport?: { contains: string; mode: 'insensitive' };
        }>;
        status?: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
      } = {};
      if (search) {
        where.OR = [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { primarySport: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (status) {
        where.status = status as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
      }

      // Get total count
      const total = await db.psychologyApplication.count({ where });

      // Get applications
      const applications = await db.psychologyApplication.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        select: {
          id: true,
          fullName: true,
          email: true,
          primarySport: true,
          primaryGoal: true,
          status: true,
          assignedPsychologist: true,
          firstSessionDate: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  /**
   * Get all training applications with pagination and search
   */
  getTrainingApplications: adminProcedure
    .input(z.object({
      page: z.number().min(1).optional(),
      limit: z.number().min(1).max(100).optional(),
      search: z.string().optional(),
      status: ApplicationStatusEnum.optional(),
      preferredProgram: z.enum(['home', 'gym', 'sportSpecific']).optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
    }).optional())
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const skip = (page - 1) * limit;
      const search = input?.search;
      const status = input?.status;
      const preferredProgram = input?.preferredProgram;
      const sortBy = input?.sortBy ?? 'createdAt';
      const sortOrder = input?.sortOrder ?? 'desc';

      // Build where clause
      const where: {
        OR?: Array<{
          fullName?: { contains: string; mode: 'insensitive' };
          email?: { contains: string; mode: 'insensitive' };
          primaryGoal?: { contains: string; mode: 'insensitive' };
        }>;
        status?: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
        preferredProgram?: "home" | "gym" | "sportSpecific";
      } = {};
      if (search) {
        where.OR = [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { primaryGoal: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (status) {
        where.status = status as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
      }
      if (preferredProgram) {
        where.preferredProgram = preferredProgram as "home" | "gym" | "sportSpecific";
      }

      // Get total count
      const total = await db.trainingApplication.count({ where });

      // Get applications
      const applications = await db.trainingApplication.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        select: {
          id: true,
          fullName: true,
          email: true,
          primaryGoal: true,
          preferredProgram: true,
          status: true,
          assignedTrainer: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  /**
   * Get a single psychology application by ID
   */
  getPsychologyApplicationById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const application = await db.psychologyApplication.findUnique({
        where: { id: input.id },
      });

      if (!application) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Psychology application not found',
        });
      }

      return application;
    }),

  /**
   * Get a single training application by ID
   */
  getTrainingApplicationById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const application = await db.trainingApplication.findUnique({
        where: { id: input.id },
      });

      if (!application) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Training application not found',
        });
      }

      return application;
    }),

  /**
   * Update psychology application status
   */
  updatePsychologyApplication: adminProcedure
    .input(updatePsychologyApplicationSchema.extend({
      id: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      return await db.psychologyApplication.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });
    }),

  /**
   * Update training application status
   */
  updateTrainingApplication: adminProcedure
    .input(updateTrainingApplicationSchema.extend({
      id: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      return await db.trainingApplication.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });
    }),

  /**
   * Create psychology application (for public submissions)
   */
  createPsychologyApplication: adminProcedure
    .input(psychologyApplicationSchema)
    .mutation(async ({ input }) => {
      return await db.psychologyApplication.create({
        data: input,
      });
    }),

  /**
   * Create training application (for public submissions)
   */
  createTrainingApplication: adminProcedure
    .input(trainingApplicationSchema)
    .mutation(async ({ input }) => {
      return await db.trainingApplication.create({
        data: input,
      });
    }),

  /**
   * Get application statistics for dashboard
   */
  getApplicationStats: adminProcedure
    .query(async () => {
      const [psychologyTotal, psychologyPending, trainingTotal, trainingPending] = await Promise.all([
        db.psychologyApplication.count(),
        db.psychologyApplication.count({ where: { status: 'PENDING' } }),
        db.trainingApplication.count(),
        db.trainingApplication.count({ where: { status: 'PENDING' } }),
      ]);

      return {
        psychology: {
          total: psychologyTotal,
          pending: psychologyPending,
        },
        training: {
          total: trainingTotal,
          pending: trainingPending,
        },
      };
    }),
});