import UnifiedFAQ from '@/components/shared/UnifiedFAQ';

export default function FAQSection() {
  const faqs = [
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
    <UnifiedFAQ
      items={faqs}
      layout="simple"
      title="Frequently Asked Questions"
      description="Find answers to the most common questions about our nutrition programs"
    />
  );
}