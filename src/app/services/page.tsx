'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/features/landing/components/Header';
import { ServicesOverview } from '@/features/services/components/ServicesOverview';
import { CoursesSection } from '@/features/services/components/CoursesSection';
import { TrainingSection } from '@/features/services/components/TrainingSection';
import { NutritionSection } from '@/features/services/components/NutritionSection';
import { PsychologicalSection } from '@/features/services/components/PsychologicalSection';
import { ContentSection } from '@/features/services/components/ContentSection';
import { EmploymentSection } from '@/features/services/components/EmploymentSection';
import { ServicesClosing } from '@/features/services/components/ServicesClosing';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
            <span>/</span>
            <span className="text-gray-900">خدماتنا</span>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">🏆 خدماتنا</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
            حلول متكاملة لكل الرياضيين – من التعلم إلى التدريب والتوظيف<br />
            كل ما تحتاجه لتطورك الرياضي في منصة واحدة تجمع العلم، الخبرة، والدعم المستمر.
          </p>
        </motion.section>

        <ServicesOverview />
        <CoursesSection />
        <TrainingSection />
        <NutritionSection />
        <PsychologicalSection />
        <ContentSection />
        <EmploymentSection />
        <ServicesClosing />
      </div>
    </div>
  );
}