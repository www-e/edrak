"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/shared/page-header";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { api } from "@/trpc/react";
import { z } from "zod";

const createLessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  order: z.number().int().min(1, "Order must be at least 1"),
  isVisible: z.boolean().default(true),
  youtubeUrl: z.string().url().optional().refine((url) => {
    if (!url) return true;
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/.test(url);
  }, "Must be a valid YouTube URL"),
});

type CreateLessonInput = z.infer<typeof createLessonSchema>;

export default function CreateLessonPage() {
  const params = useParams();
  const courseId = params.id as string;
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<CreateLessonInput>({
    title: "",
    content: "",
    order: 1,
    isVisible: true,
    youtubeUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      });
    }
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
            <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
            <Input
              id="youtubeUrl"
              value={formData.youtubeUrl || ""}
              onChange={(e) => handleChange("youtubeUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
              className={errors.youtubeUrl ? "border-destructive" : ""}
            />
            {errors.youtubeUrl && (
              <p className="text-sm text-destructive">{errors.youtubeUrl}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Optional: Add a YouTube video for this lesson. Leave empty to upload video files later.
            </p>
          </div>
          
          
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> After creating this lesson, you can upload attachments (videos, images, documents) from the lesson edit page.
            </p>
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
        </div>
      </form>
    </div>
  );
}