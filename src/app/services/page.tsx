'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/features/landing/components/Header';
import { ServicesHero } from '@/features/services/components/ServicesHero';
import { ServiceTabs } from '@/features/services/components/ServiceTabs';
import { PricingSection } from '@/features/services/components/PricingSection';
import { ComparisonTable } from '@/features/services/components/ComparisonTable';
import { FAQSection } from '@/features/services/components/FAQSection';
import { CTASection } from '@/features/services/components/CTASection';

export type ServiceType = 'physiotherapy' | 'swimming';

export interface ServiceTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  animationType: 'medical' | 'fluid';
}

const serviceThemes: Record<ServiceType, ServiceTheme> = {
  physiotherapy: {
    name: 'Physical Therapy',
    primary: '#2563EB', // Brighter blue for better contrast
    secondary: '#059669', // Brighter green
    accent: '#7C3AED',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#111827', // Darker for better contrast
    textMuted: '#4B5563',
    animationType: 'medical'
  },
  swimming: {
    name: 'Swimming',
    primary: '#0284C7', // Brighter blue
    secondary: '#0891B2',
    accent: '#3B82F6',
    background: '#FFFFFF', // Changed to white for better contrast
    surface: '#F8FAFC', // Light gray
    text: '#111827', // Dark text
    textMuted: '#4B5563',
    animationType: 'fluid'
  }
};

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<ServiceType>('physiotherapy');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentTheme = serviceThemes[activeService];

  const handleServiceChange = async (service: ServiceType) => {
    if (service === activeService) return;

    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    setActiveService(service);
    setIsTransitioning(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div
        className="transition-colors duration-500"
        style={{
          backgroundColor: currentTheme.background,
          color: currentTheme.text
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isTransitioning ? 0 : 1,
              y: isTransitioning ? -20 : 0
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ServicesHero
              theme={currentTheme}
              activeService={activeService}
            />

          <ServiceTabs
            activeService={activeService}
            onServiceChange={handleServiceChange}
            theme={currentTheme}
          />

          <PricingSection
            theme={currentTheme}
            activeService={activeService}
          />

          <ComparisonTable
            theme={currentTheme}
            activeService={activeService}
          />

          <FAQSection
            theme={currentTheme}
            activeService={activeService}
          />

          <CTASection
            theme={currentTheme}
            activeService={activeService}
          />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}