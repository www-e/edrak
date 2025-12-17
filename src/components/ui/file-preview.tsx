"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';
import { getFileIcon, formatFileSize, cleanupPreviewUrl } from '@/lib/file-utils';

interface FilePreviewProps {
  file: File;
  previewUrl: string | null;
  onRemove: () => void;
  className?: string;
}

export function FilePreview({ file, previewUrl, onRemove, className }: FilePreviewProps) {
  useEffect(() => {
    return () => {
      if (previewUrl) {
        cleanupPreviewUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-center gap-3">
        {getFileIcon(file.type, "h-8 w-8")}
        <div className="text-left flex-1">
          <p className="font-medium text-sm">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600">Ready to upload</span>
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {previewUrl && (
        <div className="relative inline-block">
          {/* For dynamic blob URLs like image previews, using regular img is appropriate */}
          <img
            src={previewUrl}
            className="max-h-32 rounded-md object-contain border"
            alt="File preview"
          />
        </div>
      )}
    </div>
  );
}