import BunnyCDNStorage from 'bunnycdn-storage-ts';
import { env } from '@/env';

class BunnyCdnServiceSingleton {
  private static instance: BunnyCDNStorage | null = null;

  static getInstance(): BunnyCDNStorage {
    if (!this.instance) {
      // Corrected to use BUNNY_API_KEY and a placeholder for storage zone name
      this.instance = new BunnyCDNStorage(
        env.BUNNY_API_KEY,
        "your-storage-zone-name-here", // Replace with your actual storage zone name
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
      const uniqueFileName = `${Date.now()}-${fileName}`;
      const fullPath = folderPath ? `${folderPath}/${uniqueFileName}` : uniqueFileName;
      const bunnyCdn = BunnyCdnServiceSingleton.getInstance();
      
      const uploadResponse = await bunnyCdn.upload(fileBuffer, fullPath);
      
      if (uploadResponse.status !== 201) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }
      
      // Corrected to use BUNNY_CDN_HOSTNAME
      const publicUrl = `https://${env.BUNNY_CDN_HOSTNAME}/${fullPath}`;
      
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
}