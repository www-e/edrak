"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ExternalLink,
  CreditCard,
  Loader2,
  AlertCircle
} from "lucide-react";
import { PaymentRecovery } from "@/components/payment/PaymentRecovery";

export default function PaymentIframePage() {
  const params = useParams();
  const router = useRouter();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const token = params.token as string;

  // Handle new dual-token format: paymentId/paymentKey
  // For backward compatibility, handle single token as paymentId
  let paymentId: string;
  let paymentKey: string;

  if (token.includes('/')) {
    [paymentId, paymentKey] = token.split('/');
  } else {
    paymentId = token;
    paymentKey = token; // Fallback for single token format
  }

  useEffect(() => {
    // Listen for payment completion messages from the iframe
    const messageHandler = (event: MessageEvent) => {
      // Security check: ensure the message is from a trusted PayMob domain
      if (!event.origin.includes('accept.paymob.com')) {
        return;
      }

      try {
        // Try to parse the message data
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        // Handle different types of messages
        if (data.type === 'payment_success') {
          console.log('Payment success message received from iframe.');
          // Redirect to return page with success
          router.push('/payments/return?success=true');
        } else if (data.type === 'payment_error') {
          console.error('Payment error message received from iframe.');
          // Set specific error type for recovery component
          setPaymentError(data.errorType || 'unknown');
        } else if (data.message === 'transaction_processed') {
          const success = data.success;
          if (success) {
            console.log('Payment success message received from iframe.');
            router.push('/payments/return?success=true');
          } else {
            console.error('Payment failure message received from iframe.');
            setPaymentError('payment_failed');
          }
        }
      } catch (err) {
        console.error('Error parsing message from iframe:', err);
      }
    };

    window.addEventListener('message', messageHandler);

    // Set a timeout to show a fallback option if the iframe is slow to load
    const timeout = setTimeout(() => {
      if (!iframeLoaded) {
        console.warn('PayMob iframe loading timeout reached. Showing fallback.');
        setShowFallback(true);
      }
    }, 15000); // 15-second timeout

    return () => {
      window.removeEventListener('message', messageHandler);
      clearTimeout(timeout);
    };
  }, [iframeLoaded, router]);

  const iframeUrl = `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')}/api/payments/iframe/${paymentId}/${paymentKey}`;

  const handleRetryPayment = () => {
    setPaymentError(null);
    setIframeLoaded(false);
    setShowFallback(false);
    // Force iframe reload by updating the key or re-triggering the load
    window.location.reload();
  };

  // Show payment recovery if there's an error
  if (paymentError) {
    return (
      <div className="min-h-screen bg-muted/40 py-4 px-4 sm:py-8 sm:px-0">
        <div className="max-w-4xl mx-auto">
          <PaymentRecovery
            errorType={paymentError as 'network' | 'card_declined' | 'insufficient_funds' | 'timeout' | 'unknown'}
            onRetry={handleRetryPayment}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 py-4 px-4 sm:py-8 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="hidden sm:inline">الدفع بالبطاقة الائتمانية</span>
              <span className="sm:hidden">دفع آمن</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="border rounded-lg overflow-hidden bg-white relative">
              {/* Mobile-optimized height */}
              <div
                className="w-full bg-white relative sm:h-[700px] h-[600px]"
                style={{
                  minHeight: '600px',
                  maxHeight: '80vh'
                }}
              >
                {!iframeLoaded && !showFallback && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground text-center">
                      جاري تحميل نموذج الدفع الآمن...
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      تأكد من تشغيل الجافا سكريبت في المتصفح
                    </p>
                  </div>
                )}

                {showFallback && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4 sm:p-8 text-center z-20">
                    <AlertCircle className="w-12 h-12 text-yellow-600 mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">مشكلة في التحميل</h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base text-center">
                      يمكنك فتح صفحة الدفع في نافذة جديدة
                    </p>
                    <Button
                      onClick={() => window.open(iframeUrl, '_blank')}
                      className="w-full sm:w-auto"
                      size="lg"
                    >
                      <ExternalLink className="w-4 h-4 ml-2" />
                      فتح في نافذة جديدة
                    </Button>
                  </div>
                )}

                <iframe
                  src={iframeUrl}
                  width="100%"
                  height="100%"
                  style={{
                    border: 'none',
                    visibility: iframeLoaded ? 'visible' : 'hidden',
                    minHeight: '600px'
                  }}
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => setShowFallback(true)}
                  allow="payment"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Mobile-optimized footer */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground justify-center mt-4 p-2 bg-muted/30 rounded-lg">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span className="text-center">نموذج دفع محمي ومشفر بواسطة PayMob</span>
            </div>

            {/* Mobile-specific instructions */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg sm:hidden">
              <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
                💡 للحصول على أفضل تجربة، استخدم المتصفح الافتراضي وتأكد من تشغيل الجافا سكريبت
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}