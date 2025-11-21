"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SearchFilter } from "@/components/admin/shared/search-filter";
import { DataTable, type DataTableColumn } from "@/components/admin/shared/data-table";
import { Plus } from "lucide-react";
import { courseColumns } from "@/lib/admin-table-helpers";

// This is the robust, correct way to get the type from the tRPC router.
type RouterOutput = inferRouterOutputs<AppRouter>;
type CourseForTable = RouterOutput["admin"]["course"]["getAll"]["courses"][number];

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit] = useState(20);

  const { data: coursesData, isLoading } = api.admin.course.getAll.useQuery(
    {
      page,
      limit,
      search: searchTerm,
      sortBy,
      sortOrder
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  const courses = coursesData?.courses ?? [];
  const pagination = coursesData?.pagination;
  
  const columns: DataTableColumn<CourseForTable>[] = courseColumns;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage all platform courses"
        actions={
          <Button onClick={() => router.push("/admin/courses/new")}>
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        }
      />
      <SearchFilter value={searchTerm} onChange={setSearchTerm} placeholder="Search courses..." className="w-full md:w-80"/>
      <DataTable
        data={courses}
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
        sorting={{
          sortBy: sortBy as keyof CourseForTable,
          sortOrder,
          onSortChange: (newSortBy, newSortOrder) => {
            setSortBy(newSortBy as string);
            setSortOrder(newSortOrder);
            setPage(1); // Reset to first page when sorting changes
          }
        }}
        onRowClick={(course) => router.push(`/admin/courses/${course.id}`)}
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No courses found</p>
            <Button className="mt-4" onClick={() => router.push("/admin/courses/new")}>
              <Plus className="mr-2 h-4 w-4" /> Create First Course
            </Button>
          </div>
        }
      />
    </div>
  );
}