'use client';

import { motion } from 'framer-motion';
import { ServiceType, ServiceTheme } from '@/app/services/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

interface PricingSectionProps {
  theme: ServiceTheme;
  activeService: ServiceType;
}

const pricingData = {
  physiotherapy: {
    tiers: [
      {
        name: 'Regular',
        price: '$99',
        period: '/month',
        description: 'Essential physical therapy for individuals',
        icon: Check,
        color: '#10B981',
        features: [
          '2 sessions per week',
          'Basic rehabilitation exercises',
          'Progress tracking',
          'Email support',
          'Exercise video library',
          'Basic wellness assessment'
        ],
        popular: false
      },
      {
        name: 'Golden',
        price: '$199',
        period: '/month',
        description: 'Most popular choice for comprehensive care',
        icon: Star,
        color: '#F59E0B',
        features: [
          '4 sessions per week',
          'Advanced rehabilitation programs',
          '1-on-1 consultations',
          'Priority phone support',
          'Custom exercise plans',
          'Nutrition guidance',
          'Progress reports',
          'Home exercise equipment recommendations'
        ],
        popular: true
      },
      {
        name: 'Platinum',
        price: '$349',
        period: '/month',
        description: 'Premium therapy with complete wellness support',
        icon: Crown,
        color: '#8B5CF6',
        features: [
          'Unlimited sessions',
          '24/7 direct therapist access',
          'Advanced treatment modalities',
          'Family member sessions included',
          'Wellness coaching',
          'Preventive care programs',
          'Medical coordination',
          'Spa treatment discounts',
          'Priority emergency access'
        ],
        popular: false
      }
    ]
  },
  swimming: {
    tiers: [
      {
        name: 'Regular',
        price: '$99',
        period: '/month',
        description: 'Perfect for learning and basic training',
        icon: Check,
        color: '#06B6D4',
        features: [
          '2 group lessons per week',
          'Basic stroke techniques',
          'Pool access during lessons',
          'Online technique videos',
          'Progress assessments',
          'Safety certification'
        ],
        popular: false
      },
      {
        name: 'Golden',
        price: '$199',
        period: '/month',
        description: 'Advanced training for serious swimmers',
        icon: Star,
        color: '#3B82F6',
        features: [
          '4 private lessons per week',
          'Advanced stroke refinement',
          'Competition preparation',
          'Video analysis sessions',
          'Training plan customization',
          'Open water swimming guidance',
          'Equipment recommendations',
          'Nutrition for swimmers'
        ],
        popular: true
      },
      {
        name: 'Platinum',
        price: '$349',
        period: '/month',
        description: 'Elite coaching for competitive excellence',
        icon: Crown,
        color: '#EC4899',
        features: [
          'Unlimited private coaching',
          'Elite performance training',
          'Competition strategy',
          'Professional video analysis',
          'Mental performance coaching',
          'Recovery protocols',
          'Travel competition support',
          'Elite swimmer network access',
          'Sponsorship guidance'
        ],
        popular: false
      }
    ]
  }
};

export function PricingSection({ theme, activeService }: PricingSectionProps) {
  const tiers = pricingData[activeService].tiers;

  return (
    <section className="py-20" style={{ backgroundColor: theme.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold mb-6"
              style={{ color: theme.text }}
            >
              Choose Your Perfect Plan
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl max-w-3xl mx-auto"
              style={{ color: theme.textMuted }}
            >
              {activeService === 'physiotherapy'
                ? "Select the therapy plan that matches your rehabilitation needs and wellness goals."
                : "Choose the swimming program that fits your skill level and aquatic aspirations."
              }
            </motion.p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              const isPopular = tier.popular;

              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className={`relative ${isPopular ? 'scale-105' : ''}`}
                >
                  <Card
                    className={`h-full transition-all duration-300 hover:shadow-xl ${
                      isPopular ? 'border-2 shadow-lg' : 'border hover:shadow-md'
                    }`}
                    style={{
                      borderColor: isPopular ? tier.color : `${theme.text}20`,
                      backgroundColor: theme.surface
                    }}
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div
                        className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                      >
                        <Badge
                          className="px-4 py-1 text-sm font-semibold text-white"
                          style={{ backgroundColor: tier.color }}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div
                        className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${tier.color}15` }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: tier.color }}
                        />
                      </div>

                      <CardTitle
                        className="text-2xl font-bold"
                        style={{ color: theme.text }}
                      >
                        {tier.name}
                      </CardTitle>

                      <div className="flex items-center justify-center space-x-1">
                        <span
                          className="text-4xl font-bold"
                          style={{ color: theme.primary }}
                        >
                          {tier.price}
                        </span>
                        <span
                          className="text-lg"
                          style={{ color: theme.textMuted }}
                        >
                          {tier.period}
                        </span>
                      </div>

                      <CardDescription
                        className="text-base"
                        style={{ color: theme.textMuted }}
                      >
                        {tier.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <ul className="space-y-4">
                        {tier.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * featureIndex, duration: 0.4 }}
                            className="flex items-start space-x-3"
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: `${tier.color}20` }}
                            >
                              <Check
                                className="w-3 h-3"
                                style={{ color: tier.color }}
                              />
                            </div>
                            <span
                              className="text-sm leading-relaxed"
                              style={{ color: theme.text }}
                            >
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-6">
                      <Button
                        className={`w-full text-base py-6 font-semibold transition-all duration-300 ${
                          isPopular
                            ? 'shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'hover:shadow-md'
                        }`}
                        style={{
                          backgroundColor: tier.color,
                          color: 'white'
                        }}
                      >
                        Get Started with {tier.name}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-16"
          >
            <p
              className="text-lg mb-6"
              style={{ color: theme.textMuted }}
            >
              All plans include our satisfaction guarantee and can be cancelled anytime.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 font-semibold border-2 hover:bg-opacity-10 transition-all duration-300"
              style={{
                borderColor: theme.accent,
                color: theme.accent,
                backgroundColor: `${theme.accent}10`
              }}
            >
              Compare All Features
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}