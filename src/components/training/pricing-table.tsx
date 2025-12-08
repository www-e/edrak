'use client';

import { Home, Dumbbell, Target } from 'lucide-react';
import GenericPackage from '@/components/shared/GenericPackage';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PricingTable() {
  const { data: serviceData, isLoading } = api.admin.services.getServicePricingBySlug.useQuery({
    slug: 'training'
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

    // Define icon mapping for training packages
    const iconMap = {
      'Home Training': Home,
      'Gym Training': Dumbbell,
      'Sport-Specific Training': Target,
    } as const;

    // Define styling based on training type
    const colorMap = {
      'Home Training': 'from-blue-500 to-blue-600',
      'Gym Training': 'from-green-500 to-green-600',
      'Sport-Specific Training': 'from-orange-500 to-orange-600',
    } as const;

    const borderColorMap = {
      'Home Training': 'border-blue-200',
      'Gym Training': 'border-green-200',
      'Sport-Specific Training': 'border-orange-200',
    } as const;

    const buttonColorMap = {
      'Home Training': 'from-blue-500 to-blue-600',
      'Gym Training': 'from-green-500 to-green-600',
      'Sport-Specific Training': 'from-orange-500 to-orange-600',
    } as const;

    // Define features based on the tier name - in real app, these would come from the database too
    let features: { name: string; value: string; included: boolean }[] = [];
    if (tier.name === 'Home Training') {
      features = [
        { name: "Exercise Type", value: "No Equipment", included: true },
        { name: "Monthly Training Plan", value: "Included", included: true },
        { name: "Exercise Explanation Videos", value: "Included", included: true },
        { name: "WhatsApp Support", value: "Reply within 5 days", included: true },
        { name: "Initial Fitness Assessment", value: "Not available", included: false },
        { name: "Monthly Training Follow-up PDF Report", value: "Not available", included: false },
        { name: "Body Development Plan by Goal", value: "Not available", included: false },
        { name: "Free Consultation Session with Trainer (Video Call)", value: "Not available", included: false },
        { name: "Training Follow-up Certificate", value: "Not available", included: false },
        { name: "Program Modification Based on Progress", value: "Once per month", included: true }
      ];
    } else if (tier.name === 'Gym Training') {
      features = [
        { name: "Exercise Type", value: "Using Gym Equipment", included: true },
        { name: "Monthly Training Plan", value: "Included", included: true },
        { name: "Exercise Explanation Videos", value: "Included", included: true },
        { name: "WhatsApp Support", value: "Reply within 3 days", included: true },
        { name: "Initial Fitness Assessment", value: "Included", included: true },
        { name: "Monthly Training Follow-up PDF Report", value: "Included", included: true },
        { name: "Body Development Plan by Goal", value: "Included", included: true },
        { name: "Free Consultation Session with Trainer (Video Call)", value: "Not available", included: false },
        { name: "Training Follow-up Certificate", value: "Included", included: true },
        { name: "Program Modification Based on Progress", value: "Twice per month", included: true }
      ];
    } else if (tier.name === 'Sport-Specific Training') {
      features = [
        { name: "Exercise Type", value: "Sport-Specific (MMA, Swimming, Football...)", included: true },
        { name: "Monthly Training Plan", value: "Included", included: true },
        { name: "Exercise Explanation Videos", value: "Included", included: true },
        { name: "WhatsApp Support", value: "Reply within 2 days", included: true },
        { name: "Initial Fitness Assessment", value: "Included", included: true },
        { name: "Monthly Training Follow-up PDF Report", value: "Included", included: true },
        { name: "Body Development Plan by Goal", value: "Included", included: true },
        { name: "Free Consultation Session with Trainer (Video Call)", value: "Once per month", included: true },
        { name: "Training Follow-up Certificate", value: "Included", included: true },
        { name: "Program Modification Based on Progress", value: "Weekly", included: true }
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
      tier: tier.name,
      price: {
        monthly: priceMap.monthly || '0 EGP',
        threeMonths: priceMap.threeMonths || undefined,
        sixMonths: priceMap.sixMonths || undefined,
      },
      icon: iconMap[tier.name as TierName] || Home,
      color: colorMap[tier.name as TierName] || 'from-blue-500 to-blue-600',
      borderColor: borderColorMap[tier.name as TierName] || 'border-blue-200',
      buttonColor: buttonColorMap[tier.name as TierName] || 'from-blue-500 to-blue-600',
      popular: tier.isPopular,
      features,
    };
  }) || [];

  // Static content for training packages that doesn't change
  const suitableForItems = [
    {
      icon: Home,
      title: "Home Training",
      description: "Beginners or those who prefer home workouts"
    },
    {
      icon: Dumbbell,
      title: "Gym Training",
      description: "Regular gym practitioners looking for structure"
    },
    {
      icon: Target,
      title: "Sport-Specific",
      description: "Professional athletes or youth teams"
    }
  ];

  return (
    <GenericPackage
      title="Training Programs Comparison"
      description="Choose the perfect training program that matches your goals, fitness level, and lifestyle. All programs are designed by certified trainers."
      packages={packages}
      subtitleGradient="from-primary to-secondary"
      suitableForItems={suitableForItems}
    />
  );
}