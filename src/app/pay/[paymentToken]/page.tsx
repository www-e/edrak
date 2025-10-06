'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';
import { clientEnv } from '@/lib/env-client';

function PaymentFrame() {
    const params = useParams();
    const paymentToken = params.paymentToken as string;

    if (!paymentToken) {
        return (
            <div className="text-center text-destructive">
                <p>Error: A valid payment token was not provided.</p>
            </div>
        );
    }
    
    const iframeUrl = `${clientEnv.NEXT_PUBLIC_APP_URL}/api/payments/iframe/${paymentToken}`;

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-lg shadow-2xl animate-in fade-in duration-500">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <ShieldCheck className="h-6 w-6 text-green-500" />
                        Secure Card Payment
                    </CardTitle>
                    <CardDescription className="text-center pt-2">
                        Your transaction is encrypted and secure. Please complete your payment below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-lg border bg-gray-100">
                        <iframe
                            src={iframeUrl}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            title="PayMob Secure Payment Frame"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Wrap with Suspense for useParams compatibility and better loading UX
export default function PayPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Loading Secure Payment Gateway...</p>
            </div>
        }>
            <PaymentFrame />
        </Suspense>
    );
}