"use client";

import { api } from "@/trpc/react";
import { PageHeader } from "@/components/admin/shared/page-header";
import { MetricCard } from "@/components/admin/shared/metric-card";
import { 
  CreditCard, 
  TrendingUp, 
  Users,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function CommercePage() {
  const router = useRouter();
  const { data: metrics, isLoading } = api.admin.commerce.getDashboardMetrics.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commerce"
        description="Manage payments, coupons, and financial metrics"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => router.push("/admin/commerce/coupons")}>Manage Coupons</Button>
            {/* This will link to the payments page we build later */}
            <Button variant="outline" onClick={() => router.push("/admin/commerce/payments")}>View Payments</Button>
          </div>
        }
      />
      
      {/* Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`EGP ${metrics?.totalRevenue.toFixed(2) ?? '0.00'}`}
          description="From completed payments"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers ?? 0}
          description="All user roles included"
          icon={<Users className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Total Courses"
          value={metrics?.totalCourses ?? 0}
          description="Published and draft courses"
          icon={<BookOpen className="h-4 w-4" />}
        />
        
         <MetricCard
          title="Active Enrollments"
          value={metrics?.activeEnrollments ?? 0}
          description="Currently active students"
          icon={<CreditCard className="h-4 w-4" />}
        />
      </div>
      
      {/* Placeholder for Recent Payments/Coupons - We can build this out later */}
      <div className="text-center py-12 border border-dashed rounded-lg">
        <h3 className="text-lg font-semibold">Coupon Management</h3>
        <p className="text-muted-foreground mt-1">Create and manage discount codes for your courses.</p>
        <Button className="mt-4" onClick={() => router.push("/admin/commerce/coupons/new")}>
          <Plus className="mr-2 h-4 w-4" /> Create First Coupon
        </Button>
      </div>
    </div>
  );
}