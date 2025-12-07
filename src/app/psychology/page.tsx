import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import PsychologyHero from '@/components/psychology/psychology-hero';
import PsychologyPackages from '@/components/psychology/psychology-packages';
import PsychologyForm from '@/components/psychology/psychology-form';
import CallToActionSection from '@/components/shared/CallToAction';
import GeneralFAQ from '@/components/shared/GeneralFAQ';

export const metadata: Metadata = {
  title: 'Sports Psychology Consultations | SportologyPlus',
  description: 'Professional sports psychology consultations for athletes - mental performance training, stress management, and confidence building',
};

export default function PsychologyPage() {
  const psychologyFAQs = [
    {
      question: "How do I choose between Silver, Gold, and Diamond psychology packages?",
      answer: "Choose Silver if you're a beginner athlete starting your mental performance journey. Select Gold if you're preparing for local championships and need regular psychological support. Choose Diamond if you're a professional athlete or first-division team member requiring comprehensive psychological support with detailed assessments and personalized plans."
    },
    {
      question: "What happens after I submit the psychology consultation form?",
      answer: "After submitting your application, our certified sports psychologists will review your information and assess your psychological needs. We'll contact you within 24-48 hours to discuss your assessment, recommend the most suitable package, and schedule your first session."
    },
    {
      question: "Are the psychology sessions conducted in person or online?",
      answer: "All psychology sessions are conducted online via Zoom or Google Meet, according to your preference. This flexibility allows you to receive support from anywhere, which is especially beneficial for athletes who travel frequently for competitions."
    },
    {
      question: "Can I upgrade my package after starting?",
      answer: "Yes, you can upgrade to any higher package at any time during your psychological support journey. We offer special discounts when upgrading, and we'll assess your current progress to ensure you get the maximum benefit from the enhanced package."
    },
    {
      question: "What if I'm not satisfied with my assigned psychologist?",
      answer: "Gold and Diamond packages include psychologist selection options. If you're not satisfied with your assigned psychologist, we can reassign you to another specialist who better matches your personality and specific needs."
    },
    {
      question: "How quickly will I see improvements in my mental performance?",
      answer: "Many athletes report feeling more confident and mentally prepared within the first few sessions. However, significant and lasting changes typically become noticeable after 3-4 sessions, depending on your individual goals and commitment to implementing the psychological techniques."
    },
    {
      question: "Do you provide psychological support during competitions?",
      answer: "Yes, the Diamond package includes a free 30-minute pre-competition psychological support session to ensure you're mentally prepared for your most important competitions. Gold package holders also receive weekly psychological recommendations."
    },
    {
      question: "Is my personal information and psychological data kept confidential?",
      answer: "Absolutely. All psychological consultations are conducted under strict confidentiality guidelines. Your personal information, psychological assessments, and session content are protected and shared only with your explicit consent."
    },
    {
      question: "Can psychology consultations be combined with training or nutrition programs?",
      answer: "Yes, we encourage combining psychological support with our training and nutrition programs for a holistic approach to athletic performance. Many athletes find that mental coaching enhances the effectiveness of their physical training."
    },
    {
      question: "What payment methods do you accept for psychology packages?",
      answer: "We accept various payment methods including bank transfers, mobile payment services, and credit cards. Payment details and options will be provided after your consultation application is approved."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <PsychologyHero />
        <div id="packages">
          <PsychologyPackages />
        </div>
        <div id="form">
          <PsychologyForm />
        </div>
        <GeneralFAQ items={psychologyFAQs} title="Sports Psychology FAQ" />
        <CallToActionSection
          title="Ready to Strengthen Your Mental Game?"
          description="Join hundreds of athletes who have transformed their performance through mental coaching. Start your journey to peak psychological performance today."
          badgeText="Mental Performance"
          secondaryButton={{
            text: "Learn More",
            href: "#packages"
          }}
          trustIndicators={[
            { number: "200+", label: "Athletes Coached" },
            { number: "4.9/5", label: "Success Rating" },
            { number: "15+", label: "Expert Psychologists" }
          ]}
          backgroundGradient="from-purple-600 via-pink-500 to-blue-600"
        />
      </main>
      <Footer />
    </div>
  );
}