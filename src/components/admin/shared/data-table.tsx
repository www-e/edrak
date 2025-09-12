"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    sortBy: keyof T;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: keyof T, sortOrder: 'asc' | 'desc') => void;
  };
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
}

export function DataTable<T>({ 
  data, 
  columns, 
  loading = false, 
  pagination,
  sorting,
  onRowClick,
  emptyState 
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(sorting ? { 
    key: sorting.sortBy, 
    direction: sorting.sortOrder 
  } : null);

  const handleSort = (key: keyof T) => {
    if (!sorting) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    sorting.onSortChange(key, direction);
  };

  const renderCell = (row: T, column: { key: keyof T; title: string; render?: (value: T[keyof T], row: T) => React.ReactNode }) => {
    const value = row[column.key];
    if (column.render) {
      return column.render(value, row);
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
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
                className={cn(
                  sorting && "cursor-pointer hover:bg-muted",
                  sortConfig?.key === column.key && "bg-muted"
                )}
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.title}
                  {sortConfig?.key === column.key && (
                    <span>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={index} 
              className={cn(
                onRowClick && "cursor-pointer hover:bg-muted/50"
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {renderCell(row, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {pagination && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === Math.ceil(pagination.total / pagination.pageSize)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(Math.ceil(pagination.total / pagination.pageSize))}
              disabled={pagination.page === Math.ceil(pagination.total / pagination.pageSize)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}