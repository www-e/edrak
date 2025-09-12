import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { BunnyCdnService } from '@/lib/bunny-cdn';
import { db } from '@/server/db';
import { SessionUser } from '@/types/auth';

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
    
    if (!lessonId) {
        return NextResponse.json({ error: 'Lesson ID is required to create an attachment' }, { status: 400 });
    }

    const lesson = await db.lesson.findUnique({ where: { id: lessonId, courseId: courseId } });
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found or does not belong to the specified course' }, { status: 404 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const folderPath = BunnyCdnService.createFolderPath(courseId, lessonId);

    const uploadResult = await BunnyCdnService.uploadFile(
      buffer,
      file.name,
      file.type,
      folderPath
    );

    const attachment = await db.attachment.create({
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

    return NextResponse.json({
      success: true,
      attachment: {
        id: attachment.id,
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

    await BunnyCdnService.deleteFile(attachment.bunnyCdnPath);
    await db.attachment.delete({ where: { id: attachmentId } });

    return NextResponse.json({
      success: true,
      message: 'Attachment deleted successfully',
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: 'Failed to delete attachment' }, { status: 500 });
  }
}