'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { processPaymentReturn } from '@/lib/payment-return-processor';

type PaymentStatus = 'success' | 'failed' | 'pending' | 'processing';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const paramsObj = Object.fromEntries(searchParams.entries());
        const result = await processPaymentReturn(paramsObj);
        if (result) {
          setStatus(result.success ? 'success' : 'failed');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        setStatus('failed');
      } finally {
        setIsProcessing(false);
      }
    };

    if (searchParams.toString()) {
      processPayment();
    }
  }, [searchParams]);

  const statusConfig = {
    processing: {
      Icon: Loader2,
      color: "text-blue-500 animate-spin",
      title: "Processing Payment...",
      text: "Please wait while we confirm your payment.",
    },
    success: {
      Icon: CheckCircle,
      color: "text-green-500",
      title: "Payment Successful!",
      text: "Your enrollment is confirmed. The course is now available in your dashboard.",
    },
    failed: {
      Icon: XCircle,
      color: "text-destructive",
      title: "Payment Failed",
      text: "There was an issue with your payment. No charges were made. Please try again.",
    },
    pending: {
      Icon: Clock,
      color: "text-yellow-500",
      title: "Payment is Processing",
      text: "Your payment is being processed. You will be notified once confirmed.",
    },
  };

  const currentStatus = statusConfig[status];

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardContent className="p-8">
            <currentStatus.Icon className={`h-12 w-12 mx-auto mb-4 ${currentStatus.color}`} />
            <h2 className="text-xl font-bold mb-2">{currentStatus.title}</h2>
            <p className="text-muted-foreground">{currentStatus.text}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center shadow-lg animate-in fade-in duration-500 mx-4">
        <CardHeader className="pb-4">
          <CardTitle className="flex justify-center">
            <currentStatus.Icon className={`h-12 w-12 sm:h-16 sm:w-16 ${currentStatus.color}`} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold">{currentStatus.title}</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {currentStatus.text}
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {status === 'failed' && (
              <div className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/courses">Try Again</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/student/payments">View Payment History</Link>
                </Button>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/student/courses">Go to My Courses</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/courses">Browse More Courses</Link>
                </Button>
              </div>
            )}

            {status === 'pending' && (
              <div className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/student/courses">Check My Courses</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/student/payments">View Payments</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentReturnPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Finalizing your transaction...</p>
            </div>
        }>
            <PaymentStatusContent />
        </Suspense>
    );
}