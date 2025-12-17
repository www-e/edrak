import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import NutritionHero from '@/components/nutrition/nutrition-hero';
import WhyChooseSection from '@/components/nutrition/why-choose-section';
import PackagesSection from '@/components/nutrition/packages-section';
import WhatYouGetSection from '@/components/nutrition/what-you-get-section';
import CallToActionSection from '@/components/nutrition/call-to-action-section';
import GeneralFAQ from '@/components/shared/GeneralFAQ';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

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
        {/* Removed form - now requires payment first */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Get Your Personalized Nutrition Plan</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Complete your purchase to access the application form in your dashboard
            </p>
            <Link href="/pay/service/nutrition">
              <Button size="lg" className="bg-gradient-to-r from-primary to-green-600 hover:from-primary hover:to-green-600 text-white px-8 py-6 text-lg">
                <CreditCard className="mr-2 h-5 w-5" />
                Purchase Nutrition Program
              </Button>
            </Link>
          </div>
        </section>
        <WhatYouGetSection />
        <GeneralFAQ items={nutritionFAQs} title="Nutrition Programs FAQ" />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}