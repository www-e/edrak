"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/shared/page-header";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { api } from "@/trpc/react";
import { FileUpload } from "@/components/admin/media/file-upload";
import { AttachmentList } from "@/components/admin/media/attachment-list";

interface Attachment {
  id: string;
  name: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  bunnyCdnPath: string;
  bunnyCdnUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DbAttachment {
  id: string;
  name: string;
  lessonId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  bunnyCdnPath: string;
  bunnyCdnUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function LessonDetailPage({ 
  courseId,
  lessonId 
}: { 
  courseId: string;
  lessonId: string;
}) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Fetch lesson data and attachments
  const { data: lesson, isLoading } = api.admin.course.getLesson.useQuery({ id: lessonId });
  
  // Fetch attachments for this lesson
  const { data: attachmentData } = api.admin.course.getLessonAttachments.useQuery({ lessonId });

  useEffect(() => {
    if (attachmentData) {
      // Map the database attachment data to our Attachment interface
      const mappedAttachments = attachmentData.map((att) => ({
        id: att.id,
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

  const handleAttachmentUpload = (attachment: Attachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleAttachmentDelete = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lesson.title}
        description={`Lesson in course ${courseId}`}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/admin/courses/${courseId}/lessons/${lessonId}/edit`)}
            >
              Edit Lesson
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Back to Course
            </Button>
          </div>
        }
      />
      
      <div className="prose max-w-none dark:prose-invert">
        <div 
          dangerouslySetInnerHTML={{ __html: lesson.content }} 
          className="rounded-lg border p-4"
        />
      </div>
      
      {lesson.videoUrl && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Video Content</h3>
          <div className="aspect-video rounded-lg border bg-muted">
            <video 
              src={lesson.videoUrl} 
              controls 
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Attachments</h3>
          <span className="text-sm text-muted-foreground">
            {attachments.length} file(s)
          </span>
        </div>
        
        <FileUpload
          courseId={courseId}
          lessonId={lessonId}
          onUploadComplete={handleAttachmentUpload}
        />
        
        <AttachmentList
          attachments={attachments}
          courseId={courseId}
          lessonId={lessonId}
          onAttachmentDelete={handleAttachmentDelete}
        />
      </div>
    </div>
  );
}