// src/app/api/payments/iframe/[token]/route.ts
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/server/db";
import { createErrorResponse, ApiErrors } from "@/lib/api-response";
import { authOptions } from "@/lib/auth";

interface AuthenticatedUser { id: string; role: string; email?: string; name?: string; }

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !('id' in session.user)) {
      return createErrorResponse(
        ApiErrors.UNAUTHORIZED.code,
        ApiErrors.UNAUTHORIZED.message,
        ApiErrors.UNAUTHORIZED.status
      );
    }

    const { token } = await params;

    // Simplified: token is the payment ID
    const paymentId = token;

    // Find the payment record by ID
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        course: true,
        user: true,
      },
    });

    if (!payment) {
      return createErrorResponse(
        ApiErrors.NOT_FOUND.code,
        "عملية الدفع غير موجودة",
        ApiErrors.NOT_FOUND.status
      );
    }

    // Security check: Ensure the payment belongs to the current user
    if (payment.userId !== (session.user as AuthenticatedUser).id) {
      return createErrorResponse(
        ApiErrors.FORBIDDEN.code,
        "لا يمكنك الوصول إلى هذه العملية",
        ApiErrors.FORBIDDEN.status
      );
    }

    // Check if payment is still pending
    if (payment.status !== "PENDING") {
      return createErrorResponse(
        "PAYMENT_NOT_PENDING",
        "عملية الدفع لم تعد صالحة",
        400
      );
    }

    // Get payment key from stored response
    const gatewayResponse = payment.paymobResponse as Record<string, unknown> | null;
    const paymentKeyToUse = gatewayResponse?.paymentKey;

    if (!paymentKeyToUse) {
      return createErrorResponse(
        "PAYMENT_KEY_NOT_FOUND",
        "مفتاح الدفع غير متوفر في قاعدة البيانات",
        400
      );
    }

    // Build the iframe URL
    const baseUrl = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api";
    const iframeId = process.env.PAYMOB_IFRAME_ID || process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID;

    if (!iframeId) {
      return createErrorResponse(
        "IFRAME_CONFIG_ERROR",
        "إعدادات الدفع غير مكتملة",
        500
      );
    }

    const iframeUrl = `${baseUrl.replace('/api', '')}/api/acceptance/iframes/${iframeId}?payment_token=${paymentKeyToUse}`;

    // Return HTML that redirects to the iframe
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>PayMob Payment</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            iframe {
              border: none;
              width: 100%;
              height: 100vh;
            }
            .loading {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-size: 18px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <iframe src="${iframeUrl}" onload="hideLoading()" onerror="showError()">
            <div class="loading">جاري تحميل نموذج الدفع...</div>
          </iframe>

          <script>
            function hideLoading() {
              const loading = document.querySelector('.loading');
              if (loading) {
                loading.style.display = 'none';
              }
            }

            function showError() {
              const loading = document.querySelector('.loading');
              if (loading) {
                loading.innerHTML = 'حدث خطأ في تحميل نموذج الدفع. يرجى المحاولة مرة أخرى.';
                loading.style.color = '#ef4444';
              }
            }

            // Listen for messages from the iframe
            window.addEventListener('message', function(event) {
              if (event.origin.includes('paymob.com')) {
                try {
                  const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

                  if (data.type === 'payment_success' || (data.message === 'transaction_processed' && data.success)) {
                    window.parent.postMessage({ type: 'payment_success' }, '*');
                  } else if (data.type === 'payment_error' || (data.message === 'transaction_processed' && !data.success)) {
                    window.parent.postMessage({ type: 'payment_error' }, '*');
                  }
                } catch (e) {
                  console.error('Error parsing iframe message:', e);
                }
              }
            });
          </script>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    return createErrorResponse(
      ApiErrors.INTERNAL_ERROR.code,
      "حدث خطأ في تحميل نموذج الدفع",
      ApiErrors.INTERNAL_ERROR.status,
      error
    );
  }
}