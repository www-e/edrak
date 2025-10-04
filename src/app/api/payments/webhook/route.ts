import { NextRequest } from "next/server";
import { db } from '@/server/db';
import { PayMobService, PayMobWebhookData } from '@/lib/paymob';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { EnrollmentStatus } from '@prisma/client';

interface PayMobWebhookPayload {
  type: string;
  obj: {
    id: number;
    success: boolean;
    error_occured?: boolean;
    order?: { id: number; merchant_order_id?: string };
    amount_cents?: number;
    currency?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return createErrorResponse("WEBHOOK_DATA_MISSING", "Webhook data is missing", 400);
    }

    const webhookData: PayMobWebhookPayload = JSON.parse(rawBody);
    const webhookObject = webhookData.obj;

    if (!webhookObject || typeof webhookObject !== 'object') {
      return createErrorResponse("WEBHOOK_PAYLOAD_INVALID", "Invalid webhook payload structure", 400);
    }

    const hmac = request.headers.get('x-paymob-hmac');
    if (!hmac || !PayMobService.verifyHmac(hmac, webhookObject as PayMobWebhookData)) {
      return createErrorResponse("WEBHOOK_SIGNATURE_INVALID", "Invalid webhook signature", 401);
    }

    const isSuccess = Boolean(webhookObject.success && !webhookObject.error_occured);
    const orderId = webhookObject.order?.id;

    if (!orderId) {
      return createErrorResponse("WEBHOOK_MISSING_ORDER_ID", "Missing order identification", 400);
    }

    const result = await PayMobService.processPaymentUpdate(orderId.toString(), isSuccess, webhookObject.id);

    if (!result) {
      return createErrorResponse("PAYMENT_NOT_FOUND", "Payment record not found", 404);
    }

    return createSuccessResponse({
      paymentId: result.paymentId,
      status: result.status,
      transactionId: result.transactionId,
      enrollment: {
        created: result.enrollment?.success || false,
        enrollmentId: result.enrollment?.enrollmentId,
      },
    }, "Webhook processed successfully");

  } catch (error) {
    return createErrorResponse("WEBHOOK_PROCESSING_ERROR", "Webhook processing failed", 500, {
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// GET /api/payments/webhook - Health check for webhook endpoint
export async function GET() {
  return createSuccessResponse({
    message: "PayMob webhook endpoint is active",
    timestamp: new Date().toISOString(),
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
  });
}