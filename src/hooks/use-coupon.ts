
import { useState } from "react";
import { api } from "@/trpc/react";
import { useSnackbar } from "@/components/shared/snackbar-context";

export interface AppliedCoupon {
  code: string;
  discount: number;
  discountType: "PERCENTAGE" | "FIXED";
  finalAmount: number;
}

export function useCoupon(coursePrice: number) {
  const { showSnackbar } = useSnackbar();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const validateCouponMutation = api.student.payment.validateCoupon.useMutation();

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      showSnackbar("Please enter a coupon code", "error");
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const result = await validateCouponMutation.mutateAsync({
        couponCode: couponCode.trim(),
        coursePrice: coursePrice,
      });

      if (result.isValid) {
        const newAppliedCoupon = {
          code: result.coupon!.code,
          discount: result.discount,
          discountType: result.discountType as "PERCENTAGE" | "FIXED",
          finalAmount: result.finalAmount,
        };
        setAppliedCoupon(newAppliedCoupon);
        showSnackbar(`Coupon applied! You saved ${result.discount.toFixed(2)} EGP`, "success");
        return newAppliedCoupon;
      } else {
        showSnackbar(result.error || "Invalid coupon code", "error");
        setAppliedCoupon(null);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error validating coupon";
      showSnackbar(errorMessage, "error");
      setAppliedCoupon(null);
      return null;
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    showSnackbar("Coupon removed");
  };

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    isValidatingCoupon,
    validateCoupon,
    removeCoupon,
  };
}
