import { TransactionType, WalletTransaction} from "@prisma/client";

/**
 * Wallet transaction with related payment and course information
 */
export interface WalletTransactionWithDetails extends WalletTransaction {
  relatedPayment?: {
    id: string;
    status: string;
    course: {
      title: string;
    } | null;
  } | null;
}

/**
 * Input for admin wallet adjustment
 */
export interface WalletAdjustmentInput {
  userId: string;
  amount: number;
  reason: string;
}

/**
 * Wallet balance response
 */
export interface WalletBalanceResponse {
  balance: number;
  currency: string;
}

/**
 * Transaction history response
 */
export interface TransactionHistoryResponse {
  transactions: WalletTransactionWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Cashback calculation result
 */
export interface CashbackCalculation {
  amount: number;
  type: "PERCENTAGE" | "FIXED" | "NONE";
  value: number;
}

export { TransactionType };
