"use client";

import { useRouter, useParams } from "next/navigation";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/admin/shared/data-table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { BookUser, Tag, Languages, CircleDollarSign, Calendar, Plus, BarChart } from "lucide-react";

// Get the specific types for a single course and its lessons from our tRPC router
type RouterOutput = inferRouterOutputs<AppRouter>;
type CourseDetail = NonNullable<RouterOutput["admin"]["course"]["getById"]>;
type LessonForTable = CourseDetail["lessons"][number];

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const { data: course, isLoading, isError, error } = api.admin.course.getById.useQuery({ id: courseId });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive">
        <h2 className="heading-2">Error Loading Course</h2>
        <p>{error.message}</p>
        <Button onClick={() => router.push("/admin/courses")} className="mt-4">
          Back to Courses
        </Button>
      </div>
    );
  }
  
  if (!course) {
    return (
       <div className="text-center">
        <h2 className="heading-2">Course Not Found</h2>
        <p className="text-muted-foreground">The course you are looking for does not exist.</p>
        <Button onClick={() => router.push("/admin/courses")} className="mt-4">
          Back to Courses
        </Button>
      </div>
    );
  }

  const lessonColumns: DataTableColumn<LessonForTable>[] = [
    { key: "order", title: "Order" },
    { key: "title", title: "Title" },
    { 
      key: "isVisible", 
      title: "Status",
      render: (value) => (
        <StatusBadge variant={value ? "success" : "secondary"}>
          {value ? "Visible" : "Hidden"}
        </StatusBadge>
      )
    },
     { 
      key: "createdAt", 
      title: "Created On", 
      render: (value) => {
        // Type guard to check if value can be converted to Date
        if (value && (typeof value === 'string' || typeof value === 'number')) {
          return new Date(value).toLocaleDateString();
        }
        return 'N/A';
      }
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={course.title}
        description="View course details and manage its lessons"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/admin/courses/${course.id}/edit`)}>
              Edit Course
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Back to List
            </Button>
          </div>
        }
      />

      {/* Course Metadata Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookUser className="h-5 w-5 text-muted-foreground" /> Professor</CardTitle></CardHeader>
          <CardContent><p>{course.professor.firstName} {course.professor.lastName}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Tag className="h-5 w-5 text-muted-foreground" /> Category</CardTitle></CardHeader>
          <CardContent><p>{course.category?.name ?? 'Uncategorized'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CircleDollarSign className="h-5 w-5 text-muted-foreground" /> Price</CardTitle></CardHeader>
          <CardContent><p>EGP {course.price.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Languages className="h-5 w-5 text-muted-foreground" /> Language</CardTitle></CardHeader>
          <CardContent><p>{course.language}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart className="h-5 w-5 text-muted-foreground" /> Status</CardTitle></CardHeader>
          <CardContent>
             <StatusBadge variant={course.visibility === "PUBLISHED" ? "success" : course.visibility === "DRAFT" ? "warning" : "secondary"}>
                {course.visibility}
            </StatusBadge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-5 w-5 text-muted-foreground" /> Created On</CardTitle></CardHeader>
          <CardContent><p>{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}</p></CardContent>
        </Card>
      </div>

      {/* Lesson Management Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Lessons</CardTitle>
            <p className="text-sm text-muted-foreground">Manage the lessons within this course.</p>
          </div>
          <Button onClick={() => router.push(`/admin/courses/${course.id}/lessons/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Lesson
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={course.lessons}
            columns={lessonColumns}
            onRowClick={(lesson) => router.push(`/admin/courses/${course.id}/lessons/${lesson.id}`)}
            emptyState={
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold">No lessons found</h3>
                <p className="text-muted-foreground mt-1">Get started by creating the first lesson for this course.</p>
                <Button className="mt-4" onClick={() => router.push(`/admin/courses/${course.id}/lessons/new`)}>
                  <Plus className="mr-2 h-4 w-4" /> Create First Lesson
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}