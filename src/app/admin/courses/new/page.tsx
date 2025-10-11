"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/trpc/react";
import { CreateCourseInputSchema } from "@/types/admin";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { Role } from "@prisma/client";
import { CourseForm } from "@/components/admin/courses/CourseForm";

type CreateCourseFormInput = z.infer<typeof CreateCourseInputSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  // 1. Fetch data for dropdowns
  const { data: users, isLoading: isLoadingUsers } = api.admin.user.getAll.useQuery();
  const { data: categories, isLoading: isLoadingCategories } = api.admin.category.getAll.useQuery();

  const professors = users?.users?.filter(user => user.role === Role.PROFESSOR) ?? [];

  // 2. Initialize the form
  const form = useForm<CreateCourseFormInput>({
    resolver: zodResolver(CreateCourseInputSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: 0,
      language: "Arabic",
      visibility: "DRAFT",
      professorId: "",
      categoryId: null,
    },
  });

  // 3. Define the mutation for creating the course
  const createCourse = api.admin.course.createCourse.useMutation({
    onSuccess: (data) => {
      showSnackbar("Course created successfully!", "success");
      // Redirect to the new course's detail page (which we will build next)
      router.push(`/admin/courses/${data.id}`);
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to create course", "error");
    },
  });

  // 4. Handle form submission
  function onSubmit(data: CreateCourseFormInput) {
    createCourse.mutate(data);
  }
  
  // 5. Auto-generate slug from title for better UX
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .slice(0, 50); // Limit length
    form.setValue("slug", slug);
  };

  const isLoading = isLoadingUsers || isLoadingCategories;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Course"
        description="Fill in the details to add a new course to the platform."
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        }
      />

      {isLoading ? (
         <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         </div>
      ) : (
        <CourseForm
          form={form}
          onSubmit={onSubmit}
          isPending={createCourse.isPending}
          professors={professors}
          categories={categories}
          submitButtonText="Create Course"
          handleTitleChange={handleTitleChange}
        />
      )}
    </div>
  );
}