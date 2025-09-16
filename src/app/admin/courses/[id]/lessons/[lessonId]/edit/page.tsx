"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/trpc/react";
import { UpdateLessonInputSchema } from "@/types/admin";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSnackbar } from "@/components/shared/snackbar-context";

type UpdateLessonFormInput = z.infer<typeof UpdateLessonInputSchema>;

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  const { showSnackbar } = useSnackbar();

  // 1. Fetch the lesson data
  const { data: lesson, isLoading } = api.admin.course.getLesson.useQuery({ id: lessonId });

  // 2. Initialize the form
  const form = useForm<UpdateLessonFormInput>({
    resolver: zodResolver(UpdateLessonInputSchema),
  });

  // 3. Populate the form once the lesson data is fetched
  useEffect(() => {
    if (lesson) {
      form.reset({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        content: lesson.content,
        isVisible: lesson.isVisible,
        videoUrl: lesson.videoUrl,
      });
    }
  }, [lesson, form]);

  // 4. Define the mutation for updating the lesson
  const updateLesson = api.admin.course.updateLesson.useMutation({
    onSuccess: () => {
      showSnackbar("Lesson updated successfully!", "success");
      router.push(`/admin/courses/${courseId}`); // Navigate back to the course detail page
      router.refresh(); 
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to update lesson", "error");
    },
  });

  // 5. Handle form submission
  function onSubmit(data: UpdateLessonFormInput) {
    updateLesson.mutate(data);
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  if (!lesson) {
     return (
       <div className="text-center">
        <h2 className="heading-2">Lesson Not Found</h2>
        <Button onClick={() => router.back()} className="mt-4">
          Back
        </Button>
      </div>
     )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Lesson"
        description={`Editing "${lesson.title}"`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl><Input placeholder="Enter lesson title" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order *</FormLabel>
                  <FormControl><Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl><Textarea placeholder="Enter lesson content" {...field} rows={10} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (Optional)</FormLabel>
                    <FormControl><Input type="url" placeholder="https://example.com/video.mp4" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === 'true')} value={String(field.value)}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Visible</SelectItem>
                      <SelectItem value="false">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={updateLesson.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateLesson.isPending}>
              {updateLesson.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}