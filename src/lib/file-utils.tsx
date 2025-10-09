import { Image, Video, FileText, File } from 'lucide-react';

/**
 * Shared file utilities for consistent file handling across components
 */

/**
 * File type detection and icon mapping
 */
export function getFileIcon(mimeType: string, className = "h-5 w-5") {
  if (mimeType.startsWith('image/')) {
    return <Image className={`${className} text-blue-500`} aria-hidden="true" />;
  }
  if (mimeType.startsWith('video/')) {
    return <Video className={`${className} text-purple-500`} aria-hidden="true" />;
  }
  if (mimeType.includes('pdf') || mimeType.includes('document')) {
    return <FileText className={`${className} text-red-500`} aria-hidden="true" />;
  }
  return <File className={`${className} text-gray-500`} aria-hidden="true" />;
}

/**
 * File size formatting utility
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * File type validation
 */
export function validateFile(file: File, options: {
  maxSize?: number;
  acceptedTypes?: string[];
}): { isValid: boolean; error?: string } {
  const { maxSize = 3072, acceptedTypes = [] } = options;

  // Check file size
  const maxSizeBytes = maxSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSize}MB. Current size: ${formatFileSize(file.size)}`
    };
  }

  // Check file type
  if (acceptedTypes.length > 0) {
    const isAcceptedType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.type === type || file.name.toLowerCase().endsWith(type);
    });

    if (!isAcceptedType) {
      return {
        isValid: false,
        error: `File type not supported. Please upload: ${getAcceptedTypesText(acceptedTypes)}`
      };
    }
  }

  return { isValid: true };
}

/**
 * Get human-readable accepted types text
 */
export function getAcceptedTypesText(acceptedTypes: string[]): string {
  return acceptedTypes.map(type => {
    if (type.includes('*')) return type.replace('*', '').toUpperCase();
    return type.split('/')[1]?.toUpperCase() || type;
  }).join(', ');
}

/**
 * Generate preview URL for images
 */
export function createPreviewUrl(file: File): string | null {
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  }
  return null;
}

/**
 * Clean up preview URL to prevent memory leaks
 */
export function cleanupPreviewUrl(url: string | null): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}