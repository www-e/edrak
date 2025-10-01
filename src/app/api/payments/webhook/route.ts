import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { PayMobService } from '@/lib/paymob';
import { EnrollmentStatus } from '@prisma/client';

// This function handles the server-to-server webhook from PayMob
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Ensure the webhook is of type TRANSACTION
    if (body.type !== 'TRANSACTION') {
      return NextResponse.json({ received: true, message: 'Not a transaction webhook.' });
    }

    const transactionData = body.obj;
    const hmac = req.headers.get('x-paymob-hmac');

    if (!hmac || !PayMobService.verifyHmac(hmac, transactionData)) {
      console.error("PayMob Webhook: Invalid HMAC signature.");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const paymobOrderId = transactionData.order.id;
    const isSuccess = transactionData.success === true;

    const payment = await db.payment.findUnique({
      where: { paymobOrderId },
    });

    if (!payment) {
      console.error(`PayMob Webhook: Payment not found for PayMob Order ID ${paymobOrderId}`);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }
    
    // Only process if the payment was successful and is still PENDING in our system
    if (isSuccess && payment.status === 'PENDING') {
        await db.$transaction(async (prisma) => {
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'COMPLETED',
                    gatewayReference: transactionData.id.toString(),
                },
            });

            if (payment.userId && payment.courseId) {
                // Ensure enrollment doesn't already exist
                const existingEnrollment = await prisma.enrollment.findFirst({
                    where: { userId: payment.userId, courseId: payment.courseId },
                });

                if (!existingEnrollment) {
                    await prisma.enrollment.create({
                        data: {
                            userId: payment.userId,
                            courseId: payment.courseId,
                            status: EnrollmentStatus.ACTIVE,
                        },
                    });
                }
            }
        });
        console.log(`Webhook: Successfully processed and enrolled payment for PayMob Order ID: ${paymobOrderId}`);
    } else if (!isSuccess && payment.status === 'PENDING') {
        await db.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED' },
        });
        console.log(`Webhook: Failed payment recorded for PayMob Order ID: ${paymobOrderId}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error in PayMob webhook handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}