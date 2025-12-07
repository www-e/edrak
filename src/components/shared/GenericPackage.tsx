'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PackageFeature {
  name: string;
  value: string;
  included: boolean;
}

interface PackageData {
  name: string;
  tier: string;
  price: {
    monthly: string;
    threeMonths?: string;
    sixMonths?: string;
  };
  icon: LucideIcon;
  color: string;
  borderColor: string;
  buttonColor: string;
  popular?: boolean;
  features: PackageFeature[];
}

interface GenericPackageProps {
  title: string;
  description: string;
  packages: PackageData[];
  subtitleGradient?: string;
  showPackageReasons?: boolean;
  packageReasons?: {
    name: string;
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  suitableForTitle?: string;
  suitableForItems?: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
}

export default function GenericPackage({
  title,
  description,
  packages,
  subtitleGradient = 'from-primary to-secondary',
  showPackageReasons = false,
  packageReasons = [],
  suitableForTitle = "Which Package Is Right For You?",
  suitableForItems = []
}: GenericPackageProps) {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-gray-900">
            {title.split(' ').slice(0, -1).join(' ')}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${subtitleGradient}`}>
              {title.split(' ').slice(-1)[0]}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Optional Package Reasons Section */}
        {showPackageReasons && packageReasons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm border mb-16"
          >
            <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-3">
              {packageReasons[0] && packageReasons[0].icon !== undefined ?
                React.createElement(packageReasons[0].icon as React.ComponentType<React.SVGProps<SVGElement>>, { key: "package-reason-icon", className: "w-8 h-8 text-primary" }) : null}
              {title.replace('Packages', 'Reasons').replace('Comparison', 'Reasons')}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packageReasons.map((reason, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <reason.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{reason.title}</h4>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Package Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl border-2 ${pkg.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 ${pkg.popular ? 'transform scale-105 lg:scale-110' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Package Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${pkg.color} shadow-lg mb-4`}>
                    <pkg.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-2 text-gray-900">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{pkg.tier}</p>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">{pkg.price.monthly}<span className="text-sm font-normal text-gray-500">/month</span></div>
                    {pkg.price.threeMonths && (
                      <div className="text-sm text-gray-600">{pkg.price.threeMonths} for 3 months</div>
                    )}
                    {pkg.price.sixMonths && (
                      <div className="text-sm text-gray-600">{pkg.price.sixMonths} for 6 months</div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                        <div className={`text-xs ${feature.included ? 'text-gray-600' : 'text-gray-400'}`}>
                          {feature.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button className={`w-full py-4 rounded-2xl bg-gradient-to-r ${pkg.buttonColor} text-white font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                  Get {pkg.name} Package
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Suitable for Section */}
        {suitableForItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold mb-8">{suitableForTitle}</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {suitableForItems.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border">
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}