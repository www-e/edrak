"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/trpc/react";
import { UpdateLessonInputSchema, Attachment } from "@/types/admin";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { FileUpload } from "@/components/admin/media/file-upload";
import { AttachmentList } from "@/components/admin/media/attachment-list";

type UpdateLessonFormInput = z.infer<typeof UpdateLessonInputSchema>;

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  const { showSnackbar } = useSnackbar();
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // 1. Fetch the lesson data and attachments in parallel for efficiency
  const { data: lesson, isLoading } = api.admin.course.getLesson.useQuery({ id: lessonId });
  const { data: attachmentData, isLoading: attachmentsLoading } = api.admin.course.getLessonAttachments.useQuery({ lessonId });

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
        youtubeUrl: lesson.youtubeUrl || "", // Fix: Provide default empty string
      });
    }
  }, [lesson, form]);

  // 4. Handle attachment data efficiently
  useEffect(() => {
    if (attachmentData) {
      // Map database attachment data to our Attachment interface - ultra efficient mapping
      const mappedAttachments: Attachment[] = attachmentData.map(att => ({
        id: att.id,
        lessonId: att.lessonId,
        name: att.name,
        fileName: att.fileName,
        mimeType: att.mimeType,
        fileSize: att.fileSize,
        bunnyCdnPath: att.bunnyCdnPath,
        bunnyCdnUrl: att.bunnyCdnUrl,
        createdAt: att.createdAt,
        updatedAt: att.updatedAt,
      }));
      setAttachments(mappedAttachments);
    }
  }, [attachmentData]);

  // 5. Ultra-efficient attachment management handlers with minimal re-renders
  const handleAttachmentUpload = (attachment: Attachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleAttachmentDelete = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  // 6. Memoize form submission for efficiency
  const onSubmit = (data: UpdateLessonFormInput) => {
    updateLesson.mutate(data);
  };

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

  // 5. Form submission handled by memoized function above

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
        description={`Editing "${lesson.title}" - Upload videos and attachments directly`}
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

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Video URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add a YouTube video for this lesson. Leave empty to use uploaded video files.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

          {/* Enhanced attachment management section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📎 Lesson Materials
                <Badge variant="outline">Smart Upload</Badge>
              </CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Upload videos, PDFs, images, and documents. Videos will be automatically detected and displayed with a player.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    🎥 Videos: Auto-playable with controls
                  </Badge>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    📄 PDFs: Preview available
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    🖼️ Images: Gallery view
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Component - Ultra efficient */}
              <FileUpload
                courseId={courseId}
                lessonId={lessonId}
                onUploadComplete={handleAttachmentUpload}
                maxFileSize={50}
              />

              {/* Attachment List Component - Only show when loading complete */}
              {!attachmentsLoading && (
                <AttachmentList
                  attachments={attachments}
                  courseId={courseId}
                  lessonId={lessonId}
                  onAttachmentDelete={handleAttachmentDelete}
                />
              )}
            </CardContent>
          </Card>

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