import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { BunnyCdnService, UploadResult } from '@/lib/bunny-cdn';
import { db } from '@/server/db';
import { SessionUser } from '@/types/auth';

// Simple in-memory rate limiting (resets on server restart)
const uploadCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // uploads per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = uploadCounts.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or initialize
    uploadCounts.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

/**
 * Handles authentication and authorization for the API route using the
 * recommended App Router pattern for next-auth.
 * @returns A user session if authorized, or a NextResponse object if not.
 */
async function handleAuth() {
  // This is the correct, type-safe way to get the session in an App Router Route Handler.
  // It automatically reads the request's headers and cookies.
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if ((session.user as SessionUser).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return { user: session.user };
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await handleAuth();
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if auth failed
    }

    const userId = (authResult.user as SessionUser).id;

    // Check rate limiting
    if (!checkRateLimit(userId || 'anonymous')) {
      return NextResponse.json({
        error: 'Rate limit exceeded. Maximum 10 uploads per minute allowed.'
      }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const courseId = formData.get('courseId') as string | null;
    const lessonId = formData.get('lessonId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Ultra-efficient: Allow uploads without lessonId for maximum flexibility
    // This enables uploads during lesson creation and editing workflows
    // lessonId is still preferred but not mandatory for better UX

    // Validate file size and type in one place - Support for large video files
    const maxSize = 3 * 1024 * 1024 * 1024; // 3GB for large video files
    if (file.size > maxSize) {
      return NextResponse.json({
        error: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024 * 1024))}GB`
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'video/mp4', 'video/webm', 'video/quicktime', 'video/avi',
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Allowed: videos (mp4, webm, mov, avi), images (jpg, png, gif, webp), documents (pdf, doc, docx)'
      }, { status: 400 });
    }

    // Ultra-efficient: Only validate lesson if lessonId is provided
    if (lessonId) {
      const lesson = await db.lesson.findUnique({ where: { id: lessonId, courseId: courseId } });
      if (!lesson) {
        return NextResponse.json({ error: 'Lesson not found or does not belong to the specified course' }, { status: 404 });
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use service validation (single point of validation)
    BunnyCdnService.validateFileSize(buffer.length, file.type);

    // Add timeout wrapper for entire upload operation
    const uploadPromise = (async () => {
      let uploadResult: UploadResult;

      // Use appropriate upload method based on file type - ultra efficient routing
      if (file.type.startsWith('video/')) {
        uploadResult = await BunnyCdnService.uploadCourseVideo(
          buffer,
          courseId,
          lessonId || '', // Handle null case efficiently
          file.name
        );
      } else if (file.type.startsWith('image/')) {
        uploadResult = await BunnyCdnService.uploadCourseImage(
          buffer,
          courseId,
          file.name,
          false // not a thumbnail
        );
      } else {
        // Handle as attachment - ultra efficient null handling
        uploadResult = await BunnyCdnService.uploadCourseAttachment(
          buffer,
          courseId,
          lessonId || '', // Handle null case efficiently
          file.name
        );
      }

      // Ultra-efficient: Only create attachment record if lessonId exists
      let attachment;
      if (lessonId) {
        attachment = await db.$transaction(async (tx) => {
          return await tx.attachment.create({
            data: {
              lessonId: lessonId,
              name: file.name,
              fileName: uploadResult.fileName,
              mimeType: uploadResult.mimeType,
              fileSize: uploadResult.fileSize,
              bunnyCdnPath: uploadResult.bunnyCdnPath,
              bunnyCdnUrl: uploadResult.bunnyCdnUrl,
            },
          });
        });
      } else {
        // For uploads without lessonId, return minimal attachment info
        attachment = {
          id: 'temp-' + Date.now(),
          lessonId: null,
          name: file.name,
          fileName: uploadResult.fileName,
          mimeType: uploadResult.mimeType,
          fileSize: uploadResult.fileSize,
          bunnyCdnPath: uploadResult.bunnyCdnPath,
          bunnyCdnUrl: uploadResult.bunnyCdnUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return attachment;
    })();

    // Ultra-efficient timeout handling for Vercel - Extended for large video files (3GB+)
    const attachment = await Promise.race([
      uploadPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Upload timeout after 5 minutes for large files')), 300000)
      )
    ]);

    // Clean up buffer to prevent memory leaks
    buffer.fill(0);

    return NextResponse.json({
      success: true,
      attachment: {
        id: attachment.id,
        lessonId: attachment.lessonId,
        name: attachment.name,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        fileSize: attachment.fileSize,
        bunnyCdnPath: attachment.bunnyCdnPath,
        bunnyCdnUrl: attachment.bunnyCdnUrl,
        createdAt: attachment.createdAt,
        updatedAt: attachment.updatedAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await handleAuth();
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if auth failed
    }

    const { searchParams } = new URL(req.url);
    const attachmentId = searchParams.get('id');

    if (!attachmentId) {
      return NextResponse.json({ error: 'Attachment ID is required' }, { status: 400 });
    }

    const attachment = await db.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    // Use transaction for atomic delete operation
    await db.$transaction(async (tx) => {
      await BunnyCdnService.deleteFile(attachment.bunnyCdnPath);
      await tx.attachment.delete({ where: { id: attachmentId } });
    });

    return NextResponse.json({
      success: true,
      message: 'Attachment deleted successfully',
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: 'Failed to delete attachment' }, { status: 500 });
  }
}