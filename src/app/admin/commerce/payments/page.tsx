"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/admin/shared/data-table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { SearchFilter } from "@/components/admin/shared/search-filter";
import { PaymentStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";

// Get the specific types for a payment from our tRPC router for full type safety
type RouterOutput = inferRouterOutputs<AppRouter>;
type PaymentForTable = RouterOutput["admin"]["commerce"]["getAllPayments"]["payments"][number];

export default function PaymentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data: paymentsData, isLoading } = api.admin.commerce.getAllPayments.useQuery(
    {
      page,
      limit,
      search: searchTerm
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  const payments = paymentsData?.payments ?? [];
  const pagination = paymentsData?.pagination;

  const getStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'destructive';
      case 'REFUNDED': return 'secondary';
      default: return 'default';
    }
  };

  const columns: DataTableColumn<PaymentForTable>[] = [
    { 
      key: "user", 
      title: "User",
      render: (value) => {
        // Ensure we always return a string
        if (value && typeof value === 'object' && value !== null && 'firstName' in value && 'lastName' in value) {
          const user = value as { firstName: string; lastName: string };
          return `${user.firstName} ${user.lastName}`;
        }
        return 'N/A';
      }
    },
    { 
      key: "course", 
      title: "Course",
      render: (value) => {
        // Ensure we always return a string
        if (value && typeof value === 'object' && value !== null && 'title' in value) {
          const course = value as { title: string };
          return course.title ?? 'N/A';
        }
        return 'N/A';
      }
    },
    { 
      key: "amount", 
      title: "Amount",
      render: (value) => {
        // Ensure we always return a string
        if (value !== null && value !== undefined) {
          return `EGP ${Number(value).toFixed(2)}`;
        }
        return 'N/A';
      }
    },
    { 
      key: "status", 
      title: "Status",
      render: (value) => {
        // Ensure we always return a JSX element
        if (value && typeof value === 'string') {
          return (
            <StatusBadge variant={getStatusVariant(value as unknown as PaymentStatus)}>
              {value}
            </StatusBadge>
          );
        }
        return (
          <StatusBadge variant="default">
            N/A
          </StatusBadge>
        );
      }
    },
    { 
      key: "createdAt", 
      title: "Date", 
      render: (value) => {
        // Ensure we always return a string
        if (value && (typeof value === 'string' || typeof value === 'number')) {
          return new Date(value).toLocaleString();
        }
        return 'N/A';
      }
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="View and search all financial transactions"
        actions={<Button variant="outline" onClick={() => router.back()}>Back to Commerce</Button>}
      />
      
      <SearchFilter
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by user or course..."
        className="w-full md:w-80"
      />
      
      <DataTable
        data={payments}
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
        emptyState={
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">No payments found</h3>
            <p className="text-muted-foreground mt-1">Transactions will appear here as they are made.</p>
          </div>
        }
      />
    </div>
  );
}