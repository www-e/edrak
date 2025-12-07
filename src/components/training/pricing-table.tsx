'use client';

import { Home, Dumbbell, Target } from 'lucide-react';
import GenericPackage from '@/components/shared/GenericPackage';

export default function PricingTable() {
  const packages = [
    {
      name: "Home Training",
      tier: "Home Training",
      price: {
        monthly: "600 EGP",
        threeMonths: "1500 EGP",
        sixMonths: "2600 EGP"
      },
      icon: Home,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-200",
      buttonColor: "from-blue-500 to-blue-600",
      features: [
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
      ]
    },
    {
      name: "Gym Training",
      tier: "Gym Training",
      price: {
        monthly: "700 EGP",
        threeMonths: "1750 EGP",
        sixMonths: "3100 EGP"
      },
      icon: Dumbbell,
      color: "from-green-500 to-green-600",
      borderColor: "border-green-200",
      buttonColor: "from-green-500 to-green-600",
      popular: true,
      features: [
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
      ]
    },
    {
      name: "Sport-Specific Training",
      tier: "Sport-Specific Training",
      price: {
        monthly: "900 EGP",
        threeMonths: "2200 EGP",
        sixMonths: "3700 EGP"
      },
      icon: Target,
      color: "from-orange-500 to-orange-600",
      borderColor: "border-orange-200",
      buttonColor: "from-orange-500 to-orange-600",
      features: [
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
      ]
    }
  ];

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