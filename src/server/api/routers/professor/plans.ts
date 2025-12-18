import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { LibraryService } from '@/server/services/libraryService';

export const professorPlansRouter = createTRPCRouter({
  // Create a new student plan
  createStudentPlan: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Plan name is required'),
        description: z.string().optional(),
        studentId: z.string().min(1, 'Student ID is required'),
        planItems: z.array(
          z.object({
            libraryItemId: z.string().min(1, 'Library item ID is required'),
            quantity: z.number().optional(),
            duration: z.number().optional(),
            repetitions: z.number().optional(),
            sets: z.number().optional(),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user has professor role
      if (ctx.session.user.role !== 'PROFESSOR') {
        throw new Error('Only professors can create student plans');
      }

      return await LibraryService.createStudentPlan({
        name: input.name,
        description: input.description,
        studentId: input.studentId,
        professorId: ctx.session.user.id!,
        planItems: input.planItems,
      });
    }),

  // Get all plans created by this professor
  getMyPlans: protectedProcedure.query(async ({ ctx }) => {
    // Verify user has professor role
    if (ctx.session.user.role !== 'PROFESSOR') {
      throw new Error('Only professors can view their plans');
    }

    return await LibraryService.getProfessorPlans(ctx.session.user.id!);
  }),

  // Get a specific plan by ID
  getPlanById: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verify user has professor role
      if (ctx.session.user.role !== 'PROFESSOR') {
        throw new Error('Only professors can view plans');
      }

      const plan = await LibraryService.getStudentPlanById(input.planId);

      // Ensure this professor created this plan
      if (!plan || plan.professorId !== ctx.session.user.id!) {
        throw new Error('You can only access plans you created');
      }

      return plan;
    }),

  // Get all students for a professor (could be students they're teaching or assigned to them)
  getMyStudents: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verify user has professor role
      if (ctx.session.user.role !== 'PROFESSOR') {
        throw new Error('Only professors can view students');
      }

      // For now, return all students - in real implementation, this would be based on actual relationships
      // This is a placeholder that returns all students with an optional search filter
      const db = ctx.db;
      return await db.user.findMany({
        where: {
          role: 'STUDENT',
          isActive: true,
          ...(input.search && {
            OR: [
              { firstName: { contains: input.search, mode: 'insensitive' } },
              { lastName: { contains: input.search, mode: 'insensitive' } },
              { email: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
        take: 100, // Limit results
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          studentProfile: true,
        },
      });
    }),
});