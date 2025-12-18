'use client';

import { Star, Crown, Diamond, Brain, CheckCircle } from 'lucide-react';
import GenericPackage from '@/components/shared/GenericPackage';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PsychologyPackages() {
  const { data: serviceData, isLoading } = api.public.services.getServiceBySlug.useQuery({
    slug: 'psychology'
  });

  if (isLoading) {
    return (
      <div className="py-24 bg-gray-50/50">
        <div className="container max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg p-8">
                <div className="text-center mb-8">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-8 w-40 mx-auto mb-2" />
                  <Skeleton className="h-6 w-32 mx-auto mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-32 mx-auto" />
                    <Skeleton className="h-5 w-40 mx-auto" />
                    <Skeleton className="h-5 w-40 mx-auto" />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Skeleton className="w-5 h-5 rounded-full mt-0.5" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>

                <Skeleton className="w-full h-12 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Transform service data to match GenericPackage format
  const packages = serviceData?.serviceTiers.map(tier => {
    const priceMap: Record<string, string | undefined> = {
      monthly: '0 EGP',  // Default values if no prices exist
      threeMonths: undefined,
      sixMonths: undefined
    };

    tier.price.forEach(p => {
      priceMap[p.duration] = `${p.price} EGP`;
    });

    const iconMap = {
      'Silver': Star,
      'Gold': Crown,
      'Diamond': Diamond,
    } as const;

    const colorMap = {
      'Silver': 'from-gray-400 to-gray-500',
      'Gold': 'from-yellow-400 to-yellow-500',
      'Diamond': 'from-blue-400 to-indigo-500',
    } as const;

    const borderColorMap = {
      'Silver': 'border-gray-200',
      'Gold': 'border-yellow-200',
      'Diamond': 'border-blue-200',
    } as const;

    const buttonColorMap = {
      'Silver': 'from-gray-600 to-gray-700',
      'Gold': 'from-yellow-500 to-yellow-600',
      'Diamond': 'from-blue-600 to-indigo-600',
    } as const;

    // Define features based on the tier name - in real app, these would come from the database too
    let features: { name: string; value: string; included: boolean }[] = [];
    if (tier.name === 'Silver') {
      features = [
        { name: "Number of psychological sessions", value: "1 session (30 minutes) per month", included: true },
        { name: "WhatsApp support for inquiries", value: "Not available", included: false },
        { name: "Psychological follow-up PDF report", value: "Not available", included: false },
        { name: "Psychological recommendations for athletic performance", value: "Once", included: true },
        { name: "Initial psychological assessment", value: "Included", included: true },
        { name: "Psychologist selection option", value: "Not available", included: false },
        { name: "Discount on additional sessions", value: "Not available", included: false },
        { name: "Psychological support session attendance certificate", value: "Not available", included: false },
        { name: "Pre-competition psychological support session", value: "Not available", included: false },
        { name: "Two-month written psychological support plan", value: "Not available", included: false },
        { name: "Email support between sessions", value: "Not available", included: false }
      ];
    } else if (tier.name === 'Gold') {
      features = [
        { name: "Number of psychological sessions", value: "3 sessions (30 minutes) per month", included: true },
        { name: "WhatsApp support for inquiries", value: "Response within 5 days", included: true },
        { name: "Psychological follow-up PDF report", value: "After the last session", included: true },
        { name: "Psychological recommendations for athletic performance", value: "Weekly", included: true },
        { name: "Initial psychological assessment", value: "Included", included: true },
        { name: "Psychologist selection option", value: "Included", included: true },
        { name: "Discount on additional sessions", value: "10%", included: true },
        { name: "Psychological support session attendance certificate", value: "Included", included: true },
        { name: "Pre-competition psychological support session", value: "Not available", included: false },
        { name: "Two-month written psychological support plan", value: "Not available", included: false },
        { name: "Email support between sessions", value: "Not available", included: false }
      ];
    } else if (tier.name === 'Diamond') {
      features = [
        { name: "Number of psychological sessions", value: "5 sessions (30 minutes) over 2 months", included: true },
        { name: "WhatsApp support for inquiries", value: "Response within 2 days", included: true },
        { name: "Psychological follow-up PDF report", value: "After each session", included: true },
        { name: "Psychological recommendations for athletic performance", value: "Customized per case", included: true },
        { name: "Initial psychological assessment", value: "Included + detailed results analysis", included: true },
        { name: "Psychologist selection option", value: "With recommendation for best fit", included: true },
        { name: "Discount on additional sessions", value: "20%", included: true },
        { name: "Psychological support session attendance certificate", value: "With case development assessment", included: true },
        { name: "Pre-competition psychological support session", value: "Free (30 minutes)", included: true },
        { name: "Two-month written psychological support plan", value: "Customized per athletic goal", included: true },
        { name: "Email support between sessions", value: "Weekly availability", included: true }
      ];
    }

    // Default features if not in the predefined lists
    if (features.length === 0) {
      features = [
        { name: "Placeholder feature", value: "Included", included: true },
        { name: "Another feature", value: "Not included", included: false },
      ];
    }

    type TierName = keyof typeof iconMap;

    return {
      name: tier.name,
      tier: tier.name === 'Silver' ? '🥈 Silver' :
            tier.name === 'Gold' ? '🥇 Gold' :
            tier.name === 'Diamond' ? '💎 Diamond' : tier.name,
      price: {
        monthly: priceMap.monthly || '0 EGP',
        threeMonths: priceMap.threeMonths || undefined,
        sixMonths: priceMap.sixMonths || undefined,
      },
      icon: iconMap[tier.name as TierName] || Star,
      color: colorMap[tier.name as TierName] || 'from-gray-400 to-gray-500',
      borderColor: borderColorMap[tier.name as TierName] || 'border-gray-200',
      buttonColor: buttonColorMap[tier.name as TierName] || 'from-gray-600 to-gray-700',
      popular: tier.isPopular,
      features,
    };
  }) || [];

  // Static content for psychology packages that doesn't change
  const packageReasons = [
    {
      name: "Self-Confidence",
      icon: Star,
      title: "Build Self-Confidence",
      description: "Before competitions"
    },
    {
      name: "Stress Management",
      icon: Brain,
      title: "Manage Stress & Pressure",
      description: "During training preparation"
    },
    {
      name: "Focus & Discipline",
      icon: CheckCircle,
      title: "Improve Focus & Mental Discipline",
      description: "For peak performance"
    },
    {
      name: "Barrier Overcome",
      icon: Crown,
      title: "Overcome Psychological Barriers",
      description: "After injuries or setbacks"
    }
  ];

  const suitableForItems = [
    {
      icon: Star,
      title: "Silver Package",
      description: "Beginner athletes starting their mental performance journey"
    },
    {
      icon: Crown,
      title: "Gold Package",
      description: "Intermediate level (preparing for local championships)"
    },
    {
      icon: Diamond,
      title: "Diamond Package",
      description: "Professional athletes or first-division teams"
    }
  ];

  return (
    <GenericPackage
      title="Sportology Plus Psychology Packages"
      description="Choose the package that suits your mental performance goals and get comprehensive psychological support"
      packages={packages}
      subtitleGradient="from-purple-600 to-pink-600"
      showPackageReasons={true}
      packageReasons={packageReasons}
      suitableForItems={suitableForItems}
    />
  );
}