"use client";

import { useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileDrop: (file: File) => void;
  onError?: (error: string) => void;
  children: React.ReactNode;
  className?: string;
  accept?: string;
}

export function FileDropzone({
  onFileDrop,
  onError,
  children,
  className,
  accept
}: FileDropzoneProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileDrop(file);
    }
  }, [onFileDrop]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept || '';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileDrop(file);
      }
    };
    input.click();
  }, [accept, onFileDrop]);

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
        "hover:border-primary hover:bg-muted/50",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}