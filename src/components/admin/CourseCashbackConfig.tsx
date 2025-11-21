"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { Gift, Percent, DollarSign, XCircle, Loader2 } from "lucide-react";

interface CourseCashbackConfigProps {
  courseId: string;
  currentCashbackType?: "NONE" | "PERCENTAGE" | "FIXED";
  currentCashbackValue?: number;
  onUpdate?: () => void;
}

export function CourseCashbackConfig({
  courseId,
  currentCashbackType = "NONE",
  currentCashbackValue = 0,
  onUpdate,
}: CourseCashbackConfigProps) {
  const [cashbackType, setCashbackType] = useState<"NONE" | "PERCENTAGE" | "FIXED">(currentCashbackType);
  const [cashbackValue, setCashbackValue] = useState(currentCashbackValue.toString());
  const { showSnackbar } = useSnackbar();

  const updateCashback = api.admin.commerce.updateCourseCashback.useMutation({
    onSuccess: (data) => {
      showSnackbar(data.message, "success");
      onUpdate?.();
    },
    onError: (error) => {
      showSnackbar(error.message, "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cashbackType !== "NONE") {
      const numValue = parseFloat(cashbackValue);
      if (isNaN(numValue) || numValue <= 0) {
        showSnackbar("Please enter a valid positive cashback value", "error");
        return;
      }

      if (cashbackType === "PERCENTAGE" && numValue > 100) {
        showSnackbar("Percentage cashback cannot exceed 100%", "error");
        return;
      }
    }

    updateCashback.mutate({
      courseId,
      cashbackType,
      cashbackValue: cashbackType === "NONE" ? 0 : parseFloat(cashbackValue),
    });
  };

  const getCashbackIcon = () => {
    switch (cashbackType) {
      case "PERCENTAGE":
        return <Percent className="h-5 w-5" />;
      case "FIXED":
        return <DollarSign className="h-5 w-5" />;
      default:
        return <XCircle className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Cashback Configuration
        </CardTitle>
        <CardDescription>
          Configure cashback rewards for students who purchase this course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cashbackType">Cashback Type</Label>
            <Select
              value={cashbackType}
              onValueChange={(value) => setCashbackType(value as "NONE" | "PERCENTAGE" | "FIXED")}
            >
              <SelectTrigger id="cashbackType">
                <SelectValue placeholder="Select cashback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    <span>No Cashback</span>
                  </div>
                </SelectItem>
                <SelectItem value="PERCENTAGE">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <span>Percentage</span>
                  </div>
                </SelectItem>
                <SelectItem value="FIXED">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Fixed Amount</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {cashbackType !== "NONE" && (
            <div className="space-y-2">
              <Label htmlFor="cashbackValue">
                Cashback Value {cashbackType === "PERCENTAGE" ? "(%)" : "(EGP)"}
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {getCashbackIcon()}
                  </div>
                  <Input
                    id="cashbackValue"
                    type="number"
                    step="0.01"
                    min="0"
                    max={cashbackType === "PERCENTAGE" ? "100" : undefined}
                    placeholder={cashbackType === "PERCENTAGE" ? "0-100" : "0.00"}
                    value={cashbackValue}
                    onChange={(e) => setCashbackValue(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {cashbackType === "PERCENTAGE" && (
                <p className="text-xs text-muted-foreground">
                  Students will receive {cashbackValue}% of the course price as cashback
                </p>
              )}
              {cashbackType === "FIXED" && (
                <p className="text-xs text-muted-foreground">
                  Students will receive {cashbackValue} EGP as cashback
                </p>
              )}
            </div>
          )}

          <Button type="submit" disabled={updateCashback.isPending} className="w-full">
            {updateCashback.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Cashback Configuration"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
