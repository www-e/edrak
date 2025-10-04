'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Course } from '@/features/courses/types';
import { Zap, CheckCircle, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { api } from '@/trpc/react';
import { useSnackbar } from '@/components/shared/snackbar-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CourseEnrollProps {
  course: Course;
}

export function CourseEnroll({ course }: CourseEnrollProps) {
  const { data: session } = useSession();
  const { showSnackbar } = useSnackbar();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [walletNumber, setWalletNumber] = useState('');

  const initiatePayment = api.student.payment.initiateCoursePayment.useMutation({
    onSuccess: (data) => {
      if (data.type === 'iframe' && data.iframeUrl) {
        // Open iframe URL directly in current window (matching working project)
        window.location.href = data.iframeUrl;
      } else if (data.type === 'redirect' && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to start payment.", "error");
    },
  });

  const handleEnroll = () => {
    if (isFree) {
      // Logic for free courses can be added here
      showSnackbar("This is a free course. Direct enrollment coming soon!", "success");
      return;
    }

    if (paymentMethod === 'wallet' && !/^\d{11}$/.test(walletNumber)) {
      showSnackbar('Please enter a valid 11-digit Egyptian mobile number.', 'error');
      return;
    }

    initiatePayment.mutate({
      courseId: course.id,
      paymentMethod,
      walletNumber: paymentMethod === 'wallet' ? walletNumber : undefined,
    });
  };

  const benefits = [ "Full lifetime access", "Access on mobile and TV", "Certificate of completion" ];
  const isFree = course.price <= 0;

  return (
    <section className="py-4 sm:py-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Pricing Header - Mobile optimized */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-4 sm:p-6 text-white text-center">
              <h3 className="text-2xl sm:text-3xl font-bold">
                {isFree ? 'Enroll for FREE' : `Just ${course.price.toFixed(2)} EGP`}
              </h3>
              <p className="text-white/90 mt-1 text-sm sm:text-base">One-time payment for lifetime access.</p>
            </div>

            <div className="p-4 sm:p-6">
              {/* Payment Method Selection - Mobile optimized */}
              {!isFree && session && (
                <div className="mb-4 sm:mb-6">
                  <Label className="font-semibold text-foreground mb-3 block text-sm sm:text-base">
                    1. Select Payment Method
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('card')}
                      className="py-4 sm:py-6 text-sm sm:text-base h-auto w-full"
                    >
                      <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Credit Card
                    </Button>
                    <Button
                      variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('wallet')}
                      className="py-4 sm:py-6 text-sm sm:text-base h-auto w-full"
                    >
                      <Smartphone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Mobile Wallet
                    </Button>
                  </div>
                  {paymentMethod === 'wallet' && (
                    <div className="mt-4 animate-in fade-in duration-300">
                      <Label htmlFor="walletNumber" className="text-sm font-medium">
                        Wallet Mobile Number
                      </Label>
                      <Input
                        id="walletNumber"
                        type="tel"
                        placeholder="01xxxxxxxxx"
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value)}
                        className="mt-2 h-12 bg-background/50 text-base"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter 11-digit Egyptian mobile number
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button - Mobile optimized */}
              <div className="mb-4 sm:mb-6">
                {session ? (
                  <Button
                    size="lg"
                    onClick={handleEnroll}
                    disabled={initiatePayment.isPending}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold py-3 sm:py-4 text-base sm:text-lg shadow-lg h-auto"
                  >
                    {initiatePayment.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        {isFree ? 'Start Learning Now' : 'Complete Enrollment'}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button asChild size="lg" className="w-full py-3 sm:py-4">
                    <Link href={`/auth/student/signin?callbackUrl=/courses/${course.slug}`}>
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Sign In to Enroll
                    </Link>
                  </Button>
                )}
              </div>

              {/* Benefits & Stats - Mobile optimized */}
              <div className="space-y-3 mb-4 sm:mb-6">
                <h4 className="font-semibold text-foreground text-sm sm:text-base">
                  This course includes:
                </h4>
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}