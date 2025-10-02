import { NextRequest } from "next/server";
import { db } from '@/server/db';
import { PayMobService, PayMobWebhookData } from '@/lib/paymob';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { EnrollmentStatus } from '@prisma/client';

// Type definitions for webhook data
interface PayMobWebhookPayload {
  type: string;
  obj: {
    id: number;
    success: boolean;
    error_occured?: boolean;
    order?: {
      id: number;
      merchant_order_id?: string;
    };
    amount_cents?: number;
    currency?: string;
  };
}

// This function handles the server-to-server webhook from PayMob
export async function POST(request: NextRequest) {
  let webhookData: PayMobWebhookPayload | null = null;
  let transactionId: number | null = null;

  try {
    // Parse webhook data
    webhookData = await request.json();

    if (!webhookData) {
      return createErrorResponse(
        "WEBHOOK_DATA_MISSING",
        "Webhook data is missing or invalid",
        400
      );
    }

    transactionId = webhookData.obj?.id ?? null;

    console.log("PayMob webhook received:", {
      transactionId: transactionId,
      orderId: webhookData.obj?.order?.id,
      success: webhookData.obj?.success,
      amount: webhookData.obj?.amount_cents,
      timestamp: new Date().toISOString(),
    });

    const webhookObject = webhookData.obj;

    // Validate webhook payload structure
    if (!webhookObject || typeof webhookObject !== 'object') {
      console.error("Invalid webhook payload structure:", webhookObject);
      return createErrorResponse(
        "WEBHOOK_PAYLOAD_INVALID",
        "Invalid webhook payload structure",
        400,
        { receivedPayload: webhookObject }
      );
    }

    // Verify webhook signature
    const hmac = request.headers.get('x-paymob-hmac');
    if (!hmac || !PayMobService.verifyHmac(hmac, webhookObject as PayMobWebhookData)) {
      console.error(
        "Invalid PayMob webhook signature for transaction:",
        transactionId
      );
      return createErrorResponse(
        "WEBHOOK_SIGNATURE_INVALID",
        "Invalid webhook signature",
        401,
        { transactionId: transactionId }
      );
    }

    // Process webhook data
    const isSuccess = Boolean(webhookObject.success && !webhookObject.error_occured);
    const orderId = webhookObject.order?.id;

    if (!orderId) {
      console.error("Missing order ID in webhook data");
      return createErrorResponse(
        "WEBHOOK_MISSING_ORDER_ID",
        "Missing order identification",
        400
      );
    }

    // Find the payment record
    const payment = await db.payment.findFirst({
      where: {
        paymobOrderId: orderId.toString(),
      } as Record<string, unknown>,
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        course: { select: { id: true, title: true } },
      },
    });

    if (!payment) {
      console.error("Payment not found for webhook:", {
        orderId: orderId,
        transactionId: transactionId,
      });

      return createErrorResponse(
        "PAYMENT_NOT_FOUND",
        "Payment record not found",
        404
      );
    }

    // Determine new payment status
    const newStatus = isSuccess ? "COMPLETED" : "FAILED";

    // Execute payment update and enrollment creation in a single transaction
    const transactionResult = await db.$transaction(async (tx) => {
      // Update payment record
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
        },
      });

      // For successful payments, create enrollment within the same transaction
      let enrollmentResult = null;
      if (isSuccess) {
        try {
          // Check if enrollment already exists
          const existingEnrollment = await tx.enrollment.findUnique({
            where: {
              userId_courseId: {
                userId: payment.userId,
                courseId: payment.courseId!,
              },
            },
          });

          if (!existingEnrollment) {
            // Create enrollment
            const newEnrollment = await tx.enrollment.create({
              data: {
                userId: payment.userId,
                courseId: payment.courseId!,
                status: EnrollmentStatus.ACTIVE,
                completionPercentage: 0,
                lastAccessedAt: null,
              },
            });

            enrollmentResult = {
              success: true,
              enrollmentId: newEnrollment.id,
              created: true,
            };

            console.log("Enrollment created within transaction:", {
              enrollmentId: newEnrollment.id,
              paymentId: payment.id,
              userId: payment.userId,
              courseId: payment.courseId,
            });
          } else {
            enrollmentResult = {
              success: true,
              enrollmentId: existingEnrollment.id,
              created: false,
            };

            console.log("Enrollment already exists:", {
              enrollmentId: existingEnrollment.id,
              paymentId: payment.id,
            });
          }
        } catch (enrollmentError) {
          console.error(
            "Enrollment creation failed within transaction:",
            enrollmentError
          );

          enrollmentResult = {
            success: false,
            error: enrollmentError instanceof Error ? enrollmentError.message : "Unknown error",
            requiresManualReview: true,
          };
        }
      }

      return {
        payment: updatedPayment,
        enrollment: enrollmentResult,
      };
    });

    console.log("Payment webhook processed:", {
      paymentId: payment.id,
      status: newStatus,
      transactionId: transactionId,
      success: isSuccess,
      enrollmentCreated: transactionResult.enrollment?.success || false,
      enrollmentId: transactionResult.enrollment?.enrollmentId,
    });

    return createSuccessResponse({
      paymentId: payment.id,
      status: newStatus,
      transactionId: transactionId,
      enrollment: {
        created: transactionResult.enrollment?.success || false,
        enrollmentId: transactionResult.enrollment?.enrollmentId,
        requiresManualReview: transactionResult.enrollment?.requiresManualReview || false,
      },
    }, "Webhook processed successfully");

  } catch (error) {
    console.error("PayMob webhook processing error:", error);

    return createErrorResponse(
      "WEBHOOK_PROCESSING_ERROR",
      "Webhook received but processing failed",
      500,
      {
        error: error instanceof Error ? error.message : "Unknown error",
        transactionId,
      }
    );
  }
}

// GET /api/payments/webhook - Health check for webhook endpoint
export async function GET() {
  return createSuccessResponse({
    message: "PayMob webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}