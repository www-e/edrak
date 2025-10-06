"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/admin/shared/data-table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Plus } from "lucide-react";

// Get the specific types for a coupon from our tRPC router
type RouterOutput = inferRouterOutputs<AppRouter>;
type CouponForTable = RouterOutput["admin"]["commerce"]["getAllCoupons"]["coupons"][number];

export default function CouponsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data: couponsData, isLoading } = api.admin.commerce.getAllCoupons.useQuery(
    {
      page,
      limit
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  const coupons = couponsData?.coupons ?? [];
  const pagination = couponsData?.pagination;

  const columns: DataTableColumn<CouponForTable>[] = [
    { key: "code", title: "Code" },
    { 
      key: "type", 
      title: "Type",
      render: (value) => <StatusBadge variant="secondary">{String(value)}</StatusBadge>
    },
    { 
      key: "amount", 
      title: "Amount",
      render: (value, row) => value ? (row.type === "PERCENTAGE" ? `${value}%` : `EGP ${Number(value).toFixed(2)}`) : 'N/A'
    },
    {
      key: "usedCount",
      title: "Usage",
      render: (value, row) => value !== null && row.maxUses !== null ? `${value} / ${row.maxUses}` : 'N/A'
    },
    { 
      key: "isActive", 
      title: "Status",
      render: (value) => value !== null ? (
        <StatusBadge variant={value ? "success" : "default"}>
          {value ? "Active" : "Inactive"}
        </StatusBadge>
      ) : (
        <StatusBadge variant="default">
          N/A
        </StatusBadge>
      )
    },
    { 
      key: "endDate", 
      title: "Expires On", 
      render: (value) => value && typeof value === 'string' || typeof value === 'number' ? new Date(value).toLocaleDateString() : 'Never'
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Create and manage discount codes for your courses"
        actions={
          <Button onClick={() => router.push("/admin/commerce/coupons/new")}>
            <Plus className="mr-2 h-4 w-4" /> Add Coupon
          </Button>
        }
      />
      
      <DataTable
        data={coupons}
        columns={columns}
        loading={isLoading}
        pagination={{
          page,
          pageSize: limit,
          total: pagination?.total ?? 0,
          onPageChange: (newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onRowClick={(coupon) => router.push(`/admin/commerce/coupons/${coupon.id}/edit`)}
        emptyState={
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">No coupons found</h3>
            <p className="text-muted-foreground mt-1">Get started by creating your first coupon.</p>
            <Button className="mt-4" onClick={() => router.push("/admin/commerce/coupons/new")}>
              <Plus className="mr-2 h-4 w-4" /> Create First Coupon
            </Button>
          </div>
        }
      />
    </div>
  );
}