"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Smartphone,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethod = 'card' | 'wallet';

interface PaymentModalProps {
  course: {
    id: string;
    title: string;
    price: number;
    professor: {
      firstName: string;
      lastName: string;
    };
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentModal({ course, onSuccess, onCancel }: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'result'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setError(null);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 11 && cleanPhone.startsWith('01');
  };

  const handleProceed = async () => {
    if (selectedMethod === 'wallet' && !validatePhoneNumber(phoneNumber)) {
      setError('رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          paymentMethod: selectedMethod,
          walletNumber: selectedMethod === 'wallet' ? phoneNumber : undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'فشل في بدء عملية الدفع');
      }

      if (data.data.type === 'redirect') {
        // Redirect to wallet payment URL
        window.location.href = data.data.redirectUrl;
      } else if (data.data.type === 'iframe') {
        // Redirect to iframe payment page
        window.location.href = data.data.iframeUrl;
      }

      setStep('processing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = () => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(course.price);
  };

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">جاري معالجة الدفع</h3>
            <p className="text-muted-foreground">
              يرجى الانتظار بينما نحضر عملية الدفع الآمنة...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            دفع آمن ومحمي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">{course.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              بواسطة: {course.professor.firstName} {course.professor.lastName}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">المبلغ الإجمالي</span>
              <span className="text-2xl font-bold text-primary">{formatPrice()}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="font-semibold">اختر طريقة الدفع</h3>

            <div className="grid grid-cols-1 gap-3">
              {/* Credit Card */}
              <div
                className={cn(
                  "border-2 rounded-lg p-4 cursor-pointer transition-all",
                  selectedMethod === 'card'
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                )}
                onClick={() => handleMethodSelect('card')}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-semibold">بطاقة ائتمان أو خصم</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                  </div>
                  {selectedMethod === 'card' && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>

              {/* E-wallet */}
              <div
                className={cn(
                  "border-2 rounded-lg p-4 cursor-pointer transition-all",
                  selectedMethod === 'wallet'
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                )}
                onClick={() => handleMethodSelect('wallet')}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-8 h-8 text-green-600" />
                  <div className="flex-1">
                    <p className="font-semibold">محفظة إلكترونية</p>
                    <p className="text-sm text-muted-foreground">فودافون كاش، أورانج موني، إتصالات كاش</p>
                  </div>
                  {selectedMethod === 'wallet' && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            </div>

            {/* Phone number input for wallet */}
            {selectedMethod === 'wallet' && (
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف المسجل في المحفظة</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={cn(
                    "text-left",
                    error && "border-red-500"
                  )}
                  dir="ltr"
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-600" />
              <span>SSL محمي</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>دفع آمن</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              إلغاء
            </Button>
            <Button
              onClick={handleProceed}
              disabled={isLoading || (selectedMethod === 'wallet' && !phoneNumber)}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري التحضير...
                </>
              ) : (
                <>
                  {selectedMethod === 'card' ? (
                    <CreditCard className="w-4 h-4 ml-2" />
                  ) : (
                    <Smartphone className="w-4 h-4 ml-2" />
                  )}
                  متابعة الدفع
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}