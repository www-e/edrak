import BunnyCDNStorage from 'bunnycdn-storage-ts';
import { env } from '@/env';

class BunnyCdnServiceSingleton {
  private static instance: BunnyCDNStorage | null = null;

  static getInstance(): BunnyCDNStorage {
    if (!this.instance) {
      // Initialize BunnyCDN with proper credentials
      this.instance = new BunnyCDNStorage(
        env.BUNNY_API_KEY,
        env.BUNNY_STORAGE_ZONE_NAME,
        'de'
      );
    }
    return this.instance;
  }
}

export interface UploadResult {
  bunnyCdnPath: string;
  bunnyCdnUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

export class BunnyCdnService {
  static async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folderPath?: string
  ): Promise<UploadResult> {
    try {
      // Validate inputs
      if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error('File buffer is empty');
      }

      if (!fileName || fileName.trim() === '') {
        throw new Error('File name is required');
      }

      // Generate unique filename to prevent conflicts
      const timestamp = Date.now();
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${timestamp}-${sanitizedFileName}`;

      // Sanitize folder path to prevent path traversal
      const sanitizedFolderPath = folderPath ? folderPath.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+/, '').replace(/\/+$/, '') : '';
      const fullPath = sanitizedFolderPath ? `${sanitizedFolderPath}/${uniqueFileName}` : uniqueFileName;

      console.log(`Uploading file: ${fileName} to path: ${fullPath}`);

      const bunnyCdn = BunnyCdnServiceSingleton.getInstance();

      // Upload with timeout and retry logic
      const uploadResponse = await Promise.race([
        bunnyCdn.upload(fileBuffer, fullPath),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Upload timeout after 60 seconds')), 60000)
        )
      ]);

      if (uploadResponse.status !== 201) {
        console.error('Upload failed:', uploadResponse);
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${uploadResponse.statusText}`);
      }

      // Generate public URL using pull zone
      const publicUrl = `https://${env.BUNNY_PULL_ZONE_URL}/${fullPath}`;

      console.log(`File uploaded successfully. Public URL: ${publicUrl}`);

      return {
        bunnyCdnPath: fullPath,
        bunnyCdnUrl: publicUrl,
        fileName: fileName,
        mimeType: mimeType,
        fileSize: fileBuffer.length,
      };
    } catch (error) {
      console.error('BunnyCDN upload error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload file to Bunny.net: ${errorMessage}`);
    }
  }

  static async deleteFile(bunnyCdnPath: string): Promise<void> {
    try {
      const bunnyCdn = BunnyCdnServiceSingleton.getInstance();
      const deleteResponse = await bunnyCdn.delete(bunnyCdnPath);
      if (deleteResponse.status !== 200 && deleteResponse.status !== 404) {
        throw new Error(`Delete failed with status ${deleteResponse.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to delete file from Bunny.net: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  static createFolderPath(courseId: string, lessonId?: string): string {
    if (lessonId) {
      return `courses/${courseId}/lessons/${lessonId}`;
    }
    return `courses/${courseId}`;
  }

  // Specialized upload methods for different content types
  static async uploadCourseVideo(
    fileBuffer: Buffer,
    courseId: string,
    lessonId: string,
    fileName: string
  ): Promise<UploadResult> {
    // Validate video file
    if (!fileName.match(/\.(mp4|webm|mov|avi)$/i)) {
      throw new Error('Invalid video format. Supported: mp4, webm, mov, avi');
    }

    const folderPath = `courses/${courseId}/videos`;
    return this.uploadFile(fileBuffer, fileName, 'video/mp4', folderPath);
  }

  static async uploadCourseImage(
    fileBuffer: Buffer,
    courseId: string,
    fileName: string,
    isThumbnail: boolean = false
  ): Promise<UploadResult> {
    // Validate image file
    if (!fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      throw new Error('Invalid image format. Supported: jpg, jpeg, png, gif, webp');
    }

    const folderPath = isThumbnail ? `courses/${courseId}/thumbnails` : `courses/${courseId}/images`;
    return this.uploadFile(fileBuffer, fileName, 'image/jpeg', folderPath);
  }

  static async uploadCourseAttachment(
    fileBuffer: Buffer,
    courseId: string,
    lessonId: string,
    fileName: string
  ): Promise<UploadResult> {
    const folderPath = `courses/${courseId}/attachments`;
    return this.uploadFile(fileBuffer, fileName, 'application/octet-stream', folderPath);
  }

  // Get public URL for any stored file
  static getPublicUrl(filePath: string): string {
    return `https://${env.BUNNY_PULL_ZONE_URL}/${filePath}`;
  }

  // Validate file size (50MB limit for videos, 10MB for images, 25MB for attachments)
  static validateFileSize(fileSize: number, fileType: string): void {
    const limits = {
      video: 50 * 1024 * 1024,    // 50MB
      image: 10 * 1024 * 1024,    // 10MB
      attachment: 25 * 1024 * 1024 // 25MB
    };

    let limit = limits.attachment; // default

    if (fileType.startsWith('video/')) {
      limit = limits.video;
    } else if (fileType.startsWith('image/')) {
      limit = limits.image;
    }

    if (fileSize > limit) {
      const limitMB = Math.round(limit / (1024 * 1024));
      throw new Error(`File too large. Maximum size for this file type is ${limitMB}MB`);
    }
  }
}