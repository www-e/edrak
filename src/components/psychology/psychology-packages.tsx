'use client';

import { Star, Crown, Diamond, Brain, CheckCircle } from 'lucide-react';
import GenericPackage from '@/components/shared/GenericPackage';

export default function PsychologyPackages() {
  const packages = [
    {
      name: "Silver",
      tier: "🥈 Silver",
      price: {
        monthly: "400 EGP",
        threeMonths: "999 EGP",
        sixMonths: "Not Available"
      },
      icon: Star,
      color: "from-gray-400 to-gray-500",
      borderColor: "border-gray-200",
      buttonColor: "from-gray-600 to-gray-700",
      features: [
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
      ]
    },
    {
      name: "Gold",
      tier: "🥇 Gold",
      price: {
        monthly: "999 EGP",
        threeMonths: "Not Available",
        sixMonths: "Not Available"
      },
      icon: Crown,
      color: "from-yellow-400 to-yellow-500",
      borderColor: "border-yellow-200",
      buttonColor: "from-yellow-500 to-yellow-600",
      popular: true,
      features: [
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
      ]
    },
    {
      name: "Diamond",
      tier: "💎 Diamond",
      price: {
        monthly: "2300 EGP",
        threeMonths: "Not Available",
        sixMonths: "Not Available"
      },
      icon: Diamond,
      color: "from-blue-400 to-indigo-500",
      borderColor: "border-blue-200",
      buttonColor: "from-blue-600 to-indigo-600",
      features: [
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
      ]
    }
  ];

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