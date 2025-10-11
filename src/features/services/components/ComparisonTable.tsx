'use client';

import { motion } from 'framer-motion';
import { ServiceType, ServiceTheme } from '@/app/services/page';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star } from 'lucide-react';

interface ComparisonTableProps {
  theme: ServiceTheme;
  activeService: ServiceType;
}

const comparisonData = {
  physiotherapy: {
    features: [
      {
        category: 'Sessions & Access',
        items: [
          { feature: 'Weekly Sessions', regular: '2', golden: '4', platinum: 'Unlimited' },
          { feature: 'Session Duration', regular: '45 min', golden: '60 min', platinum: '90 min' },
          { feature: 'Emergency Access', regular: false, golden: false, platinum: true },
          { feature: '24/7 Support', regular: false, golden: false, platinum: true }
        ]
      },
      {
        category: 'Treatment & Therapy',
        items: [
          { feature: 'Basic Rehabilitation', regular: true, golden: true, platinum: true },
          { feature: 'Advanced Treatment Modalities', regular: false, golden: true, platinum: true },
          { feature: 'Specialized Therapy Equipment', regular: false, golden: false, platinum: true },
          { feature: 'Aquatic Therapy Access', regular: false, golden: true, platinum: true }
        ]
      },
      {
        category: 'Planning & Monitoring',
        items: [
          { feature: 'Custom Exercise Plans', regular: false, golden: true, platinum: true },
          { feature: 'Progress Tracking', regular: true, golden: true, platinum: true },
          { feature: 'Detailed Progress Reports', regular: false, golden: true, platinum: true },
          { feature: 'Wellness Assessments', regular: true, golden: true, platinum: true }
        ]
      },
      {
        category: 'Support & Guidance',
        items: [
          { feature: 'Email Support', regular: true, golden: true, platinum: true },
          { feature: 'Phone Consultations', regular: false, golden: true, platinum: true },
          { feature: 'Video Call Sessions', regular: false, golden: false, platinum: true },
          { feature: 'Family Member Sessions', regular: false, golden: false, platinum: true }
        ]
      },
      {
        category: 'Additional Benefits',
        items: [
          { feature: 'Exercise Video Library', regular: true, golden: true, platinum: true },
          { feature: 'Nutrition Guidance', regular: false, golden: true, platinum: true },
          { feature: 'Medical Coordination', regular: false, golden: false, platinum: true },
          { feature: 'Spa Treatment Discounts', regular: false, golden: false, platinum: true }
        ]
      }
    ]
  },
  swimming: {
    features: [
      {
        category: 'Training & Lessons',
        items: [
          { feature: 'Weekly Lessons', regular: '2 (Group)', golden: '4 (Private)', platinum: 'Unlimited (Private)' },
          { feature: 'Lesson Duration', regular: '30 min', golden: '45 min', platinum: '60 min' },
          { feature: 'Pool Access', regular: 'Lesson times', golden: 'Extended hours', platinum: '24/7 access' },
          { feature: 'Equipment Provided', regular: false, golden: true, platinum: true }
        ]
      },
      {
        category: 'Technique & Analysis',
        items: [
          { feature: 'Basic Stroke Instruction', regular: true, golden: true, platinum: true },
          { feature: 'Advanced Technique Refinement', regular: false, golden: true, platinum: true },
          { feature: 'Video Analysis Sessions', regular: false, golden: true, platinum: true },
          { feature: 'Underwater Technique Review', regular: false, golden: false, platinum: true }
        ]
      },
      {
        category: 'Training Programs',
        items: [
          { feature: 'Custom Training Plans', regular: false, golden: true, platinum: true },
          { feature: 'Competition Preparation', regular: false, golden: true, platinum: true },
          { feature: 'Mental Performance Coaching', regular: false, golden: false, platinum: true },
          { feature: 'Open Water Training', regular: false, golden: true, platinum: true }
        ]
      },
      {
        category: 'Support & Community',
        items: [
          { feature: 'Online Technique Videos', regular: true, golden: true, platinum: true },
          { feature: 'Coach Consultation Calls', regular: false, golden: true, platinum: true },
          { feature: 'Swimming Community Access', regular: false, golden: true, platinum: true },
          { feature: 'Elite Network Access', regular: false, golden: false, platinum: true }
        ]
      },
      {
        category: 'Additional Benefits',
        items: [
          { feature: 'Safety Certification', regular: true, golden: true, platinum: true },
          { feature: 'Nutrition for Swimmers', regular: false, golden: true, platinum: true },
          { feature: 'Competition Entry Support', regular: false, golden: false, platinum: true },
          { feature: 'Professional Coaching Discount', regular: false, golden: false, platinum: true }
        ]
      }
    ]
  }
};

