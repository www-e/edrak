"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, History, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentWalletPage() {
  const [filterType, setFilterType] = useState<string>("all");

  // Queries
  const { data: balanceData, isLoading: balanceLoading } = api.student.wallet.getBalance.useQuery();
  
  const { data: transactionsData, isLoading: transactionsLoading } = api.student.wallet.getTransactionHistory.useQuery({
    page: 1,
    limit: 50,
    type: filterType === "all" ? undefined : (filterType as "PURCHASE_DEBIT" | "CASHBACK_CREDIT" | "ADMIN_CREDIT" | "ADMIN_DEBIT" | "REFUND_CREDIT"),
  });

  const getTransactionIcon = (type: string) => {
    const isCredit = type.includes("CREDIT");
    return isCredit ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "ADMIN_CREDIT":
        return "bg-green-500";
      case "ADMIN_DEBIT":
        return "bg-red-500";
      case "CASHBACK_CREDIT":
        return "bg-blue-500";
      case "PURCHASE_DEBIT":
        return "bg-orange-500";
      case "REFUND_CREDIT":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTransactionType = (type: string) => {
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Wallet className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <p className="text-muted-foreground">Manage your wallet balance and view transaction history</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Available Balance</CardTitle>
          <CardDescription>Use your wallet balance to purchase courses</CardDescription>
        </CardHeader>
        <CardContent>
          {balanceLoading ? (
            <Skeleton className="h-12 w-48" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-primary">
                {balanceData?.balance.toFixed(2)}
              </span>
              <span className="text-2xl text-muted-foreground">{balanceData?.currency}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cashback Info */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <TrendingUp className="h-5 w-5" />
            Earn Cashback
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-600 dark:text-blue-300">
          <p>
            Earn cashback on eligible course purchases! Cashback is automatically credited to your wallet
            after successful payment and can be used for future purchases.
          </p>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5" />
              <CardTitle>Transaction History</CardTitle>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="CASHBACK_CREDIT">Cashback</SelectItem>
                <SelectItem value="PURCHASE_DEBIT">Purchases</SelectItem>
                <SelectItem value="ADMIN_CREDIT">Admin Credits</SelectItem>
                <SelectItem value="REFUND_CREDIT">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {transactionsData && (
            <CardDescription>
              Showing {transactionsData.transactions.length} of {transactionsData.pagination.total} transactions
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : transactionsData && transactionsData.transactions.length > 0 ? (
            <div className="space-y-3">
              {transactionsData.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getTransactionTypeColor(tx.type)}>
                          {formatTransactionType(tx.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      {tx.relatedPayment && (
                        <p className="text-xs text-muted-foreground">
                          Course: {tx.relatedPayment.courseTitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1 ml-4">
                    <div className={`text-lg font-semibold whitespace-nowrap ${
                      tx.amount >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {tx.amount >= 0 ? "+" : ""}{tx.amount.toFixed(2)} EGP
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      Balance: {tx.balanceAfter.toFixed(2)} EGP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Your wallet transactions will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
