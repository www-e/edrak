import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import ServicesHero from '@/components/services/services-hero';
import EcosystemGrid from '@/components/services/ecosystem-grid';
import CourseShowcase from '@/components/services/course-showcase';
import ServiceSection from '@/components/services/service-section';
import ContentMediaSection from '@/components/services/content-media-section';
import EmploymentSection from '@/components/services/employment-section';

export const metadata: Metadata = {
  title: 'Our Services | SportologyPlus',
  description: 'Comprehensive solutions for all athletes – from learning to training and employment',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <ServicesHero />
        <EcosystemGrid />
        <CourseShowcase />

        <ServiceSection
          id="training"
          title="Personal Training & Sports Programs"
          subtitle="Customized training plans for your level and goals"
          description="Get a training program designed specifically for you, supervised by a personal trainer who follows you step by step to achieve the best possible results."
          features={[
            'Comprehensive physical assessment',
            'Weekly customized training program',
            'Continuous monitoring',
            'Monthly progress reports'
          ]}
          targetAudience="Amateur and professional athletes in any sport, and those looking to improve fitness or lose weight"
          price="Starting from 500 EGP per month"
          icon="dumbbell"
          gradient="from-primary to-blue-500"
          reverse={false}
        />

        <ServiceSection
          id="nutrition"
          title="Customized Nutrition Programs"
          subtitle="Scientific diet that suits your athletic goal"
          description="Balanced nutrition plans designed by sports nutrition specialists, based on the latest studies to ensure optimal performance and energy."
          features={[
            'Monthly nutrition plan that changes weekly',
            'Continuous monitoring and adjustments based on results',
            'Safe dietary supplement guidance'
          ]}
          price="Starting from 500 EGP per month"
          icon="apple"
          gradient="from-green-500 to-emerald-600"
          reverse={true}
        />

        <ServiceSection
          id="psychology"
          title="Sports Psychology Consultations"
          subtitle="Develop your mental strength like your physical strength"
          description="Sports success starts from the mind. We offer psychological and sports support sessions to help you deal with pressure, anxiety, and competition challenges."
          features={[
            'Individual online sessions with specialists',
            'Stress and anxiety management techniques',
            'Sports confidence building programs'
          ]}
          price="Starting from 500 EGP per session"
          icon="brain"
          gradient="from-purple-500 to-pink-500"
          reverse={false}
        />

        <ContentMediaSection />
        <EmploymentSection />
      </main>
      <Footer />
    </div>
  );
}
