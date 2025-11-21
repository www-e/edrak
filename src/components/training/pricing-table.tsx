'use client';

import { motion } from 'framer-motion';
import { Check, X, Home, Dumbbell, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingFeature {
  name: string;
  home: boolean | string;
  gym: boolean | string;
  sportSpecific: boolean | string;
}

const pricingFeatures: PricingFeature[] = [
  {
    name: 'Exercise Type',
    home: 'No Equipment',
    gym: 'Using Gym Equipment',
    sportSpecific: 'Sport-Specific (MMA, Swimming, Football...)'
  },
  {
    name: 'Monthly Training Plan',
    home: true,
    gym: true,
    sportSpecific: true
  },
  {
    name: 'Exercise Explanation Videos',
    home: true,
    gym: true,
    sportSpecific: true
  },
  {
    name: 'WhatsApp Support',
    home: 'Reply within 5 days',
    gym: 'Reply within 3 days',
    sportSpecific: 'Reply within 2 days'
  },
  {
    name: 'Initial Fitness Assessment',
    home: false,
    gym: true,
    sportSpecific: true
  },
  {
    name: 'Monthly Training Follow-up PDF Report',
    home: false,
    gym: true,
    sportSpecific: true
  },
  {
    name: 'Body Development Plan by Goal',
    home: false,
    gym: true,
    sportSpecific: true
  },
  {
    name: 'Free Consultation Session with Trainer (Video Call)',
    home: false,
    gym: false,
    sportSpecific: 'Once per month'
  },
  {
    name: 'Training Follow-up Certificate',
    home: false,
    gym: true,
    sportSpecific: true
  },
  {
    name: 'Program Modification Based on Progress',
    home: 'Once per month',
    gym: 'Twice per month',
    sportSpecific: 'Weekly'
  }
];

const pricingTiers = [
  {
    name: 'Home Training',
    icon: Home,
    description: 'For beginners or home training',
    monthly: '600 EGP',
    threeMonths: '1500 EGP',
    sixMonths: '2600 EGP',
    gradient: 'from-blue-500 to-blue-600',
    popular: false
  },
  {
    name: 'Gym Training',
    icon: Dumbbell,
    description: 'For regular gym practitioners',
    monthly: '700 EGP',
    threeMonths: '1750 EGP',
    sixMonths: '3100 EGP',
    gradient: 'from-green-500 to-green-600',
    popular: true
  },
  {
    name: 'Sport-Specific Training',
    icon: Target,
    description: 'For professional athletes or youth teams',
    monthly: '900 EGP',
    threeMonths: '2200 EGP',
    sixMonths: '3700 EGP',
    gradient: 'from-orange-500 to-orange-600',
    popular: false
  }
];

export default function PricingTable() {
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      );
    }
    return <span className="text-sm text-muted-foreground">{value}</span>;
  };

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Training Programs Comparison
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect training program that matches your goals, fitness level, and lifestyle. 
            All programs are designed by certified trainers.
          </p>
        </motion.div>

        {/* Additional Marketing Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-sm border mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">✨ Additional Marketing Benefits</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-semibold">PDF Format</p>
                <p className="text-sm text-muted-foreground">All programs are sent in PDF format, printable or viewable on phone</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-semibold">Certified Trainers</p>
                <p className="text-sm text-muted-foreground">Program design by certified sports trainers</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 transition-all duration-300 hover:scale-105 ${
                tier.popular ? 'border-primary shadow-xl' : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${tier.gradient} text-white mb-4`}>
                  <tier.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground">{tier.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{tier.monthly}</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">3 months:</span>
                    <span className="font-semibold">{tier.threeMonths}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">6 months:</span>
                    <span className="font-semibold">{tier.sixMonths}</span>
                  </div>
                </div>
              </div>

              <Button 
                className={`w-full bg-gradient-to-r ${tier.gradient} text-white border-0 hover:opacity-90`}
                size="lg"
              >
                Choose {tier.name}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Detailed Features Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="text-left p-6 font-semibold">Feature</th>
                  <th className="text-center p-6 font-semibold">Home Training</th>
                  <th className="text-center p-6 font-semibold">Gym Training</th>
                  <th className="text-center p-6 font-semibold">Sport-Specific</th>
                </tr>
              </thead>
              <tbody>
                {pricingFeatures.map((feature, index) => (
                  <motion.tr
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border-t border-gray-200 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-6 font-medium">{feature.name}</td>
                    <td className="p-6 text-center">{renderFeatureValue(feature.home)}</td>
                    <td className="p-6 text-center">{renderFeatureValue(feature.gym)}</td>
                    <td className="p-6 text-center">{renderFeatureValue(feature.sportSpecific)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Who It's For Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Which Program Is Right For You?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <Home className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Home Training</h4>
              <p className="text-sm text-muted-foreground">Beginners or those who prefer home workouts</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <Dumbbell className="w-8 h-8 text-green-500 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Gym Training</h4>
              <p className="text-sm text-muted-foreground">Regular gym practitioners looking for structure</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <Target className="w-8 h-8 text-orange-500 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Sport-Specific</h4>
              <p className="text-sm text-muted-foreground">Professional athletes or youth teams</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}