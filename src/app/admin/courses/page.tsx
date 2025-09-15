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
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Plus } from "lucide-react";
import { CourseVisibility } from "@prisma/client";

// This is the robust, correct way to get the type from the tRPC router.
type RouterOutput = inferRouterOutputs<AppRouter>;
type CourseForTable = RouterOutput["admin"]["course"]["getAll"][number];

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof CourseForTable>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: coursesData, isLoading } = api.admin.course.getAll.useQuery();
  const courses = coursesData ?? [];

  const filteredCourses = courses.filter(course => {
    const professorName = `${course.professor.firstName || ''} ${course.professor.lastName || ''}`.trim();
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      professorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  const pageSize = 10;
  const paginatedCourses = sortedCourses.slice((page - 1) * pageSize, page * pageSize);
  
  const columns: DataTableColumn<CourseForTable>[] = [
    { key: "title", title: "Title" },
    { 
      key: "professor", 
      title: "Professor",
      // FIX: Assert the type of 'value' to the specific professor object shape.
      render: (value) => {
        const professor = value as { firstName: string; lastName: string; };
        return `${professor.firstName || ''} ${professor.lastName || ''}`.trim();
      }
    },
    { 
      key: "price", 
      title: "Price", 
      // FIX: Assert the type of 'value' to be a number.
      render: (value) => `EGP ${(value as number).toFixed(2)}` 
    },
    { key: "language", title: "Language" },
    { 
      key: "visibility", 
      title: "Status",
      // FIX: Assert the type of 'value' to be CourseVisibility enum.
      render: (value) => (
        <StatusBadge variant={(value as CourseVisibility) === "PUBLISHED" ? "success" : (value as CourseVisibility) === "DRAFT" ? "warning" : "secondary"}>
          {value as React.ReactNode}
        </StatusBadge>
      )
    },
    { 
      key: "createdAt", 
      title: "Created", 
      // FIX: Assert the type of 'value' to be a Date object.
      render: (value) => new Date(value as Date).toLocaleDateString() 
    },
  ];

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
        data={paginatedCourses}
        columns={columns}
        loading={isLoading}
        pagination={{ page, pageSize, total: filteredCourses.length, onPageChange: setPage }}
        sorting={{ 
          sortBy, 
          sortOrder, 
          onSortChange: (newSortBy, newSortOrder) => {
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
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