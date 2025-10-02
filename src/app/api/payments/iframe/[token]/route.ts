// src/app/api/payments/iframe/[token]/route.ts
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/server/db";
import { createErrorResponse, ApiErrors } from "@/lib/api-response";
import { SessionUser } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Get JWT token for App Router compatibility
    const jwtToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!jwtToken || !jwtToken.id) {
      return createErrorResponse(
        ApiErrors.UNAUTHORIZED.code,
        ApiErrors.UNAUTHORIZED.message,
        ApiErrors.UNAUTHORIZED.status
      );
    }

    // Map token to session format
    const session = {
      user: {
        id: jwtToken.id as string,
        name: jwtToken.name as string,
        email: jwtToken.email as string,
        image: jwtToken.picture as string,
        role: jwtToken.role as string,
        firstName: (jwtToken as { firstName?: string }).firstName || null,
        lastName: (jwtToken as { lastName?: string }).lastName || null,
        phoneNumber: (jwtToken as { phoneNumber?: string }).phoneNumber || null,
      } as SessionUser
    };

    const { token: paymentId } = await params;

    // Find the payment record by ID (token is the payment ID)
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
    if (payment.userId !== session.user.id) {
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

    // Get the gateway response to extract the payment key
    const gatewayResponse = payment.paymobResponse as Record<string, unknown> | null;
    if (!gatewayResponse?.paymentKey) {
      return createErrorResponse(
        "PAYMENT_KEY_NOT_FOUND",
        "مفتاح الدفع غير متوفر",
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

    const iframeUrl = `${baseUrl.replace('/api', '')}/api/acceptance/iframes/${iframeId}?payment_token=${gatewayResponse.paymentKey}`;

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
    console.error("Payment iframe error:", error);
    return createErrorResponse(
      ApiErrors.INTERNAL_ERROR.code,
      "حدث خطأ في تحميل نموذج الدفع",
      ApiErrors.INTERNAL_ERROR.status,
      error
    );
  }
}