import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { AdminCommerceService } from "@/server/services/commerceService";
import { UpdateCouponInputSchema } from "@/types/admin";
import {
  createCouponSchema,
  listQuerySchema,
  idParamSchema,
  adminWalletAdjustmentSchema,
  walletTransactionQuerySchema,
  cashbackConfigSchema,
} from "@/lib/validation-schemas";
import { z } from "zod";

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

  // ==================== WALLET MANAGEMENT ====================

  /**
   * Adjust user wallet balance (add or remove funds)
   */
  adjustUserWallet: adminProcedure
    .input(adminWalletAdjustmentSchema)
    .mutation(async ({ ctx, input }) => {
      const adminId = ctx.session.user?.id;
      if (!adminId) {
        throw new Error("Admin ID not found in session");
      }

      return AdminCommerceService.adjustUserWallet(
        input.userId,
        input.amount,
        input.reason,
        adminId
      );
    }),

  /**
   * Get user wallet balance
   */
  getUserWalletBalance: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input }) => {
      return AdminCommerceService.getUserWalletBalance(input.userId);
    }),

  /**
   * Get user wallet transaction history
   */
  getUserWalletTransactions: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(100).optional(),
        type: walletTransactionQuerySchema.shape.type,
      })
    )
    .query(async ({ input }) => {
      return AdminCommerceService.getUserWalletTransactions(
        input.userId,
        {
          page: input.page,
          limit: input.limit,
          type: input.type,
        }
      );
    }),

  /**
   * Update course cashback configuration
   */
  updateCourseCashback: adminProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        cashbackType: cashbackConfigSchema.shape.cashbackType,
        cashbackValue: cashbackConfigSchema.shape.cashbackValue,
      })
    )
    .mutation(async ({ input }) => {
      return AdminCommerceService.updateCourseCashback(
        input.courseId,
        input.cashbackType,
        input.cashbackValue
      );
    }),
});
