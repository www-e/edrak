"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSnackbar } from '@/components/shared/snackbar-context';
import { Loader2, Upload, File, X, Image, Video, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Attachment } from '@/types/admin';

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

  // File validation
  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxFileSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxFileSize}MB. Current size: ${formatFileSize(file.size)}`;
    }

    // Check file type
    const isAcceptedType = acceptedFileTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.type === type || file.name.toLowerCase().endsWith(type);
    });

    if (!isAcceptedType) {
      return `File type not supported. Please upload: ${getAcceptedTypesText()}`;
    }

    return null;
  };

  const getAcceptedTypesText = (): string => {
    const types = acceptedFileTypes.map(type => {
      if (type.includes('*')) return type.replace('*', '').toUpperCase();
      return type.split('/')[1]?.toUpperCase() || type;
    });
    return types.join(', ');
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (file.type.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />;
    if (file.type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        showSnackbar(error, 'error');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setValidationError(null);
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
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        showSnackbar(error, 'error');
        return;
      }

      setValidationError(null);
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
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          validationError
            ? 'border-destructive bg-destructive/5'
            : selectedFile
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary hover:bg-muted/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedFileTypes.join(',')}
        />

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
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              {getFileIcon(selectedFile)}
              <div className="text-left flex-1">
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
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
                  handleRemoveFile();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {previewUrl && (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  className="max-h-32 rounded-md object-contain border"
                  alt="File preview"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
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
        )}
      </div>

      {selectedFile && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Ready to upload to Bunny.net CDN
            </span>
            <span className="font-medium">
              {formatFileSize(selectedFile.size)}
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveFile}
              disabled={isUploading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
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
      )}
    </div>
  );
}