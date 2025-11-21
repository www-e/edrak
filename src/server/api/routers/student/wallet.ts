import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { WalletService } from "@/lib/wallet-service";
import { walletTransactionQuerySchema } from "@/lib/validation-schemas";

/**
 * Student Wallet Router
 * Provides endpoints for students to view their wallet balance and transaction history
 */
export const walletRouter = createTRPCRouter({
  /**
   * Get current wallet balance
   */
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id;
    if (!userId) {
      throw new Error("User ID not found in session");
    }

    const balance = await WalletService.getBalance(userId);

    return {
      balance,
      currency: "EGP",
    };
  }),

  /**
   * Get wallet transaction history with pagination and filtering
   */
  getTransactionHistory: protectedProcedure
    .input(walletTransactionQuerySchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new Error("User ID not found in session");
      }

      const { page, limit, type } = input;

      const result = await WalletService.getTransactionHistory(userId, {
        page,
        limit,
        type,
      });

      return {
        transactions: result.transactions.map((tx) => ({
          id: tx.id,
          type: tx.type,
          amount: Number(tx.amount),
          balanceBefore: Number(tx.balanceBefore),
          balanceAfter: Number(tx.balanceAfter),
          description: tx.description,
          createdAt: tx.createdAt,
          relatedPayment: tx.relatedPayment
            ? {
                id: tx.relatedPayment.id,
                status: tx.relatedPayment.status,
                courseTitle: tx.relatedPayment.course?.title || "Unknown Course",
              }
            : null,
        })),
        pagination: result.pagination,
      };
    }),
});
