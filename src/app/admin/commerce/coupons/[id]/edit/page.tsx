"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/trpc/react";
import { UpdateCouponInputSchema } from "@/types/admin";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { CouponType } from "@prisma/client";

type CouponFormInput = z.infer<typeof UpdateCouponInputSchema>;

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;
  const { showSnackbar } = useSnackbar();

  // 1. Fetch the coupon data
  const { data: coupon, isLoading } = api.admin.commerce.getCouponById.useQuery({ id: couponId });

  const form = useForm<CouponFormInput>({
    resolver: zodResolver(UpdateCouponInputSchema),
  });

  // 2. Populate the form once the coupon data is fetched
  useEffect(() => {
    if (coupon) {
      form.reset({
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        amount: coupon.amount,
        isActive: coupon.isActive,
        maxUsesPerUser: coupon.maxUsesPerUser,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        maxUses: coupon.maxUses,
      });
    }
  }, [coupon, form]);

  // 3. Define the mutation for updating the coupon
  const updateCoupon = api.admin.commerce.updateCoupon.useMutation({
    onSuccess: () => {
      showSnackbar("Coupon updated successfully!", "success");
      router.push("/admin/commerce/coupons");
      router.refresh();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to update coupon", "error");
    },
  });

  // 4. Handle form submission
  function onSubmit(data: CouponFormInput) {
    updateCoupon.mutate(data);
  }
  
  const couponType = form.watch("type");

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  if (!coupon) {
     return (
       <div className="text-center">
        <h2 className="heading-2">Coupon Not Found</h2>
        <Button onClick={() => router.push("/admin/commerce/coupons")} className="mt-4">
          Back to Coupons
        </Button>
      </div>
     )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Coupon"
        description={`Editing coupon code: ${coupon.code}`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code *</FormLabel>
                    <FormControl><Input placeholder="e.g., SUMMER25" {...field} /></FormControl>
                    <FormDescription>The code customers will enter at checkout.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value={CouponType.PERCENTAGE}>Percentage</SelectItem>
                          <SelectItem value={CouponType.FIXED}>Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount *</FormLabel>
                      <div className="relative">
                        <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="pl-8" /></FormControl>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {couponType === CouponType.PERCENTAGE ? '%' : 'EGP'}
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="md:col-span-1 space-y-6">
              <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === 'true')} value={String(field.value)}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Inactive coupons cannot be used.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Uses (Total)</FormLabel>
                    <FormControl><Input type="number" placeholder="Leave blank for unlimited" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxUsesPerUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Uses Per User</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl><Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} onChange={e => field.onChange(new Date(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl><Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)} /></FormControl>
                    <FormDescription>Leave blank for no expiry date.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={updateCoupon.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateCoupon.isPending}>
              {updateCoupon.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}