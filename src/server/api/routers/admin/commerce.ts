import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { AdminCommerceService } from "@/server/services/commerceService";
import { UpdateCouponInputSchema } from "@/types/admin";
import {
  createCouponSchema,
  listQuerySchema,
  idParamSchema
} from "@/lib/validation-schemas";

// Use shared schemas
const CouponInputSchema = createCouponSchema;

export const adminCommerceRouter = createTRPCRouter({
  /**
    * Get a list of all payments for reconciliation with pagination and search.
    */
   getAllPayments: adminProcedure
     .input(listQuerySchema.optional())
     .query(async ({ input }) => {
       return AdminCommerceService.getAllPayments(input);
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
  /**
   * Update an existing coupon.
   */
  updateCoupon: adminProcedure
    .input(UpdateCouponInputSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      // The id is required by the schema, so we can assert its existence.
      return AdminCommerceService.updateCoupon(id!, data);
    }),

  /**
   * Get key metrics for the admin dashboard.
   */
  getDashboardMetrics: adminProcedure.query(async () => {
    return AdminCommerceService.getDashboardMetrics();
  }),

  /**
    * Get a list of all coupons with pagination support.
    */
   getAllCoupons: adminProcedure
     .input(listQuerySchema.optional())
     .query(async ({ input }) => {
       return AdminCommerceService.getAllCoupons(input);
     }),

  /**
   * Get a single coupon by ID.
   */
  getCouponById: adminProcedure
    .input(idParamSchema)
    .query(async ({ input }) => {
      return AdminCommerceService.getCouponById(input.id);
    }),
});
