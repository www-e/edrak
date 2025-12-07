'use client';

import { Star, Crown, Diamond } from 'lucide-react';
import GenericPackage from '@/components/shared/GenericPackage';

export default function PackagesSection() {
  const packages = [
    {
      name: "Silver",
      tier: "🥈 Silver",
      price: {
        monthly: "495 EGP",
        threeMonths: "1350 EGP",
        sixMonths: "2500 EGP"
      },
      icon: Star,
      color: "from-gray-400 to-gray-500",
      borderColor: "border-gray-200",
      buttonColor: "from-gray-600 to-gray-700",
      features: [
        { name: "Program changes", value: "Once", included: true },
        { name: "Nutritional supplements recommendations", value: "Not available", included: false },
        { name: "WhatsApp inquiries", value: "Response within 7 days", included: true },
        { name: "Video call with nutritionist", value: "Not available", included: false },
        { name: "Professional PDF nutrition report", value: "Included", included: true },
        { name: "Weekly nutrition & sleep recommendations", value: "Not available", included: false },
        { name: "Monthly email follow-up", value: "Not available", included: false },
        { name: "Monthly nutrition follow-up certificate", value: "Not available", included: false }
      ]
    },
    {
      name: "Gold",
      tier: "🥇 Gold",
      price: {
        monthly: "995 EGP",
        threeMonths: "2700 EGP",
        sixMonths: "5000 EGP"
      },
      icon: Crown,
      color: "from-yellow-400 to-yellow-500",
      borderColor: "border-yellow-200",
      buttonColor: "from-yellow-500 to-yellow-600",
      popular: true,
      features: [
        { name: "Program changes", value: "Twice", included: true },
        { name: "Nutritional supplements recommendations", value: "Available", included: true },
        { name: "WhatsApp inquiries", value: "Response within 3 days", included: true },
        { name: "Video call with nutritionist", value: "Once monthly (20 minutes)", included: true },
        { name: "Professional PDF nutrition report", value: "Included", included: true },
        { name: "Weekly nutrition & sleep recommendations", value: "Included", included: true },
        { name: "Monthly email follow-up", value: "Included", included: true },
        { name: "Monthly nutrition follow-up certificate", value: "Included", included: true }
      ]
    },
    {
      name: "Diamond",
      tier: "💎 Diamond",
      price: {
        monthly: "1495 EGP",
        threeMonths: "4000 EGP",
        sixMonths: "7000 EGP"
      },
      icon: Diamond,
      color: "from-blue-400 to-indigo-500",
      borderColor: "border-blue-200",
      buttonColor: "from-blue-600 to-indigo-600",
      features: [
        { name: "Program changes", value: "4 times", included: true },
        { name: "Nutritional supplements recommendations", value: "Available", included: true },
        { name: "WhatsApp inquiries", value: "Response within 1 day", included: true },
        { name: "Video call with nutritionist", value: "4 times monthly (20 minutes)", included: true },
        { name: "Professional PDF nutrition report", value: "Included", included: true },
        { name: "Weekly nutrition & sleep recommendations", value: "Included", included: true },
        { name: "Monthly email follow-up", value: "Included", included: true },
        { name: "Monthly nutrition follow-up certificate", value: "Included", included: true }
      ]
    }
  ];

  return (
    <GenericPackage
      title="Sportology Plus Nutrition Packages"
      description="Choose the perfect package that suits your goals and get comprehensive nutritional support"
      packages={packages}
      subtitleGradient="from-green-600 to-emerald-600"
    />
  );
}