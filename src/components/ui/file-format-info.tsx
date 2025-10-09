"use client";

import { Video, Image, FileText } from 'lucide-react';

interface FileFormatInfoProps {
  maxFileSize?: number;
}

export function FileFormatInfo({ maxFileSize = 3072 }: FileFormatInfoProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="font-medium">Drag and drop your course files here</p>
        <p className="text-sm text-muted-foreground">
          or click to browse and select files
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Supported formats:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
            <Video className="h-3 w-3" />
            Videos (MP4, WebM) - up to 3GB
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
            <Image className="h-3 w-3" />
            Images (JPG, PNG)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
            <FileText className="h-3 w-3" />
            Documents (PDF, DOC)
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Maximum file size: {maxFileSize >= 1024 ? `${Math.round(maxFileSize / 1024)}GB` : `${maxFileSize}MB`}
      </p>
    </div>
  );
}