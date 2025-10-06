"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/admin/shared/data-table";
import { SearchFilter } from "@/components/admin/shared/search-filter";
import { Button } from "@/components/ui/button";
import { paymentColumns } from "@/lib/admin-table-helpers";

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

  const columns: DataTableColumn<PaymentForTable>[] = paymentColumns;

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