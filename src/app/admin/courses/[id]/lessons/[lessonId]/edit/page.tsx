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
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { Play, Monitor, Upload } from "lucide-react";

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

          {/* Video Management Section - Enhanced UX */}
          <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Lesson Video Management
                <Badge variant="outline" className="ml-auto">
                  {lesson.youtubeUrl ? "YouTube Video" : "File Upload"}
                </Badge>
              </CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Choose how to provide video content for this lesson. You can use YouTube for zero-cost hosting or upload video files.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✅ YouTube: Zero bandwidth cost
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    📁 File Upload: Full control
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Video Display */}
              {lesson.youtubeUrl && (
                <div className="space-y-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800 dark:text-red-200">Current YouTube Video</span>
                  </div>
                  <YouTubePlayer
                    url={lesson.youtubeUrl}
                    title={`Preview: ${lesson.title}`}
                    className="max-w-md"
                  />
                </div>
              )}

              {/* Video Source Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* YouTube Option */}
                <div className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                  lesson.youtubeUrl ? 'border-red-300 bg-red-50 dark:bg-red-950/20' : 'border-border hover:border-primary/50'
                }`}>
                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                          <Play className="w-4 h-4 text-red-600" />
                          YouTube Video
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                            value={field.value || ""}
                            onChange={field.onChange}
                            className="h-10"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Paste any YouTube URL. Videos load instantly with zero bandwidth cost.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Upload Option */}
                <div className={`p-4 border-2 rounded-lg transition-all ${
                  !lesson.youtubeUrl && attachments.some(att => att.mimeType.startsWith('video/'))
                    ? 'border-purple-300 bg-purple-50 dark:bg-purple-950/20'
                    : 'border-border hover:border-primary/50'
                }`}>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-base font-semibold cursor-pointer">
                      <Upload className="w-4 h-4 text-purple-600" />
                      Video File Upload
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Upload MP4, WebM, or other video formats. Stored on Bunny CDN.
                    </p>
                    {attachments.filter(att => att.mimeType.startsWith('video/')).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-green-700 dark:text-green-300">
                          ✓ {attachments.filter(att => att.mimeType.startsWith('video/')).length} video(s) uploaded
                        </p>
                        {attachments.filter(att => att.mimeType.startsWith('video/')).map(att => (
                          <div key={att.id} className="text-xs text-muted-foreground truncate">
                            📹 {att.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Preview */}
              {lesson.youtubeUrl && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Video Preview
                  </h4>
                  <YouTubePlayer
                    url={lesson.youtubeUrl}
                    title={lesson.title}
                    className="w-full max-w-lg"
                  />
                </div>
              )}
            </CardContent>
          </Card>

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