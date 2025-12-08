import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// Input validation schemas
const createServiceInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
});

const updateServiceInput = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

const createServiceTierInput = z.object({
  serviceId: z.string(),
  name: z.string().min(1),
  order: z.number().int().min(1),
  isPopular: z.boolean().optional(),
});

const updateServiceTierInput = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  order: z.number().int().min(1).optional(),
  isPopular: z.boolean().optional(),
});

const createServicePriceInput = z.object({
  tierId: z.string(),
  duration: z.enum(["monthly", "threeMonths", "sixMonths"]),
  price: z.number().min(0),
});

const updateServicePriceInput = z.object({
  id: z.string(),
  duration: z.enum(["monthly", "threeMonths", "sixMonths"]).optional(),
  price: z.number().min(0).optional(),
});

export const adminServicesRouter = createTRPCRouter({
  // Service management
  getAllServices: protectedProcedure
    .input(z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }))
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;
      
      const [services, total] = await Promise.all([
        ctx.db.service.findMany({
          skip,
          take: input.limit,
          orderBy: { createdAt: 'desc' },
          include: {
            serviceTiers: {
              orderBy: { order: 'asc' },
              include: {
                price: true,
              },
            },
          },
        }),
        ctx.db.service.count(),
      ]);

      return {
        services,
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  getServiceById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.service.findUnique({
        where: { id: input.id },
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

  createService: protectedProcedure
    .input(createServiceInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.service.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
        },
      });
    }),

  updateService: protectedProcedure
    .input(updateServiceInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.service.update({
        where: { id },
        data: updateData,
      });
    }),

  deleteService: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.service.delete({
        where: { id: input.id },
      });
    }),

  // Service tier management
  createServiceTier: protectedProcedure
    .input(createServiceTierInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.serviceTier.create({
        data: {
          serviceId: input.serviceId,
          name: input.name,
          order: input.order,
          isPopular: input.isPopular ?? false,
        },
      });
    }),

  updateServiceTier: protectedProcedure
    .input(updateServiceTierInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.serviceTier.update({
        where: { id },
        data: updateData,
      });
    }),

  deleteServiceTier: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.serviceTier.delete({
        where: { id: input.id },
      });
    }),

  // Service price management
  createServicePrice: protectedProcedure
    .input(createServicePriceInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.servicePrice.create({
        data: {
          tierId: input.tierId,
          duration: input.duration,
          price: input.price,
        },
      });
    }),

  updateServicePrice: protectedProcedure
    .input(updateServicePriceInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.servicePrice.update({
        where: { id },
        data: updateData,
      });
    }),

  deleteServicePrice: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.servicePrice.delete({
        where: { id: input.id },
      });
    }),

  // Get service pricing by service slug (for frontend)
  getServicePricingBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.service.findUnique({
        where: { slug: input.slug },
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