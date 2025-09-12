import BunnyCDNStorage from 'bunnycdn-storage-ts';
import { env } from '@/env';

// Initialize BunnyCDN Storage client
// We'll use a factory pattern to create instances when needed
// This avoids initialization issues during server startup
class BunnyCdnServiceSingleton {
  private static instance: BunnyCDNStorage | null = null;

  static getInstance(): BunnyCDNStorage {
    if (!this.instance) {
      // Use environment variables for configuration
      this.instance = new BunnyCDNStorage(
        env.BUNNY_CDN_API_KEY,
        env.BUNNY_CDN_STORAGE_ZONE,
        'de' // Frankfurt region as default, can be configured via env
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
  /**
   * Upload a file to Bunny.net CDN Storage
   * @param fileBuffer - The file buffer to upload
   * @param fileName - The name of the file
   * @param mimeType - The MIME type of the file
   * @param folderPath - Optional folder path within the storage zone
   * @returns Upload result with CDN path and URL
   */
  static async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folderPath?: string
  ): Promise<UploadResult> {
    try {
      // Generate a unique file name to avoid conflicts
      const uniqueFileName = `${Date.now()}-${fileName}`;
      
      // Construct the full path including folder structure
      const fullPath = folderPath ? `${folderPath}/${uniqueFileName}` : uniqueFileName;
      
      // Get BunnyCDN Storage client instance
      const bunnyCdn = BunnyCdnServiceSingleton.getInstance();
      
      // Upload the file to Bunny.net storage
      const uploadResponse = await bunnyCdn.upload(fileBuffer, fullPath);
      
      // Check if upload was successful
      if (uploadResponse.status !== 201) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }
      
      // Construct the public URL using the pull zone
      const publicUrl = `${env.BUNNY_CDN_PULL_ZONE_URL}/${fullPath}`;
      
      return {
        bunnyCdnPath: fullPath,
        bunnyCdnUrl: publicUrl,
        fileName: fileName,
        mimeType: mimeType,
        fileSize: fileBuffer.length,
      };
    } catch (error) {
      throw new Error(`Failed to upload file to Bunny.net: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete a file from Bunny.net CDN Storage
   * @param bunnyCdnPath - The path of the file to delete
   */
  static async deleteFile(bunnyCdnPath: string): Promise<void> {
    try {
      // Get BunnyCDN Storage client instance
      const bunnyCdn = BunnyCdnServiceSingleton.getInstance();
      
      // Delete the file from Bunny.net storage
      const deleteResponse = await bunnyCdn.delete(bunnyCdnPath);
      
      // Check if deletion was successful (200 OK or 404 Not Found are acceptable)
      if (deleteResponse.status !== 200 && deleteResponse.status !== 404) {
        throw new Error(`Delete failed with status ${deleteResponse.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to delete file from Bunny.net: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a folder structure for organizing course content
   * @param courseId - The ID of the course
   * @param lessonId - The ID of the lesson (optional)
   * @returns The folder path for the content
   */
  static createFolderPath(courseId: string, lessonId?: string): string {
    if (lessonId) {
      return `courses/${courseId}/lessons/${lessonId}`;
    }
    return `courses/${courseId}`;
  }
}