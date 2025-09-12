import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth';
import { BunnyCdnService } from '@/lib/bunny-cdn';
import { db } from '@/server/db';
import { SessionUser } from '@/types/auth';
import { type NextApiResponse } from 'next';

// Create a minimal response object that satisfies NextApiResponse type requirements
const createMockResponse = (): NextApiResponse => {
  return {
    status: () => createMockResponse(),
    json: () => createMockResponse(),
    send: () => createMockResponse(),
    redirect: () => createMockResponse(),
    setDraftMode: () => createMockResponse(),
    setPreviewData: () => createMockResponse(),
    clearPreviewData: () => createMockResponse(),
    revalidate: async () => {},
  } as unknown as NextApiResponse;
};

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerAuthSession({
      req: req,
      res: createMockResponse(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if ((session.user as SessionUser).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const courseId = formData.get('courseId') as string | null;
    const lessonId = formData.get('lessonId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Validate course exists and user has permission
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Validate lesson exists if provided
    if (lessonId) {
      const lesson = await db.lesson.findUnique({
        where: { id: lessonId },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: 'Lesson not found' },
          { status: 404 }
        );
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create folder path
    const folderPath = BunnyCdnService.createFolderPath(courseId, lessonId || undefined);

    // Upload file to Bunny.net
    const uploadResult = await BunnyCdnService.uploadFile(
      buffer,
      file.name,
      file.type,
      folderPath
    );

    // Create attachment record in database
    const attachment = await db.attachment.create({
      data: {
        lessonId: lessonId || '',
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
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerAuthSession({
      req: req,
      res: createMockResponse(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if ((session.user as SessionUser).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get attachment ID from query parameters
    const { searchParams } = new URL(req.url);
    const attachmentId = searchParams.get('id');

    if (!attachmentId) {
      return NextResponse.json(
        { error: 'Attachment ID is required' },
        { status: 400 }
      );
    }

    // Find attachment
    const attachment = await db.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      );
    }

    // Delete file from Bunny.net
    await BunnyCdnService.deleteFile(attachment.bunnyCdnPath);

    // Delete attachment record from database
    await db.attachment.delete({
      where: { id: attachmentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Attachment deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete attachment' },
      { status: 500 }
    );
  }
}