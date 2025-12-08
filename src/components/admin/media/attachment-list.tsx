"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { Download, Trash2, File, Video, FileText, Play, Eye } from "lucide-react";
import { Attachment } from "@/types/admin";
import { getFileIcon, formatFileSize } from "@/lib/file-utils";

// Smart content type detection for admin interface
type AttachmentType = 'VIDEO_PLAYER' | 'PDF_PREVIEW' | 'IMAGE_GALLERY' | 'DOCUMENT_PREVIEW' | 'DOWNLOAD_ONLY';

function getAttachmentType(attachment: Attachment): AttachmentType {
  const { mimeType, fileName } = attachment;

  if (mimeType.startsWith('video/')) {
    return 'VIDEO_PLAYER';
  } else if (mimeType.startsWith('image/')) {
    return 'IMAGE_GALLERY';
  } else if (mimeType === 'application/pdf') {
    return 'PDF_PREVIEW';
  } else if (mimeType.includes('document') ||
             fileName.match(/\.(doc|docx|ppt|pptx|txt|md)$/i)) {
    return 'DOCUMENT_PREVIEW';
  } else {
    return 'DOWNLOAD_ONLY';
  }
}

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
    <div className="space-y-3">
      {attachments.map((attachment) => {
        const attachmentType = getAttachmentType(attachment);
        const fileIcon = getFileIcon(attachment.mimeType);

        return (
          <div
            key={attachment.id}
            className="group p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Type-specific icon and styling */}
                {attachmentType === 'VIDEO_PLAYER' ? (
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Video className="w-5 h-5 text-purple-600" />
                  </div>
                ) : attachmentType === 'PDF_PREVIEW' ? (
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                ) : attachmentType === 'IMAGE_GALLERY' ? (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <File className="w-5 h-5 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {fileIcon}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{attachment.name}</p>
                    {/* Type badge */}
                    {attachmentType === 'VIDEO_PLAYER' && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                        <Play className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    )}
                    {attachmentType === 'PDF_PREVIEW' && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                        PDF
                      </Badge>
                    )}
                    {attachmentType === 'IMAGE_GALLERY' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        Image
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatFileSize(attachment.fileSize)}</span>
                    <span className="font-mono text-xs">{attachment.mimeType}</span>
                    <span>Uploaded {new Date(attachment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Preview button for viewable files */}
                {(attachmentType === 'PDF_PREVIEW' ||
                  attachmentType === 'IMAGE_GALLERY' ||
                  attachmentType === 'DOCUMENT_PREVIEW') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(attachment.bunnyCdnUrl, "_blank")}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                )}

                {/* Download button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(attachment.bunnyCdnUrl, "_blank")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>

                {/* Delete button - always visible */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(attachment.id)}
                  disabled={deletingId === attachment.id}
                  className="text-destructive hover:text-destructive"
                >
                  {deletingId === attachment.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Show video preview for video attachments */}
            {attachmentType === 'VIDEO_PLAYER' && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-2">Video Preview:</p>
                <div className="bg-black rounded-lg p-2">
                  <video
                    src={attachment.bunnyCdnUrl}
                    className="w-full h-32 object-contain rounded"
                    controls={false}
                    preload="metadata"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
