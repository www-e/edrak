// src/app/api/payments/check-status/route.ts
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/server/db';
import { createSuccessResponse, createErrorResponse, ApiErrors } from '@/lib/api-response';
import { authOptions } from '@/lib/auth';

interface AuthenticatedUser { id: string; role: string; email?: string; name?: string; }

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !('id' in session.user)) {
      return createErrorResponse(
        ApiErrors.UNAUTHORIZED.code,
        ApiErrors.UNAUTHORIZED.message,
        ApiErrors.UNAUTHORIZED.status
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const merchantOrderId = searchParams.get('merchantOrderId');
    const transactionId = searchParams.get('transactionId');

    const user = session.user as AuthenticatedUser;

    const whereConditions: Array<{
      userId: string;
      courseId?: string;
      paymobOrderId?: string;
      paymobTransactionId?: bigint;
    }> = [];

    if (courseId) whereConditions.push({ userId: user.id, courseId });
    if (merchantOrderId) whereConditions.push({ userId: user.id, paymobOrderId: merchantOrderId });
    if (transactionId) whereConditions.push({ userId: user.id, paymobTransactionId: BigInt(transactionId) });

    if (whereConditions.length === 0) {
      return createErrorResponse(
        ApiErrors.VALIDATION_ERROR.code,
        'يجب توفير معرف الدورة أو معرف الطلب أو معرف المعاملة',
        ApiErrors.VALIDATION_ERROR.status
      );
    }

    const payment = await db.payment.findFirst({
      where: { OR: whereConditions },
      orderBy: { createdAt: 'desc' },
      include: { course: { select: { id: true, title: true } } }
    });

    if (!payment) {
      return createErrorResponse('PAYMENT_NOT_FOUND', 'لم يتم العثور على عملية دفع', 404);
    }

    if (payment.userId !== user.id) {
      return createErrorResponse(ApiErrors.FORBIDDEN.code, 'لا يمكنك عرض هذه المعاملة', ApiErrors.FORBIDDEN.status);
    }

    const timeSinceCreation = Date.now() - payment.createdAt.getTime();
    const isRecentPendingPayment = payment.status === 'PENDING' && timeSinceCreation < 60000;

    const transformedPayment = {
      ...payment,
      amount: Number(payment.amount),
      _metadata: {
        timeSinceCreation,
        isRecentPending: isRecentPendingPayment,
        shouldPoll: isRecentPendingPayment,
        pollIntervalMs: isRecentPendingPayment ? 3000 : null
      }
    };

    return createSuccessResponse(transformedPayment);
  } catch (error) {
    return createErrorResponse(
      ApiErrors.INTERNAL_ERROR.code,
      ApiErrors.INTERNAL_ERROR.message,
      ApiErrors.INTERNAL_ERROR.status,
      error
    );
  }
}