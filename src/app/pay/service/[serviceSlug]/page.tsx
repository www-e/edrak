'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Label } from '@/components/ui/label';
import { api } from '@/trpc/react';
import { useSession } from 'next-auth/react';
import { Loader2, ShieldCheck, CreditCard, Wallet } from 'lucide-react';
import { toast } from 'sonner';

// Define the RadioGroup components using Radix directly
const RadioGroup = RadioGroupPrimitive.Root;
const RadioGroupItem = RadioGroupPrimitive.Item;

export default function ServicePaymentPage() {
  const router = useRouter();
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [walletNumber, setWalletNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Get service with pricing information
  const { data: service, isLoading: isServiceLoading, error } = api.public.services.getServiceBySlug.useQuery(
    { slug: serviceSlug },
    {
      enabled: !!serviceSlug,
    }
  );

  // Handle error using useEffect
  useEffect(() => {
    if (error) {
      toast.error('Error loading service information');
      console.error('Error loading service:', error);
    }
  }, [error]);

  // Mutation for initiating payment
  const initiatePaymentMutation = api.student.payment.initiatePayment.useMutation({
    onSuccess: (result) => {
      if (result.type === 'iframe' && result.iframeUrl) {
        // Redirect to payment iframe
        window.location.href = result.iframeUrl;
      } else if (result.type === 'redirect' && result.redirectUrl) {
        // Redirect to external payment page
        window.location.href = result.redirectUrl;
      } else {
        toast.error('Unexpected payment response');
      }
    },
    onError: (error) => {
      toast.error('Error initiating payment: ' + error.message);
    }
  });

  // Process service data once loaded
  useEffect(() => {
    if (service && service.serviceTiers.length > 0) {
      // Set default tier to the popular one or the first one
      const popularTier = service.serviceTiers.find(tier => tier.isPopular);
      const defaultTier = popularTier || service.serviceTiers[0];
      
      if (defaultTier) {
        setSelectedTier(defaultTier.id);
        
        // Set default duration to the first available
        if (defaultTier.price.length > 0) {
          setSelectedDuration(defaultTier.price[0].id);
        }
      }
    }
    setIsLoading(false);
  }, [service]);

  const handleSubmit = () => {
    if (!selectedTier || !selectedDuration) {
      toast.error('Please select a package and duration');
      return;
    }

    if (paymentMethod === 'wallet' && !walletNumber) {
      toast.error('Please enter your wallet number');
      return;
    }

    // Prepare payment data
    const paymentData = {
      serviceId: service?.id,
      serviceTierId: selectedTier,
      servicePriceId: selectedDuration,
      paymentMethod,
      walletNumber: paymentMethod === 'wallet' ? walletNumber : undefined,
    };

    // Validate data
    if (!paymentData.serviceId || !paymentData.serviceTierId || !paymentData.servicePriceId) {
      toast.error('Invalid service selection');
      return;
    }

    // Initiate payment
    initiatePaymentMutation.mutate(paymentData);
  };

  if (isServiceLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading service information...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-4">Service Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The requested service is not available.
            </p>
            <Button 
              onClick={() => router.push('/services')} 
              className="w-full"
            >
              Browse Services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Find selected tier and price
  const selectedTierData = service.serviceTiers.find(tier => tier.id === selectedTier);
  const selectedPrice = selectedTierData?.price.find(price => price.id === selectedDuration);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Complete Your {service.name} Purchase</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your preferred package and complete your purchase securely
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Selection Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Select Your Package
                </CardTitle>
                <CardDescription>
                  Choose the package and duration that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {service.serviceTiers.map((tier) => (
                  <div 
                    key={tier.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTier === tier.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg">{tier.name}</h3>
                      {tier.isPopular && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    
                    <RadioGroup 
                      value={selectedDuration} 
                      onValueChange={setSelectedDuration}
                      className="space-y-3"
                    >
                      {tier.price.map((price) => (
                        <div 
                          key={price.id} 
                          className={`flex items-center justify-between p-3 rounded-md border ${
                            selectedDuration === price.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border'
                          }`}
                          onClick={() => {
                            setSelectedTier(tier.id);
                            setSelectedDuration(price.id);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem 
                              value={price.id} 
                              id={price.id}
                              checked={selectedDuration === price.id && selectedTier === tier.id}
                            />
                            <Label htmlFor={price.id} className="cursor-pointer">
                              {price.duration.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Label>
                          </div>
                          <span className="font-bold text-lg">{price.price} EGP</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>
                  Review your selection and payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span className="font-medium">
                      {selectedTierData?.name || 'Select package'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">
                      {selectedPrice?.duration.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || 'Select duration'}
                    </span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{selectedPrice ? `${selectedPrice.price} EGP` : '0 EGP'}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <RadioGroup 
                        value={paymentMethod} 
                        onValueChange={(value: 'card' | 'wallet') => setPaymentMethod(value)}
                        className="grid grid-cols-2 gap-2"
                      >
                        <div className="flex items-center space-x-2 p-2 border rounded-md">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="cursor-pointer flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 border rounded-md">
                          <RadioGroupItem value="wallet" id="wallet" />
                          <Label htmlFor="wallet" className="cursor-pointer flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Wallet
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {paymentMethod === 'wallet' && (
                      <div>
                        <Label htmlFor="walletNumber">Wallet Number</Label>
                        <input
                          id="walletNumber"
                          type="tel"
                          placeholder="Enter wallet number"
                          value={walletNumber}
                          onChange={(e) => setWalletNumber(e.target.value)}
                          className="w-full p-2 border rounded-md mt-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-primary to-green-600 hover:from-primary hover:to-green-600" 
                    onClick={handleSubmit}
                    disabled={initiatePaymentMutation.isPending}
                  >
                    {initiatePaymentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${selectedPrice ? selectedPrice.price : '0'} EGP`
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Secure Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your payment is securely processed through PayMob. Your information is encrypted and never stored.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}