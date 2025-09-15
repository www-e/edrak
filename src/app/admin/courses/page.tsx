"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { type CourseVisibility } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SearchFilter } from "@/components/admin/shared/search-filter";
import { DataTable, type DataTableColumn } from "@/components/admin/shared/data-table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Plus } from "lucide-react";

// This is the key fix: We derive the exact type of our data directly from the tRPC query.
// This makes the component 100% type-safe and resilient to backend changes.
type CourseForTable = NonNullable<Awaited<ReturnType<typeof api.admin.course.getAll.useQuery>>['data']>[number];

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  // The state for sorting is now strictly typed to be a key of our data shape.
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
    // This dynamic property access is now type-safe because `sortBy` must be a key of `CourseForTable`.
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    
    return 0;
  });

  const pageSize = 10;
  const paginatedCourses = sortedCourses.slice((page - 1) * pageSize, page * pageSize);
  
  // This `columns` array is now strictly typed against our data and the DataTable component.
  const columns: DataTableColumn<CourseForTable>[] = [
    { key: "title", title: "Title" },
    { 
      key: "professor", 
      title: "Professor",
      render: (value) => `${value.firstName || ''} ${value.lastName || ''}`.trim()
    },
    { key: "price", title: "Price", render: (value) => `EGP ${value.toFixed(2)}` },
    { key: "language", title: "Language" },
    { 
      key: "visibility", 
      title: "Status",
      render: (value) => (
        <StatusBadge variant={value === "PUBLISHED" ? "success" : value === "DRAFT" ? "warning" : "secondary"}>
          {value}
        </StatusBadge>
      )
    },
    { key: "createdAt", title: "Created", render: (value) => new Date(value).toLocaleDateString() },
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