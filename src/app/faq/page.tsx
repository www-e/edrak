import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import FAQSection from '@/components/faq/faq-section';

export const metadata: Metadata = {
  title: 'FAQ | SportologyPlus',
  description: 'Frequently Asked Questions about SportologyPlus - Find answers to common questions about our courses, programs, and services.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="relative">
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}