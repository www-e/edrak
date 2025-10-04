'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const success = searchParams.get('success') === 'true';
    const isPending = searchParams.get('pending') === 'true';

    let status: 'success' | 'failed' | 'pending' = 'failed';
    if (success && !isPending) {
        status = 'success';
    } else if (success && isPending) {
        status = 'pending';
    }

    const messages = {
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
            text: "Your payment is being processed. You will be notified once confirmed. Please check 'My Courses' shortly.",
        },
    };

    const currentStatus = messages[status];

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
  
            {/* Enhanced action buttons for different scenarios */}
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
  
            {/* Help text for mobile */}
            <div className="text-xs text-muted-foreground sm:hidden">
              {status === 'failed' && (
                <p>إذا استمرت المشكلة، تواصل مع الدعم الفني</p>
              )}
              {status === 'pending' && (
                <p>قد يستغرق تأكيد الدفع بضع دقائق</p>
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