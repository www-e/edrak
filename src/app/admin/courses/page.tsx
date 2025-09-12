"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SearchFilter } from "@/components/admin/shared/search-filter";
import { DataTable } from "@/components/admin/shared/data-table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  language: string;
  visibility: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  professorName: string;
  createdAt: Date;
}

// Mock data for now
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to React",
    slug: "introduction-to-react",
    description: "Learn the basics of React development",
    price: 299.99,
    language: "English",
    visibility: "PUBLISHED",
    professorName: "John Doe",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    slug: "advanced-typescript",
    description: "Master advanced TypeScript concepts",
    price: 399.99,
    language: "English",
    visibility: "DRAFT",
    professorName: "Jane Smith",
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "3",
    title: "Next.js Fundamentals",
    slug: "nextjs-fundamentals",
    description: "Build modern web applications with Next.js",
    price: 349.99,
    language: "English",
    visibility: "PUBLISHED",
    professorName: "Bob Johnson",
    createdAt: new Date("2023-03-10"),
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Course>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Filter courses based on search term
  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.professorName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  
  // Paginate courses
  const pageSize = 10;
  const paginatedCourses = sortedCourses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  
  const columns = [
    {
      key: "title" as keyof Course,
      title: "Title",
    },
    {
      key: "professorName" as keyof Course,
      title: "Professor",
    },
    {
      key: "price" as keyof Course,
      title: "Price",
      render: (value: Course[keyof Course]) => `EGP ${(value as number).toFixed(2)}`,
    },
    {
      key: "language" as keyof Course,
      title: "Language",
    },
    {
      key: "visibility" as keyof Course,
      title: "Status",
      render: (value: Course[keyof Course]) => (
        <StatusBadge 
          variant={value === "PUBLISHED" ? "success" : value === "DRAFT" ? "warning" : "secondary"}
        >
          {value as string}
        </StatusBadge>
      ),
    },
    {
      key: "createdAt" as keyof Course,
      title: "Created",
      render: (value: Course[keyof Course]) => (value as Date).toLocaleDateString(),
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
            setSortBy(newSortBy as keyof Course);
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