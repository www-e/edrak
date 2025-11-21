"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
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
  Loader2,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletCheckoutOption } from "@/components/student/WalletCheckoutOption";
import { useSnackbar } from "@/components/shared/snackbar-context";

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
  const [walletAmountToUse, setWalletAmountToUse] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar();

  const initiatePayment = api.student.payment.initiateCoursePayment.useMutation({
    onSuccess: (data) => {
      if (data.type === "completed") {
        // Full payment with wallet
        showSnackbar("You have successfully enrolled in the course using your wallet balance.", "success");
        onSuccess();
      } else if (data.type === "redirect") {
        // Redirect to wallet payment URL
        window.location.href = data.redirectUrl;
        setStep('processing');
      } else if (data.type === "iframe") {
        // Redirect to iframe payment page
        if (data.iframeUrl) {
          window.location.href = data.iframeUrl;
          setStep('processing');
        } else {
           setError("Configuration error: Iframe URL missing");
           setStep('method');
        }
      }
    },
    onError: (err) => {
      setError(err.message || 'Failed to initiate payment');
      setStep('method');
    }
  });

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setError(null);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 11 && cleanPhone.startsWith('01');
  };

  const handleProceed = () => {
    const remainingAmount = Math.max(0, course.price - walletAmountToUse);

    // If there is a remaining amount to pay via PayMob
    if (remainingAmount > 0) {
      if (selectedMethod === 'wallet' && !validatePhoneNumber(phoneNumber)) {
        setError('Phone number must be 11 digits starting with 01');
        return;
      }
    }

    setStep('processing');
    setError(null);

    initiatePayment.mutate({
      courseId: course.id,
      paymentMethod: selectedMethod,
      walletNumber: selectedMethod === 'wallet' ? phoneNumber : undefined,
      walletAmountToUse: walletAmountToUse > 0 ? walletAmountToUse : undefined,
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const remainingAmount = Math.max(0, course.price - walletAmountToUse);
  const isFullWalletPayment = remainingAmount === 0;

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
            <p className="text-muted-foreground">
              Please wait while we process your secure payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">{course.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              By: {course.professor.firstName} {course.professor.lastName}
            </p>
            <div className="flex items-center justify-between border-t pt-2 mt-2">
              <span className="text-sm text-muted-foreground">Course Price</span>
              <span className="font-semibold">{formatPrice(course.price)}</span>
            </div>
            
            {walletAmountToUse > 0 && (
              <div className="flex items-center justify-between text-sm mt-1 text-green-600">
                <span>Wallet Balance Used</span>
                <span>- {formatPrice(walletAmountToUse)}</span>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-2 border-t">
              <span className="font-bold">Total to Pay</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(remainingAmount)}</span>
            </div>
          </div>

          {/* Wallet Option */}
          <WalletCheckoutOption 
            coursePrice={course.price} 
            onWalletAmountChange={setWalletAmountToUse} 
          />

          {/* Payment Methods - Only show if there is a remaining amount */}
          {!isFullWalletPayment && (
            <div className="space-y-4">
              <h3 className="font-semibold">Select Payment Method</h3>

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
                      <p className="font-semibold">Credit / Debit Card</p>
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
                      <p className="font-semibold">Mobile Wallet</p>
                      <p className="text-sm text-muted-foreground">Vodafone Cash, Orange Money, Etisalat Cash</p>
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
                  <Label htmlFor="phone">Wallet Phone Number</Label>
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
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Security badges */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-600" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Safe Payment</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleProceed}
              disabled={initiatePayment.isPending || (!isFullWalletPayment && selectedMethod === 'wallet' && !phoneNumber)}
              className="flex-1"
            >
              {initiatePayment.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  Processing...
                </>
              ) : (
                <>
                  {isFullWalletPayment ? (
                    <Wallet className="w-4 h-4 ml-2" />
                  ) : selectedMethod === 'card' ? (
                    <CreditCard className="w-4 h-4 ml-2" />
                  ) : (
                    <Smartphone className="w-4 h-4 ml-2" />
                  )}
                  {isFullWalletPayment ? "Pay with Wallet" : "Proceed to Pay"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}