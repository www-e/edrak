"use client";

import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

interface FileUploadStatusProps {
  isUploading: boolean;
  fileName: string;
  fileSize: number;
  onCancel: () => void;
  onUpload: () => void;
  formatFileSize: (bytes: number) => string;
}

export function FileUploadStatus({
  isUploading,
  fileName,
  fileSize,
  onCancel,
  onUpload,
  formatFileSize
}: FileUploadStatusProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {fileName} • Ready to upload to Bunny.net CDN
        </span>
        <span className="font-medium">
          {formatFileSize(fileSize)}
        </span>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onUpload}
          disabled={isUploading}
          className="px-6"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading to CDN...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload to Bunny.net
            </>
          )}
        </Button>
      </div>
    </div>
  );
}