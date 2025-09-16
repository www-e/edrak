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
type CouponForTable = RouterOutput["admin"]["commerce"]["getAllCoupons"][number];

export default function CouponsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof CouponForTable>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: couponsData, isLoading } = api.admin.commerce.getAllCoupons.useQuery();
  const coupons = couponsData ?? [];

  // Basic sorting logic
  const sortedCoupons = [...coupons].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    
    return 0;
  });

  const pageSize = 10;
  const paginatedCoupons = sortedCoupons.slice((page - 1) * pageSize, page * pageSize);

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
        data={paginatedCoupons}
        columns={columns}
        loading={isLoading}
        pagination={{ page, pageSize, total: coupons.length, onPageChange: setPage }}
        sorting={{ 
          sortBy, 
          sortOrder, 
          onSortChange: (newSortBy, newSortOrder) => {
            setSortBy(newSortBy as keyof CouponForTable);
            setSortOrder(newSortOrder);
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