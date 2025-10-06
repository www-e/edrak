"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/shared/page-header";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { api } from "@/trpc/react";
import { z } from "zod";
import { FileUpload } from "@/components/admin/media/file-upload";
import { AttachmentList } from "@/components/admin/media/attachment-list";
import { Attachment } from "@/types/admin";

const createLessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  order: z.number().int().min(1, "Order must be at least 1"),
  isVisible: z.boolean().default(true),
  videoUrl: z.string().url().nullable().optional(),
});

type CreateLessonInput = z.infer<typeof createLessonSchema>;


export default function CreateLessonPage({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<CreateLessonInput>({
    title: "",
    content: "",
    order: 1,
    isVisible: true,
    videoUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const createLesson = api.admin.course.createLesson.useMutation({
    onSuccess: () => {
      showSnackbar("Lesson created successfully!", "success");
      router.push(`/admin/courses/${courseId}`);
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to create lesson", "error");
    }
  });

  const handleChange = (field: keyof CreateLessonInput, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      createLessonSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      createLesson.mutate({
        ...formData,
        courseId,
        videoUrl: formData.videoUrl || null,
      });
    }
  };

  const handleAttachmentUpload = (attachment: Attachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleAttachmentDelete = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Lesson"
        description="Add a new lesson to the course"
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        }
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter lesson title"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order">Order *</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => handleChange("order", parseInt(e.target.value, 10) || 1)}
              className={errors.order ? "border-destructive" : ""}
            />
            {errors.order && (
              <p className="text-sm text-destructive">{errors.order}</p>
            )}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Enter lesson content"
              rows={6}
              className={errors.content ? "border-destructive" : ""}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="videoUrl">Video URL (Optional)</Label>
            <Input
              id="videoUrl"
              type="url"
              value={formData.videoUrl || ""}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
              placeholder="https://example.com/video.mp4"
              className={errors.videoUrl ? "border-destructive" : ""}
            />
            {errors.videoUrl && (
              <p className="text-sm text-destructive">{errors.videoUrl}</p>
            )}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label>Attachments</Label>
              <span className="text-sm text-muted-foreground">
                {attachments.length} file(s) uploaded
              </span>
            </div>
            
            <FileUpload
              courseId={courseId}
              onUploadComplete={handleAttachmentUpload}
            />
            
            {attachments.length > 0 && (
              <div className="mt-4">
                <AttachmentList
                  attachments={attachments}
                  courseId={courseId}
                  onAttachmentDelete={handleAttachmentDelete}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createLesson.isPending}
          >
            {createLesson.isPending ? "Creating..." : "Create Lesson"}
          </Button>
        </div>
      </form>
    </div>
  );
}