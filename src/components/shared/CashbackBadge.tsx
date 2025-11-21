"use client";

import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";

interface CashbackBadgeProps {
  cashbackType: "NONE" | "PERCENTAGE" | "FIXED";
  cashbackValue: number;
  coursePrice?: number;
  className?: string;
}

export function CashbackBadge({ cashbackType, cashbackValue, coursePrice, className }: CashbackBadgeProps) {
  if (cashbackType === "NONE" || cashbackValue <= 0) {
    return null;
  }

  const getCashbackText = () => {
    if (cashbackType === "PERCENTAGE") {
      return `${cashbackValue}% Cashback`;
    } else if (cashbackType === "FIXED") {
      return `${cashbackValue} EGP Cashback`;
    }
    return "";
  };

  const getCashbackAmount = () => {
    if (!coursePrice) return null;
    
    if (cashbackType === "PERCENTAGE") {
      const amount = (coursePrice * cashbackValue) / 100;
      return `Earn ${amount.toFixed(2)} EGP`;
    } else if (cashbackType === "FIXED") {
      return `Earn ${cashbackValue} EGP`;
    }
    return null;
  };

  return (
    <div className={className}>
      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 gap-1">
        <Gift className="h-3 w-3" />
        {getCashbackText()}
      </Badge>
      {coursePrice && getCashbackAmount() && (
        <p className="text-xs text-muted-foreground mt-1">
          {getCashbackAmount()}
        </p>
      )}
    </div>
  );
}
