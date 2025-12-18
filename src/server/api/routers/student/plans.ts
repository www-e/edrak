import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { LibraryService } from '@/server/services/libraryService';

export const studentPlansRouter = createTRPCRouter({
  // Get all plans for the current student
  getMyPlans: protectedProcedure.query(async ({ ctx }) => {
    return await LibraryService.getStudentPlans(ctx.session.user.id!);
  }),

  // Get a specific plan by ID
  getPlanById: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await LibraryService.getStudentPlanById(input.planId, ctx.session.user.id!);
    }),
});