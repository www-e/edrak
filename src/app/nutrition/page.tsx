import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import NutritionHero from '@/components/nutrition/nutrition-hero';
import WhyChooseSection from '@/components/nutrition/why-choose-section';
import PackagesSection from '@/components/nutrition/packages-section';
import WhatYouGetSection from '@/components/nutrition/what-you-get-section';
import CallToActionSection from '@/components/nutrition/call-to-action-section';
import NutritionForm from '@/components/nutrition/nutrition-form';
import GeneralFAQ from '@/components/shared/GeneralFAQ';

export const metadata: Metadata = {
  title: 'Nutrition Programs | SportologyPlus',
  description: 'Professional nutrition programs designed specifically for athletes - personalized plans, expert guidance, and continuous support',
};

export default function NutritionPage() {
  const nutritionFAQs = [
    {
      question: "Does the program include professional and amateur athletes?",
      answer: "Yes, each package is designed according to the sports level and personal goal."
    },
    {
      question: "Is the program suitable for vegetarians or those with allergies?",
      answer: "Absolutely, it's fully customized according to your diet system and preferences. However, we don't rely on a purely vegetarian diet system."
    },
    {
      question: "Can I change the package after starting?",
      answer: "Yes, you can upgrade to any higher package at any time."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <NutritionHero />
        <WhyChooseSection />
        <div id="packages">
          <PackagesSection />
        </div>
        <div id="form">
          <NutritionForm />
        </div>
        <WhatYouGetSection />
        <GeneralFAQ items={nutritionFAQs} title="Nutrition Programs FAQ" />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}