import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import TrainingHero from '@/components/training/training-hero';
import PricingTable from '@/components/training/pricing-table';
import SubscriptionForm from '@/components/training/subscription-form';
import CallToActionSection from '@/components/training/call-to-action-section';
import GeneralFAQ from '@/components/shared/GeneralFAQ';

export const metadata: Metadata = {
  title: 'Training Programs | SportologyPlus',
  description: 'Professional training programs for all levels - home training, gym training, and sport-specific programs with certified trainers',
};

export default function TrainingPage() {
  const trainingFAQs = [
    {
      question: "How do I choose between home training, gym training, and sport-specific programs?",
      answer: "Choose home training if you're a beginner or prefer exercising at home without equipment. Select gym training if you have access to a gym and want to use professional equipment. Choose sport-specific training if you're a professional athlete or part of a youth team that needs specialized training for a particular sport like MMA, swimming, or football."
    },
    {
      question: "What happens after I submit the form?",
      answer: "After submitting your application form, our certified trainers will review your information and create a customized training program based on your goals, fitness level, and preferences. We'll contact you within 24-48 hours to discuss your program and payment options."
    },
    {
      question: "Can I switch between training programs?",
      answer: "Yes, you can modify your program based on progress. Home training allows modifications once per month, gym training allows modifications twice per month, and sport-specific training allows weekly modifications based on your development."
    },
    {
      question: "Are the training videos in Arabic or English?",
      answer: "All exercise explanation videos are provided in Arabic to ensure clear understanding of proper form and technique. However, we also provide written instructions and diagrams when helpful."
    },
    {
      question: "What if I don't see results?",
      answer: "Our trainers monitor your progress regularly and adjust your program accordingly. You'll receive monthly progress reports (for gym and sport-specific programs) and have access to WhatsApp support for questions and guidance. If you're not seeing results, we'll modify your program to better suit your needs."
    },
    {
      question: "Do I need any equipment for home training?",
      answer: "No, home training programs are designed specifically to require no equipment. All exercises use bodyweight movements that can be performed safely in your home space."
    },
    {
      question: "How quickly will I receive my program after payment?",
      answer: "Once payment is confirmed, you'll receive your personalized training program within 24-48 hours via email in PDF format. The program includes detailed exercise descriptions, videos, and your personalized schedule."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including bank transfers, mobile payment services, and credit cards. Payment details will be provided after your application is approved."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a satisfaction guarantee. If you're not happy with your program within the first week, we can provide adjustments or discuss refund options on a case-by-case basis."
    },
    {
      question: "Do you provide nutrition advice with the training programs?",
      answer: "While our training programs focus primarily on exercise, we do provide general nutritional guidance. For detailed nutrition plans, we recommend our separate nutrition programs which can be combined with your training program."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <TrainingHero />
        <div id="packages">
          <PricingTable />
        </div>
        <div id="form">
          <SubscriptionForm />
        </div>
        <GeneralFAQ items={trainingFAQs} title="Training Programs FAQ" />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}