export function ComparisonTable({ theme, activeService }: ComparisonTableProps) {
  const data = comparisonData[activeService];

  const renderCell = (value: string | boolean, tierName: string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div className="flex justify-center">
          <Check className="w-6 h-6 text-green-600 bg-green-100 rounded-full p-1" />
        </div>
      ) : (
        <div className="flex justify-center">
          <X className="w-6 h-6 text-red-500 bg-red-100 rounded-full p-1" />
        </div>
      );
    }

    if (typeof value === 'string') {
      return (
        <span className="text-sm font-semibold text-center block" style={{ color: theme.text }}>
          {value}
        </span>
      );
    }

    return null;
  };

  return (
    <section className="py-20" style={{ backgroundColor: theme.surface }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
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
              Detailed Feature Comparison
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl max-w-3xl mx-auto"
              style={{ color: theme.textMuted }}
            >
              Compare all features side-by-side to find the perfect plan for your needs.
            </motion.p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="min-w-full"
            >
              {data.features.map((category, categoryIndex) => (
                <div key={category.category} className="mb-12">
                  {/* Category Header */}
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * categoryIndex, duration: 0.5 }}
                    className="text-xl font-bold mb-6 flex items-center space-x-3"
                    style={{ color: theme.primary }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    {category.category}
                  </motion.h3>

                  {/* Features Table */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2"
                       style={{ borderColor: `${theme.primary}20` }}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2" style={{ borderColor: `${theme.primary}20` }}>
                            <th className="text-left py-6 px-6 font-bold text-lg" style={{ color: theme.text }}>
                              Features
                            </th>
                            <th className="text-center py-6 px-4">
                              <div className="space-y-3">
                                <Badge variant="outline" className="border-2 text-sm px-3 py-1" style={{
                                  borderColor: '#10B981',
                                  color: '#059669',
                                  backgroundColor: '#ECFDF5'
                                }}>
                                  Regular
                                </Badge>
                                <div className="text-lg font-bold" style={{ color: '#059669' }}>$99</div>
                              </div>
                            </th>
                            <th className="text-center py-6 px-4 relative">
                              <div className="space-y-3">
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1">
                                  <Star className="w-3 h-3 mr-1" />
                                  Golden
                                </Badge>
                                <div className="text-lg font-bold text-white">$199</div>
                              </div>
                              <div className="absolute -top-3 -right-2">
                                <Badge className="bg-yellow-500 text-white text-xs px-2 py-1">Best Value</Badge>
                              </div>
                            </th>
                            <th className="text-center py-6 px-4">
                              <div className="space-y-3">
                                <Badge variant="outline" className="border-2 text-sm px-3 py-1" style={{
                                  borderColor: '#8B5CF6',
                                  color: '#7C3AED',
                                  backgroundColor: '#F3E8FF'
                                }}>
                                  Platinum
                                </Badge>
                                <div className="text-lg font-bold" style={{ color: '#7C3AED' }}>$349</div>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.items.map((item, itemIndex) => (
                            <motion.tr
                              key={item.feature}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.05 * itemIndex, duration: 0.4 }}
                              className="border-b hover:bg-gray-50 transition-colors"
                              style={{ borderColor: `${theme.primary}10` }}
                            >
                              <td
                                className="py-5 px-6 font-semibold text-base"
                                style={{ color: theme.text }}
                              >
                                {item.feature}
                              </td>
                              <td className="py-5 px-4 text-center bg-green-50">
                                {renderCell(item.regular, 'regular')}
                              </td>
                              <td className="py-5 px-4 text-center bg-gradient-to-b from-yellow-50 to-orange-50 border-x-2"
                                  style={{ borderColor: '#F59E0B' }}>
                                {renderCell(item.golden, 'golden')}
                              </td>
                              <td className="py-5 px-4 text-center bg-purple-50">
                                {renderCell(item.platinum, 'platinum')}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center mt-16"
          >
            <p
              className="text-lg mb-8"
              style={{ color: theme.textMuted }}
            >
              Ready to get started? Choose your plan and begin your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: theme.primary,
                  color: 'white'
                }}
              >
                Start with Regular - $99/month
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-opacity-10 transition-all duration-300"
                style={{
                  borderColor: theme.accent,
                  color: theme.accent,
                  backgroundColor: `${theme.accent}10`
                }}
              >
                Get Golden Plan - $199/month
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}