'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Course } from '@/features/courses/types';
import { Zap, CheckCircle, Loader2, CreditCard, Smartphone, Award, BookOpen, Users, Tag, X } from 'lucide-react';
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
   const router = useRouter();

   const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
   const [walletNumber, setWalletNumber] = useState('');
   const [couponCode, setCouponCode] = useState('');
   const [appliedCoupon, setAppliedCoupon] = useState<{
     code: string;
     discount: number;
     discountType: 'PERCENTAGE' | 'FIXED';
     finalAmount: number;
   } | null>(null);
   const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

   // Check if user is already enrolled in this course
   const { data: enrollmentData } = api.student.courses.checkEnrollment.useQuery(
     { courseId: course.id },
     { enabled: !!session?.user }
   );

   // Redirect enrolled users to student course page
   useEffect(() => {
     if (enrollmentData?.isEnrolled && session?.user) {
       router.push(`/student/courses/${course.id}`);
     }
   }, [enrollmentData?.isEnrolled, session?.user, router, course.id]);

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

  const validateCouponMutation = api.student.payment.validateCoupon.useMutation();

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      showSnackbar('Please enter a coupon code', 'error');
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const result = await validateCouponMutation.mutateAsync({
        couponCode: couponCode.trim(),
        coursePrice: course.price,
      });

      if (result.isValid) {
        setAppliedCoupon({
          code: result.coupon!.code,
          discount: result.discount,
          discountType: result.discountType as 'PERCENTAGE' | 'FIXED',
          finalAmount: result.finalAmount,
        });
        showSnackbar(`Coupon applied! You saved ${result.discount.toFixed(2)} EGP`, 'success');
      } else {
        showSnackbar(result.error || 'Invalid coupon code', 'error');
        setAppliedCoupon(null);
      }
    } catch (error) {
      showSnackbar('Error validating coupon', 'error');
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    showSnackbar('Coupon removed');
  };

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
      couponCode: appliedCoupon ? couponCode : undefined,
    });
  };

  const benefits = [ "Full lifetime access", "Access on mobile and TV", "Certificate of completion" ];
  const isFree = course.price <= 0;
  const isEnrolled = enrollmentData?.isEnrolled;

  // Show enrolled user UI
  if (isEnrolled && session) {
    return (
      <section className="py-8 md:py-12 bg-gradient-to-br from-green-50/50 via-background to-blue-50/50 dark:from-green-950/10 dark:via-background dark:to-blue-950/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto overflow-hidden shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
            <CardContent className="p-0">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20" />
                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-3">Already Enrolled! 🎉</h3>
                  <p className="text-green-50 text-lg md:text-xl max-w-2xl mx-auto">
                    Welcome back! You have full access to this course content.
                  </p>
                </div>
              </div>

              {/* Progress Section */}
              <div className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-foreground mb-4">
                    Continue Your Learning Journey
                  </h4>

                  {/* Progress Bar */}
                  <div className="max-w-md mx-auto mb-6">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-primary font-bold">
                        {enrollmentData.enrollment?.completionPercentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${enrollmentData.enrollment?.completionPercentage || 0}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-muted-foreground text-lg">
                    {enrollmentData.enrollment?.completionPercentage === 100
                      ? "🎓 Congratulations! You've completed this course. You can review the content anytime."
                      : `📚 You've completed ${enrollmentData.enrollment?.completionPercentage || 0}% of this course. Keep up the great work!`
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg">
                    <Link href={`/student/courses/${course.id}`} className="flex items-center gap-2">
                      {enrollmentData.enrollment?.completionPercentage === 100 ? (
                        <>
                          <Award className="w-5 h-5" />
                          Review Course
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-5 h-5" />
                          Continue Learning
                        </>
                      )}
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold">
                    <Link href="/student/courses" className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      View All My Courses
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10">
      <div className="container mx-auto px-4">
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
          <CardContent className="p-0">
            {/* Pricing Header */}
            <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10" />
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">
                  {isFree ? 'Enroll for FREE' : `Just ${appliedCoupon ? appliedCoupon.finalAmount.toFixed(2) : course.price.toFixed(2)} EGP`}
                </h3>
                <p className="text-primary-foreground/90 text-lg">
                  One-time payment for lifetime access
                  {appliedCoupon && (
                    <span className="block text-sm text-green-200 mt-1">
                      You saved {appliedCoupon.discount.toFixed(2)} EGP with coupon {appliedCoupon.code}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Payment Method Selection */}
              {!isFree && session && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold text-foreground mb-4 block">
                      Choose Your Payment Method
                    </Label>
                    <p className="text-muted-foreground mb-6">
                      Select how you would like to complete your enrollment
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('card')}
                      className="p-6 h-auto text-left justify-start border-2 hover:border-primary/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${paymentMethod === 'card' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-semibold text-base">Credit Card</div>
                          <div className="text-sm text-muted-foreground">Visa, Mastercard, Meeza</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('wallet')}
                      className="p-6 h-auto text-left justify-start border-2 hover:border-primary/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${paymentMethod === 'wallet' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <Smartphone className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-semibold text-base">Mobile Wallet</div>
                          <div className="text-sm text-muted-foreground">Vodafone Cash, Orange Money</div>
                        </div>
                      </div>
                    </Button>
                  </div>

                  {paymentMethod === 'wallet' && (
                    <div className="animate-in fade-in duration-300 p-6 bg-muted/30 rounded-xl border border-border/50">
                      <Label htmlFor="walletNumber" className="text-base font-medium mb-3 block">
                        Mobile Wallet Number
                      </Label>
                      <Input
                        id="walletNumber"
                        type="tel"
                        placeholder="01xxxxxxxxx"
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value)}
                        className="h-12 text-base bg-background"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Enter your 11-digit Egyptian mobile number
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Coupon Section */}
              {!isFree && session && (
                <div className="space-y-4 p-6 bg-muted/20 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold text-foreground">
                      Have a coupon code?
                    </Label>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-green-800 dark:text-green-200">
                            {appliedCoupon.code}
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-300">
                            {appliedCoupon.discountType === 'PERCENTAGE'
                              ? `${appliedCoupon.discount}% discount`
                              : `${appliedCoupon.discount.toFixed(2)} EGP discount`
                            }
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 h-12 text-base bg-background"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            validateCoupon();
                          }
                        }}
                      />
                      <Button
                        onClick={validateCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="px-6 h-12"
                      >
                        {isValidatingCoupon ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Validating...
                          </>
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    Enter a valid coupon code to get a discount on this course
                  </p>
                </div>
              )}

              {/* Enrollment Button */}
              <div className="text-center pb-4">
                {session ? (
                  <Button
                    size="lg"
                    onClick={handleEnroll}
                    disabled={initiatePayment.isPending}
                    className="px-12 py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {initiatePayment.isPending ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Zap className="h-6 w-6 mr-3" />
                        {isFree ? 'Start Learning Now' : 'Complete Enrollment'}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button asChild size="lg" className="px-12 py-6 text-xl font-bold shadow-xl">
                    <Link href={`/auth/student/signin?callbackUrl=/courses/${course.slug}`}>
                      <Zap className="h-6 w-6 mr-3" />
                      Sign In to Enroll
                    </Link>
                  </Button>
                )}
              </div>

              {/* Course Benefits */}
              <div className="border-t border-border/50 pt-8">
                <h4 className="text-xl font-bold text-foreground mb-6 text-center">
                  What is Included
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={benefit} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/30">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-foreground font-medium leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}