'use client';

import { motion } from 'framer-motion';
import { ServiceType, ServiceTheme } from '@/app/services/page';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Shield, Users, Award, Phone } from 'lucide-react';

interface CTASectionProps {
  theme: ServiceTheme;
  activeService: ServiceType;
}

const trustIndicators = [
  { icon: Clock, text: "30-day money-back guarantee" },
  { icon: Shield, text: "Licensed & certified professionals" },
  { icon: Users, text: "5000+ satisfied clients" },
  { icon: Award, text: "Award-winning service quality" }
];

const urgencyTriggers = {
  physiotherapy: {
    headline: "Start Your Recovery Journey Today",
    subheadline: "Don't let pain hold you back any longer. Begin your personalized physical therapy program and experience the difference professional care makes.",
    urgency: "Limited spots available this month - Book your initial consultation now!",
    cta: "Book Free Consultation"
  },
  swimming: {
    headline: "Dive Into Excellence Today",
    subheadline: "Whether you're learning to swim or training for competition, start building your confidence and skills in the water with expert guidance.",
    urgency: "New student special - First month 50% off for new members!",
    cta: "Start Swimming Today"
  }
};

export function CTASection({ theme, activeService }: CTASectionProps) {
  const content = urgencyTriggers[activeService];

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: theme.surface }}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 80%, ${theme.primary}20 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${theme.secondary}20 0%, transparent 50%)`
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <Badge
                  className="w-fit px-4 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: `${theme.primary}15`,
                    color: theme.primary,
                    borderColor: `${theme.primary}30`
                  }}
                >
                  🚀 Special Offer
                </Badge>

                <h2
                  className="text-4xl lg:text-5xl font-bold leading-tight"
                  style={{ color: theme.text }}
                >
                  {content.headline}
                </h2>

                <p
                  className="text-xl leading-relaxed"
                  style={{ color: theme.textMuted }}
                >
                  {content.subheadline}
                </p>

                <div
                  className="p-4 rounded-xl border-l-4"
                  style={{
                    backgroundColor: `${theme.accent}10`,
                    borderColor: theme.accent,
                    color: theme.text
                  }}
                >
                  <p className="font-semibold text-lg mb-2">⚡ Limited Time Offer</p>
                  <p className="text-base">{content.urgency}</p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4">
                {trustIndicators.map((indicator, index) => {
                  const Icon = indicator.icon;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + 0.1 * index, duration: 0.5 }}
                      className="flex items-center space-x-3"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${theme.secondary}15` }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: theme.secondary }}
                        />
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.text }}
                      >
                        {indicator.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: theme.primary,
                    color: 'white'
                  }}
                >
                  {content.cta}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 font-semibold border-2 hover:bg-opacity-10 transition-all duration-300"
                  style={{
                    borderColor: theme.accent,
                    color: theme.accent,
                    backgroundColor: `${theme.accent}10`
                  }}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call for Consultation
                </Button>
              </motion.div>

              <p
                className="text-sm"
                style={{ color: theme.textMuted }}
              >
                ✓ No long-term contracts ✓ Cancel anytime ✓ 100% satisfaction guarantee
              </p>
            </motion.div>

            {/* Right Content - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              {/* What You Get Card */}
              <Card
                className="border-2 shadow-lg"
                style={{
                  borderColor: `${theme.primary}20`,
                  backgroundColor: theme.background
                }}
              >
                <CardContent className="p-6">
                  <h3
                    className="text-xl font-bold mb-4 flex items-center"
                    style={{ color: theme.text }}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" style={{ color: theme.secondary }} />
                    What You will Get
                  </h3>
                  <div className="space-y-3">
                    {activeService === 'physiotherapy' ? (
                      <>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span style={{ color: theme.text }}>Personalized treatment plan</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span style={{ color: theme.text }}>Expert therapist matching</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span style={{ color: theme.text }}>Progress tracking & reports</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span style={{ color: theme.text }}>Home exercise program</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span style={{ color: theme.text }}>Personalized lesson plans</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span style={{ color: theme.text }}>Certified swimming instructors</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span style={{ color: theme.text }}>Technique video analysis</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span style={{ color: theme.text }}>Pool access & equipment</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Success Stats */}
              <Card
                className="border shadow-lg"
                style={{
                  borderColor: `${theme.text}10`,
                  backgroundColor: `${theme.secondary}05`
                }}
              >
                <CardContent className="p-6">
                  <h4
                    className="font-bold mb-4 text-center"
                    style={{ color: theme.text }}
                  >
                    Success Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div
                        className="text-2xl font-bold mb-1"
                        style={{ color: theme.primary }}
                      >
                        95%
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: theme.textMuted }}
                      >
                        Client Satisfaction
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-2xl font-bold mb-1"
                        style={{ color: theme.primary }}
                      >
                        30 days
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: theme.textMuted }}
                      >
                        Average Recovery
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}