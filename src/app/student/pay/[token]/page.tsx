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

export default function PaymentIframePage() {
  const params = useParams();
  const router = useRouter();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

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
          router.push('/payments/return?success=false&error=payment_failed');
        } else if (data.message === 'transaction_processed') {
          const success = data.success;
          if (success) {
            console.log('Payment success message received from iframe.');
            router.push('/payments/return?success=true');
          } else {
            console.error('Payment failure message received from iframe.');
            router.push('/payments/return?success=false&error=payment_failed');
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

  return (
    <div className="min-h-screen bg-muted/40 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              الدفع بالبطاقة الائتمانية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-white relative" style={{ height: '700px' }}>
              {!iframeLoaded && !showFallback && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">جاري تحميل نموذج الدفع الآمن...</p>
                </div>
              )}

              {showFallback && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8 text-center z-20">
                  <AlertCircle className="w-12 h-12 text-yellow-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">هل تواجه مشكلة في تحميل النموذج؟</h3>
                  <p className="text-muted-foreground mb-4">
                    يمكنك فتح صفحة الدفع في نافذة جديدة لإتمام العملية.
                  </p>
                  <Button onClick={() => window.open(iframeUrl, '_blank')}>
                    <ExternalLink className="w-4 h-4 ml-2" />
                    فتح في نافذة جديدة
                  </Button>
                </div>
              )}

              <iframe
                src={iframeUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', visibility: iframeLoaded ? 'visible' : 'hidden' }}
                onLoad={() => setIframeLoaded(true)}
                onError={() => setShowFallback(true)}
                allow="payment"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center mt-4">
              <Shield className="w-4 h-4" />
              <span>هذا النموذج محمي ومشفر بواسطة PayMob</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}