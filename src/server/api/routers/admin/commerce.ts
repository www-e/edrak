import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { AdminCommerceService } from "@/server/services/commerceService";
import { z } from "zod";

// Placeholder for coupon creation/update schemas. For now, we use a generic object.
// We would replace this with strong Zod schemas in a real implementation.
const CouponInputSchema = z.object({
    code: z.string(),
    type: z.enum(['PERCENTAGE', 'FIXED']),
    amount: z.number(),
    maxUses: z.number().nullable().optional(),
    maxUsesPerUser: z.number().default(1),
    startDate: z.date(),
    endDate: z.date().nullable().optional(),
    isActive: z.boolean().default(true),
});

export const adminCommerceRouter = createTRPCRouter({
  /**
   * Get a list of all payments for reconciliation.
   */
  getAllPayments: adminProcedure.query(async () => {
    return AdminCommerceService.getAllPayments();
  }),
  
  /**
   * Create a new coupon.
   */
  createCoupon: adminProcedure
    .input(CouponInputSchema)
    .mutation(async ({ input }) => {
      // Convert undefined to null for optional fields
      const data = {
        ...input,
        maxUses: input.maxUses ?? null,
        endDate: input.endDate ?? null,
      };
      return AdminCommerceService.createCoupon(data);
    }),
    
  /**
   * Update an existing coupon.
   */
  updateCoupon: adminProcedure
    .input(z.object({ 
      id: z.string().uuid(), 
      data: CouponInputSchema.partial() 
    }))
.mutation(async ({ input }) => {
        // Convert undefined to null for optional fields
        const data = {
          ...input.data,
          maxUses: input.data.maxUses !== undefined ? input.data.maxUses : undefined,
          endDate: input.data.endDate !== undefined ? input.data.endDate : undefined,
        };
        return AdminCommerceService.updateCoupon(input.id, data);
    }),

  /**
   * Get key metrics for the admin dashboard.
   */
  getDashboardMetrics: adminProcedure.query(async () => {
    return AdminCommerceService.getDashboardMetrics();
  }),

  /**
   * Get a list of all coupons.
   */
  getAllCoupons: adminProcedure.query(async () => {
    return AdminCommerceService.getAllCoupons();
  }),

  /**
   * Get a single coupon by ID.
   */
  getCouponById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return AdminCommerceService.getCouponById(input.id);
    }),   
});