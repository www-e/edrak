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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { Role } from "@prisma/client";

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

  const professors = users?.filter(user => user.role === Role.PROFESSOR) ?? [];

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
        professorId: course.professor.id,
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Left Column - Main Details */}
            <div className="md:col-span-2 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title *</FormLabel>
                    <FormControl><Input placeholder="e.g., Introduction to Web Development" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Slug *</FormLabel>
                    <FormControl><Input placeholder="e.g., intro-to-web-dev" {...field} /></FormControl>
                    <FormDescription>This is the URL-friendly version of the title.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl><Textarea placeholder="Describe the course content and objectives." {...field} rows={8} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column - Metadata */}
            <div className="md:col-span-1 space-y-6">
              <FormField
                control={form.control}
                name="professorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a professor" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {professors.map(prof => (
                          <SelectItem key={prof.id} value={prof.id}>
                            {prof.firstName} {prof.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (EGP) *</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={updateCourse.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateCourse.isPending}>
              {updateCourse.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}