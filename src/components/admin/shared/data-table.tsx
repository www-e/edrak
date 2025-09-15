"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ENHANCEMENT: By using TypeScript generics (<TData>), we create a fully type-safe component.
 * 'key' is now strictly typed as keyof TData, ensuring it's a valid property of our data objects.
 * This eliminates all "implicit any" and "index signature" errors.
 */
export type DataTableColumn<TData> = {
  key: keyof TData;
  title: string;
  render?: (value: TData[keyof TData], row: TData) => React.ReactNode;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    sortBy: keyof TData;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: keyof TData, sortOrder: 'asc' | 'desc') => void;
  };
  onRowClick?: (row: TData) => void;
  emptyState?: React.ReactNode;
}

export function DataTable<TData>({ 
  data, 
  columns, 
  loading = false, 
  pagination,
  sorting,
  onRowClick,
  emptyState 
}: DataTableProps<TData>) {

  const handleSort = (key: keyof TData) => {
    if (!sorting) return;
    const newSortOrder = sorting.sortBy === key && sorting.sortOrder === 'asc' ? 'desc' : 'asc';
    sorting.onSortChange(key, newSortOrder);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border">
        {emptyState || <p className="text-muted-foreground">No data available</p>}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={String(column.key)} 
                className={cn(sorting && "cursor-pointer hover:bg-muted")}
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.title}
                  {sorting?.sortBy === column.key ? (
                    sorting.sortOrder === 'asc' ? ' ▲' : ' ▼'
                  ) : sorting ? <ArrowUpDown className="h-4 w-4 text-muted-foreground" /> : null}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={index} 
              className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {pagination && (
         <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => pagination.onPageChange(1)} disabled={pagination.page === 1}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => pagination.onPageChange(pagination.page - 1)} disabled={pagination.page === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => pagination.onPageChange(pagination.page + 1)} disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => pagination.onPageChange(Math.ceil(pagination.total / pagination.pageSize))} disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}