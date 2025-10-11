'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceType, ServiceTheme } from '@/app/services/page';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  theme: ServiceTheme;
  activeService: ServiceType;
}

const faqData = {
  physiotherapy: [
    {
      question: "How do I know if physical therapy is right for me?",
      answer: "Physical therapy is beneficial if you're experiencing pain, have limited mobility, recovering from surgery or injury, or want to improve your overall physical performance. Our initial assessment will help determine the best treatment approach for your specific needs."
    },
    {
      question: "What should I expect during my first session?",
      answer: "Your first session includes a comprehensive evaluation of your condition, medical history review, movement assessment, and goal setting. We'll create a personalized treatment plan and may begin with gentle therapeutic techniques to address your immediate needs."
    },
    {
      question: "How long does each therapy session last?",
      answer: "Session duration depends on your plan: Regular (45 minutes), Golden (60 minutes), and Platinum (90 minutes). Treatment time is tailored to your specific needs and energy levels."
    },
    {
      question: "Do you work with insurance companies?",
      answer: "Yes, we work with most major insurance providers. Our administrative team will help verify your coverage and handle the billing process. Platinum members receive additional assistance with insurance coordination."
    },
    {
      question: "Can I continue therapy if I travel frequently?",
      answer: "Absolutely! We offer virtual consultation options and can provide home exercise programs. Platinum members receive priority access to our telehealth services and travel-friendly treatment modifications."
    },
    {
      question: "What if I need to cancel or reschedule?",
      answer: "We understand that life happens. You can cancel or reschedule sessions up to 24 hours in advance. Platinum members enjoy more flexible scheduling options."
    }
  ],
  swimming: [
    {
      question: "I'm not a strong swimmer. Can I still join?",
      answer: "Absolutely! Our Regular plan is perfect for beginners. We start with basic water safety, confidence building, and fundamental swimming skills. Our instructors are trained to work with all skill levels."
    },
    {
      question: "What should I bring to my swimming lessons?",
      answer: "Bring a swimsuit, towel, goggles (we can provide if needed), and a positive attitude! We provide kickboards, pull buoys, and other training equipment. Don't forget to arrive 10-15 minutes early to change and prepare."
    },
    {
      question: "How do you accommodate different age groups?",
      answer: "We offer age-appropriate instruction for children (6+), adults, and seniors. Each group has tailored teaching methods, safety considerations, and progression goals suitable for their developmental stage and physical capabilities."
    },
    {
      question: "Can I train for competitions with your program?",
      answer: "Yes! Our Golden and Platinum plans are designed for competitive swimmers. We provide advanced technique training, competition strategy, mental preparation, and can help prepare you for meets and events."
    },
    {
      question: "What if I'm afraid of water?",
      answer: "Water anxiety is common and completely normal. Our instructors are experienced in helping people overcome fear through gradual, supportive exposure. We never rush the process and always prioritize your comfort and safety."
    },
    {
      question: "Do you offer private or group lessons?",
      answer: "We offer both! Regular plans include group lessons for social learning, while Golden and Platinum plans feature private instruction for personalized attention and faster progress."
    }
  ]
};

export function FAQSection({ theme, activeService }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const faqs = faqData[activeService];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-20" style={{ backgroundColor: theme.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 mb-6"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.primary}15` }}
              >
                <HelpCircle
                  className="w-5 h-5"
                  style={{ color: theme.primary }}
                />
              </div>
              <span
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: theme.primary }}
              >
                Frequently Asked Questions
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold mb-6"
              style={{ color: theme.text }}
            >
              Everything You Need to Know
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl max-w-2xl mx-auto"
              style={{ color: theme.textMuted }}
            >
              Find answers to common questions about our {theme.name.toLowerCase()} services and get started with confidence.
            </motion.p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = openItems.includes(index);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Card
                    className="overflow-hidden transition-all duration-300 hover:shadow-md border"
                    style={{
                      borderColor: `${theme.text}10`,
                      backgroundColor: theme.surface
                    }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => toggleItem(index)}
                      className="w-full p-6 text-left justify-between hover:bg-transparent"
                      style={{ color: theme.text }}
                    >
                      <span className="text-lg font-semibold pr-4">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 flex-shrink-0" />
                      </motion.div>
                    </Button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <CardContent
                            className="pt-0 pb-6 px-6 border-t"
                            style={{
                              borderColor: `${theme.text}10`,
                              color: theme.textMuted
                            }}
                          >
                            <p className="text-base leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-16 p-8 rounded-2xl border"
            style={{
              backgroundColor: `${theme.primary}05`,
              borderColor: `${theme.primary}20`
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: theme.text }}
            >
              Still have questions?
            </h3>
            <p
              className="text-lg mb-6"
              style={{ color: theme.textMuted }}
            >
              Our team is here to help you make the best choice for your {theme.name.toLowerCase()} journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-base px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: theme.primary,
                  color: 'white'
                }}
              >
                Schedule a Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-4 font-semibold border-2 hover:bg-opacity-10 transition-all duration-300"
                style={{
                  borderColor: theme.accent,
                  color: theme.accent,
                  backgroundColor: `${theme.accent}10`
                }}
              >
                Call Us: +1 (555) 123-4567
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}