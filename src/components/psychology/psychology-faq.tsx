import UnifiedFAQ from '@/components/shared/UnifiedFAQ';

export default function PsychologyFAQ() {
  const faqs = [
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
    <UnifiedFAQ
      items={faqs}
      layout="simple"
      title="Sports Psychology FAQ"
      description="Find answers to the most common questions about our sports psychology consultations"
      className="bg-gray-50/50"
    />
  );
}