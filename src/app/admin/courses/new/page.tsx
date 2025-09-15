"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/trpc/react";
import { CreateCourseInputSchema } from "@/types/admin";
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

type CreateCourseFormInput = z.infer<typeof CreateCourseInputSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  // 1. Fetch data for dropdowns
  const { data: users, isLoading: isLoadingUsers } = api.admin.user.getAll.useQuery();
  const { data: categories, isLoading: isLoadingCategories } = api.admin.category.getAll.useQuery();

  const professors = users?.filter(user => user.role === Role.PROFESSOR) ?? [];

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
                      <FormControl>
                        <Input placeholder="e.g., Introduction to Web Development" {...field} onChange={handleTitleChange} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="e.g., intro-to-web-dev" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Textarea placeholder="Describe the course content and objectives." {...field} rows={8} />
                      </FormControl>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a professor" />
                          </SelectTrigger>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (EGP) *</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
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
                      <FormControl>
                         <Input {...field} />
                      </FormControl>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
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
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={createCourse.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCourse.isPending}>
                {createCourse.isPending ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}