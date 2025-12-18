import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, File, Download, FileText, Image } from "lucide-react";
import { YouTubePlayerWithNotes } from "@/components/ui/youtube-player-with-notes";
import { VideoPlayerWithNotes } from "@/components/ui/video-player-with-notes";
import { getFileIcon, formatFileSize } from "@/lib/file-utils";

interface VideoDisplayProps {
  lessonTitle: string;
  youtubeUrl?: string | null;
  attachments: Array<{
    id: string;
    name: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    bunnyCdnUrl: string;
    createdAt: string;
  }>;
  onAddNote: () => void;
  onSendMessage: () => void;
}

// Smart content type detection
type AttachmentType = 'VIDEO_PLAYER' | 'PDF_PREVIEW' | 'IMAGE_GALLERY' | 'DOCUMENT_PREVIEW' | 'DOWNLOAD_ONLY';

function getAttachmentType(attachment: VideoDisplayProps['attachments'][0]): AttachmentType {
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

export function VideoDisplay({ lessonTitle, youtubeUrl, attachments, onAddNote, onSendMessage }: VideoDisplayProps) {
  // Check for YouTube URL first (zero bandwidth)
  if (youtubeUrl) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              <Play className="w-3 h-3 mr-1" />
              YouTube Video
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Zero Bandwidth Cost
            </Badge>
          </div>
          <YouTubePlayerWithNotes
            url={youtubeUrl}
            title={lessonTitle}
            onAddNote={onAddNote}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    );
  }

  // Fall back to Bunny CDN video attachment
  const mainVideoAttachment = attachments.find(att => att.mimeType.startsWith('video/'));

  if (mainVideoAttachment) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Play className="w-3 h-3 mr-1" />
              Main Lesson Video
            </Badge>
            <Badge variant="outline">
              {formatFileSize(mainVideoAttachment.fileSize)}
            </Badge>
          </div>
          <VideoPlayerWithNotes
            src={mainVideoAttachment.bunnyCdnUrl}
            title={`${lessonTitle} - ${mainVideoAttachment.name}`}
            onAddNote={onAddNote}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    );
  }

  // Fallback: Show placeholder if no video found
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <File className="w-3 h-3 mr-1" />
            No Video Available
          </Badge>
        </div>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-semibold mb-2">No Video Available</p>
          <p className="text-sm text-muted-foreground">
            This lesson does not have a video yet. Upload a video file to get started.
          </p>
        </div>
      </div>
    </div>
  );
}

interface AttachmentListProps {
  attachments: VideoDisplayProps['attachments'];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  // Filter out video attachments since they're displayed in the main video section
  const nonVideoAttachments = attachments.filter(att => !att.mimeType.startsWith('video/'));

  if (nonVideoAttachments.length === 0) {
    return null; // Don't show the section if no non-video attachments
  }

  return (
    <div className="space-y-4">
      {nonVideoAttachments.map((attachment) => {
        const attachmentType = getAttachmentType(attachment);
        const fileIcon = getFileIcon(attachment.mimeType);
        const formattedSize = formatFileSize(attachment.fileSize);

        return (
          <div key={attachment.id} className="group">
            {attachmentType === 'PDF_PREVIEW' ? (
              // PDF attachments - Show preview option
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-red-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{attachment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      📄 PDF Document • {formattedSize}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : attachmentType === 'IMAGE_GALLERY' ? (
              // Image attachments - Show thumbnail with preview
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Image className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{attachment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      🖼️ Image • {formattedSize}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              // Generic files - Show download only
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {fileIcon}
                  </div>
                  <div>
                    <p className="font-medium">{attachment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      📎 {attachment.mimeType} • {formattedSize}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}