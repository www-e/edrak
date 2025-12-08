import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const publicServicesRouter = createTRPCRouter({
  /**
   * Get all active services with their pricing information
   */
  getAllServices: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.service.findMany({
      where: { isActive: true },
      include: {
        serviceTiers: {
          orderBy: { order: 'asc' },
          include: {
            price: true,
          },
        },
      },
    });
  }),

  /**
   * Get a specific service by slug with its pricing information
   */
  getServiceBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.service.findUnique({
        where: { 
          slug: input.slug,
          isActive: true 
        },
        include: {
          serviceTiers: {
            orderBy: { order: 'asc' },
            include: {
              price: true,
            },
          },
        },
      });
    }),
});