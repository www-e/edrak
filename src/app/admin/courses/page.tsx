"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SearchFilter } from "@/components/admin/shared/search-filter";
import { DataTable } from "@/components/admin/shared/data-table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { type Course, type CourseVisibility } from "@prisma/client";

// This creates a specific type for our table data, which includes the nested professor info.
type CourseWithProfessor = Course & {
  professor: {
    firstName: string | null;
    lastName: string | null;
  };
};

// Define the column type based on the DataTable's generic props for full type safety
type CourseTableColumn = React.ComponentProps<typeof DataTable<CourseWithProfessor>>['columns'][number];

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof CourseWithProfessor>("createdAt");
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

  // Sort courses with a robust, null-safe function
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    
    return 0;
  });

  const pageSize = 10;
  const paginatedCourses = sortedCourses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  
  // Strongly typed columns array with type guards in each render function
  const columns: CourseTableColumn[] = [
    {
      key: "title",
      title: "Title",
    },
    {
      key: "professor",
      title: "Professor",
      render: (value) => {
        // Type Guard: Ensure the value is a professor object before accessing properties
        if (typeof value === 'object' && value && 'firstName' in value && 'lastName' in value) {
          return `${value.firstName || ''} ${value.lastName || ''}`.trim();
        }
        return '--';
      },
    },
    {
      key: "price",
      title: "Price",
      render: (value) => {
        // Type Guard: Ensure the value is a number before calling toFixed
        if (typeof value === 'number') {
          return `EGP ${value.toFixed(2)}`;
        }
        return '--';
      },
    },
    {
      key: "language",
      title: "Language",
    },
    {
      key: "visibility",
      title: "Status",
      render: (value) => {
        // Type Guard: Ensure value is one of the expected visibility strings
        if (typeof value === 'string' && ['PUBLISHED', 'DRAFT', 'ARCHIVED'].includes(value)) {
          const visibility = value as CourseVisibility;
          return (
            <StatusBadge 
              variant={visibility === "PUBLISHED" ? "success" : visibility === "DRAFT" ? "warning" : "secondary"}
            >
              {visibility}
            </StatusBadge>
          );
        }
        return '--';
      },
    },
    {
      key: "createdAt",
      title: "Created",
      render: (value) => {
        // Type Guard: Ensure the value is a Date object before calling date methods
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        return '--';
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage all platform courses"
        actions={
          <Button onClick={() => router.push("/admin/courses/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        }
      />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchFilter
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search courses..."
          className="w-full md:w-80"
        />
      </div>
      
      <DataTable
        data={paginatedCourses}
        columns={columns}
        loading={isLoading}
        pagination={{
          page,
          pageSize,
          total: filteredCourses.length,
          onPageChange: setPage,
        }}
        sorting={{
          sortBy,
          sortOrder,
          onSortChange: (newSortBy, newSortOrder) => {
            setSortBy(newSortBy as keyof CourseWithProfessor);
            setSortOrder(newSortOrder);
            setPage(1);
          },
        }}
        onRowClick={(course) => router.push(`/admin/courses/${course.id}`)}
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No courses found</p>
            <Button 
              className="mt-4" 
              onClick={() => router.push("/admin/courses/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Course
            </Button>
          </div>
        }
      />
    </div>
  );
}