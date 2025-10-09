"use client";

import { useState, useRef } from 'react';
import { useSnackbar } from '@/components/shared/snackbar-context';
import { AlertCircle } from 'lucide-react';
import { Attachment } from '@/types/admin';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FilePreview } from '@/components/ui/file-preview';
import { FileUploadStatus } from '@/components/ui/file-upload-status';
import { FileFormatInfo } from '@/components/ui/file-format-info';
import { validateFile, createPreviewUrl, cleanupPreviewUrl} from '@/lib/file-utils';

interface FileUploadProps {
  courseId: string;
  lessonId?: string;
  onUploadComplete?: (attachment: Attachment) => void;
  onUploadError?: (error: string) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
}

export function FileUpload({
  courseId,
  lessonId,
  onUploadComplete,
  onUploadError,
  acceptedFileTypes = ['video/*', 'image/*', 'application/pdf', '.doc', '.docx', '.ppt', '.pptx'],
  maxFileSize = 3072 // 3GB for large video files
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSnackbar } = useSnackbar();

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file, { maxSize: maxFileSize, acceptedTypes: acceptedFileTypes });

    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid file');
      showSnackbar(validation.error || 'Invalid file', 'error');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setValidationError(null);
    setSelectedFile(file);

    // Create preview for images
    const url = createPreviewUrl(file);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    cleanupPreviewUrl(previewUrl);
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

      showSnackbar(`✅ ${selectedFile.name} uploaded successfully to Bunny.net CDN!`, 'success');

      // Show file URL for reference
      if (result.attachment.bunnyCdnUrl) {
        console.log('File available at:', result.attachment.bunnyCdnUrl);
        // You could also show a copy URL button here
      }

      onUploadComplete?.(result.attachment as Attachment);
      handleRemoveFile();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      console.error('Upload error:', error);

      // Provide more user-friendly error messages
      let userFriendlyMessage = errorMessage;

      if (errorMessage.includes('File too large')) {
        userFriendlyMessage = `File is too large. Please choose a file smaller than ${maxFileSize}MB.`;
      } else if (errorMessage.includes('Invalid video format')) {
        userFriendlyMessage = 'Please upload a valid video file (MP4, WebM, MOV, or AVI).';
      } else if (errorMessage.includes('Invalid image format')) {
        userFriendlyMessage = 'Please upload a valid image file (JPG, PNG, GIF, or WebP).';
      } else if (errorMessage.includes('Upload timeout')) {
        userFriendlyMessage = 'Upload is taking too long. Please try again with a smaller file.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        userFriendlyMessage = 'Network error. Please check your connection and try again.';
      }

      showSnackbar(`❌ ${userFriendlyMessage}`, 'error');
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
      <FileDropzone
        onFileDrop={handleFileSelect}
        onError={(error) => {
          setValidationError(error);
          showSnackbar(error, 'error');
        }}
        accept={acceptedFileTypes.join(',')}
        className={
          validationError
            ? 'border-destructive bg-destructive/5'
            : selectedFile
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary hover:bg-muted/50'
        }
      >
        {validationError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Upload Error</span>
            </div>
            <p className="text-sm text-destructive mt-1">{validationError}</p>
          </div>
        )}

        {selectedFile ? (
          <FilePreview
            file={selectedFile}
            previewUrl={previewUrl}
            onRemove={handleRemoveFile}
          />
        ) : (
          <FileFormatInfo maxFileSize={maxFileSize} />
        )}
      </FileDropzone>

      {selectedFile && (
        <FileUploadStatus
          isUploading={isUploading}
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          onCancel={handleRemoveFile}
          onUpload={handleUpload}
          formatFileSize={formatFileSize}
        />
      )}
    </div>
  );
}