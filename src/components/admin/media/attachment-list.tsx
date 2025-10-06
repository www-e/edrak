"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { File, Download, Trash2, Video, FileText, Image } from "lucide-react";
import { Attachment } from "@/types/admin";


interface AttachmentListProps {
  attachments: Attachment[];
  courseId: string;
  lessonId?: string;
  onAttachmentDelete?: (attachmentId: string) => void;
}

export function AttachmentList({
  attachments,
  onAttachmentDelete,
}: AttachmentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar();

  const handleDelete = async (attachmentId: string) => {
    setDeletingId(attachmentId);

    try {
      const response = await fetch(`/api/upload?id=${attachmentId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Delete failed");
      }

      showSnackbar("Attachment deleted successfully", "success");
      onAttachmentDelete?.(attachmentId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete attachment";
      showSnackbar(errorMessage, "error");
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <Image className="h-5 w-5 text-primary" aria-hidden="true" />;
    }
    if (mimeType.startsWith("video/")) {
      return <Video className="h-5 w-5 text-primary" aria-hidden="true" />;
    }
    if (mimeType.includes("pdf") || mimeType.includes("document")) {
      return <FileText className="h-5 w-5 text-primary" aria-hidden="true" />;
    }
    return <File className="h-5 w-5 text-primary" aria-hidden="true" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <File className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
        <h3 className="mt-4 font-medium">No attachments</h3>
        <p className="text-sm text-muted-foreground">
          Upload files to add attachments to this lesson
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {getFileIcon(attachment.mimeType)}
            <div>
              <p className="font-medium">{attachment.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(attachment.fileSize)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(attachment.bunnyCdnUrl, "_blank")}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(attachment.id)}
              disabled={deletingId === attachment.id}
            >
              {deletingId === attachment.id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true"></div>
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
