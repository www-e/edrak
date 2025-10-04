"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, CreditCard, Smartphone, Phone, LucideIcon } from "lucide-react";

interface PaymentRecoveryProps {
  errorType?: 'network' | 'card_declined' | 'insufficient_funds' | 'timeout' | 'unknown';
  courseId?: string;
  onRetry?: () => void;
}

const ErrorIcon = ({ className }: { className?: string }) => (
  <div className="rounded-full bg-red-100 p-3">
    <AlertCircle className={`h-8 w-8 text-red-600 ${className}`} />
  </div>
);

const PaymentActionButton = ({
  onClick,
  disabled,
  isRetrying
}: {
  onClick?: () => void;
  disabled?: boolean;
  isRetrying?: boolean;
}) => (
  <Button onClick={onClick} disabled={disabled} className="w-full" size="lg">
    {isRetrying ? (
      <>
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        Retrying...
      </>
    ) : (
      <>
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </>
    )}
  </Button>
);

const AlternativePaymentButton = ({ icon: Icon, children, ...props }: {
  icon: LucideIcon;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Button variant="outline" size="sm" className="text-xs" {...props}>
    <Icon className="w-3 h-3 mr-1" />
    {children}
  </Button>
);

export function PaymentRecovery({ errorType = 'unknown', onRetry }: PaymentRecoveryProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const errorConfig = {
    network: {
      title: 'Network Error',
      message: 'Unable to connect to payment gateway. Please check your internet connection.',
      suggestion: 'Try again or use a different network connection.'
    },
    card_declined: {
      title: 'Card Declined',
      message: 'Your card was declined by the bank. Please contact your bank or try a different card.',
      suggestion: 'Check with your bank or use an alternative payment method.'
    },
    insufficient_funds: {
      title: 'Insufficient Funds',
      message: 'There are not enough funds available on your card.',
      suggestion: 'Check your account balance or use a different payment method.'
    },
    timeout: {
      title: 'Request Timeout',
      message: 'The payment request timed out. This might be due to slow internet connection.',
      suggestion: 'Try again with a stable internet connection.'
    },
    unknown: {
      title: 'Payment Failed',
      message: 'Something went wrong with your payment. Don\'t worry, no charges were made.',
      suggestion: 'Please try again or contact support if the issue persists.'
    }
  };

  const config = errorConfig[errorType];

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <ErrorIcon />
        </div>
        <CardTitle className="text-xl">{config.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">{config.message}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            💡 {config.suggestion}
          </p>
        </div>

        <div className="space-y-3">
          {onRetry && (
            <PaymentActionButton
              onClick={handleRetry}
              disabled={isRetrying}
              isRetrying={isRetrying}
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <AlternativePaymentButton icon={CreditCard}>
              Different Card
            </AlternativePaymentButton>
            <AlternativePaymentButton icon={Smartphone}>
              Mobile Wallet
            </AlternativePaymentButton>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Need help? Contact our support team
          </p>
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" className="text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Contact Support
            </Button>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg text-center">
          <p className="text-xs text-green-800 dark:text-green-200">
            ✅ No charges were made to your account
          </p>
        </div>
      </CardContent>
    </Card>
  );
}