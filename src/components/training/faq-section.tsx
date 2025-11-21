'use client';

import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
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

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our training programs
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <button
                  className="w-full p-6 text-left hover:bg-gray-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      {openIndex === index ? (
                        <Minus className="w-5 h-5 text-primary" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>
                
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you choose the right training program for your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Contact WhatsApp Support
              </button>
              <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Schedule a Call
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}