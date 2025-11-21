"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WalletCheckoutOptionProps {
  coursePrice: number;
  onWalletAmountChange: (amount: number) => void;
}

export function WalletCheckoutOption({ coursePrice, onWalletAmountChange }: WalletCheckoutOptionProps) {
  const [useWallet, setUseWallet] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const { data: balanceData, isLoading } = api.student.wallet.getBalance.useQuery();

  const handleUseWalletToggle = (checked: boolean) => {
    setUseWallet(checked);
    if (!checked) {
      setCustomAmount("");
      onWalletAmountChange(0);
    } else {
      // Auto-use maximum possible amount
      const maxUsable = Math.min(balanceData?.balance ?? 0, coursePrice);
      onWalletAmountChange(maxUsable);
    }
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue) && numValue >= 0) {
      const maxUsable = Math.min(balanceData?.balance ?? 0, coursePrice);
      const finalAmount = Math.min(numValue, maxUsable);
      onWalletAmountChange(finalAmount);
    } else {
      onWalletAmountChange(0);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const walletBalance = balanceData?.balance ?? 0;
  const hasBalance = walletBalance > 0;
  const maxUsable = Math.min(walletBalance, coursePrice);
  const canCoverFull = walletBalance >= coursePrice;

  return (
    <Card className={useWallet ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Use Wallet Balance
        </CardTitle>
        <CardDescription>
          Available Balance: <span className="font-semibold text-primary">{walletBalance.toFixed(2)} EGP</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasBalance ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your wallet balance is empty. Earn cashback on purchases to build your balance!
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="use-wallet"
                checked={useWallet}
                onCheckedChange={handleUseWalletToggle}
              />
              <Label
                htmlFor="use-wallet"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Use wallet balance for this purchase
              </Label>
            </div>

            {useWallet && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Maximum usable amount:</span>
                  <span className="font-semibold">{maxUsable.toFixed(2)} EGP</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet-amount">Amount to use (optional)</Label>
                  <Input
                    id="wallet-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    max={maxUsable}
                    placeholder={`Max: ${maxUsable.toFixed(2)}`}
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use maximum available amount ({maxUsable.toFixed(2)} EGP)
                  </p>
                </div>

                {canCoverFull && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
                    <Info className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700 dark:text-green-400">
                      Your wallet balance can cover the full course price! No external payment needed.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
