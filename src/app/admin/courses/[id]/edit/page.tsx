"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/trpc/react";
import { UpdateCourseInputSchema } from "@/types/admin";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { Role } from "@prisma/client";
import { CourseForm } from "@/components/admin/courses/CourseForm";

type UpdateCourseFormInput = z.infer<typeof UpdateCourseInputSchema>;

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { showSnackbar } = useSnackbar();

  // 1. Fetch data for the form and its dropdowns
  const { data: course, isLoading: isLoadingCourse } = api.admin.course.getById.useQuery({ id: courseId });
  const { data: users, isLoading: isLoadingUsers } = api.admin.user.getAll.useQuery();
  const { data: categories, isLoading: isLoadingCategories } = api.admin.category.getAll.useQuery();

  const professors = users?.users?.filter(user => user.role === Role.PROFESSOR) ?? [];

  // 2. Initialize the form with our Zod schema
  const form = useForm<UpdateCourseFormInput>({
    resolver: zodResolver(UpdateCourseInputSchema),
  });

  // 3. Populate the form once the course data is fetched
  useEffect(() => {
    if (course) {
      form.reset({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        price: course.price,
        language: course.language,
        visibility: course.visibility,
        professorId: course.professorId,
        categoryId: course.categoryId,
      });
    }
  }, [course, form]);

  // 4. Define the mutation for updating the course
  const updateCourse = api.admin.course.update.useMutation({
    onSuccess: () => {
      showSnackbar("Course updated successfully!", "success");
      router.push(`/admin/courses/${courseId}`); // Navigate back to the detail page
      router.refresh(); // Refresh server components to show new data
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to update course", "error");
    },
  });

  // 5. Handle form submission
  function onSubmit(data: UpdateCourseFormInput) {
    updateCourse.mutate(data);
  }

  const isLoading = isLoadingCourse || isLoadingUsers || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  if (!course) {
     return (
       <div className="text-center">
        <h2 className="heading-2">Course Not Found</h2>
        <Button onClick={() => router.push("/admin/courses")} className="mt-4">
          Back to Courses
        </Button>
      </div>
     )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Course"
        description={`Editing "${course.title}"`}
      />

      <CourseForm
        form={form}
        onSubmit={onSubmit}
        isPending={updateCourse.isPending}
        professors={professors}
        categories={categories}
        submitButtonText="Save Changes"
      />
    </div>
  );
}