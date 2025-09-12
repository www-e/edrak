"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSnackbar } from '@/components/shared/snackbar-context';
import { Loader2, Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  courseId: string;
  lessonId?: string;
  onUploadComplete?: (attachment: Attachment) => void;
  onUploadError?: (error: string) => void;
}

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

export function FileUpload({ 
  courseId, 
  lessonId, 
  onUploadComplete, 
  onUploadError 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSnackbar } = useSnackbar();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showSnackbar('Please select a file to upload', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('courseId', courseId);
      if (lessonId) {
        formData.append('lessonId', lessonId);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      showSnackbar('File uploaded successfully!', 'success');
      onUploadComplete?.(result.attachment as Attachment);
      handleRemoveFile();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      showSnackbar(errorMessage, 'error');
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="*/*"
        />
        
        {selectedFile ? (
          <div className="space-y-4">
            {previewUrl ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img 
                  src={previewUrl} 
                  className="max-h-40 rounded-md object-contain"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <File className="h-8 w-8 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">Drag and drop files here</p>
              <p className="text-sm text-muted-foreground">
                or click to select files
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports all file types
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleRemoveFile}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}