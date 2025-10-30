'use client';

import { motion } from 'framer-motion';
import { CheckCircle, X, Star, Crown, Diamond } from 'lucide-react';

export default function PackagesSection() {
  const packages = [
    {
      name: "Silver",
      tier: "🥈 Silver",
      price: {
        monthly: "495 EGP",
        threeMonths: "1350 EGP",
        sixMonths: "2500 EGP"
      },
      icon: Star,
      color: "from-gray-400 to-gray-500",
      borderColor: "border-gray-200",
      buttonColor: "from-gray-600 to-gray-700",
      features: [
        { name: "Program changes", value: "Once", included: true },
        { name: "Nutritional supplements recommendations", value: "Not available", included: false },
        { name: "WhatsApp inquiries", value: "Response within 7 days", included: true },
        { name: "Video call with nutritionist", value: "Not available", included: false },
        { name: "Professional PDF nutrition report", value: "Included", included: true },
        { name: "Weekly nutrition & sleep recommendations", value: "Not available", included: false },
        { name: "Monthly email follow-up", value: "Not available", included: false },
        { name: "Monthly nutrition follow-up certificate", value: "Not available", included: false }
      ]
    },
    {
      name: "Gold",
      tier: "🥇 Gold",
      price: {
        monthly: "995 EGP",
        threeMonths: "2700 EGP",
        sixMonths: "5000 EGP"
      },
      icon: Crown,
      color: "from-yellow-400 to-yellow-500",
      borderColor: "border-yellow-200",
      buttonColor: "from-yellow-500 to-yellow-600",
      popular: true,
      features: [
        { name: "Program changes", value: "Twice", included: true },
        { name: "Nutritional supplements recommendations", value: "Available", included: true },
        { name: "WhatsApp inquiries", value: "Response within 3 days", included: true },
        { name: "Video call with nutritionist", value: "Once monthly (20 minutes)", included: true },
        { name: "Professional PDF nutrition report", value: "Included", included: true },
        { name: "Weekly nutrition & sleep recommendations", value: "Included", included: true },
        { name: "Monthly email follow-up", value: "Included", included: true },
        { name: "Monthly nutrition follow-up certificate", value: "Included", included: true }
      ]
    },
    {
      name: "Diamond",
      tier: "💎 Diamond",
      price: {
        monthly: "1495 EGP",
        threeMonths: "4000 EGP",
        sixMonths: "7000 EGP"
      },
      icon: Diamond,
      color: "from-blue-400 to-indigo-500",
      borderColor: "border-blue-200",
      buttonColor: "from-blue-600 to-indigo-600",
      features: [
        { name: "Program changes", value: "4 times", included: true },
        { name: "Nutritional supplements recommendations", value: "Available", included: true },
        { name: "WhatsApp inquiries", value: "Response within 1 day", included: true },
        { name: "Video call with nutritionist", value: "4 times monthly (20 minutes)", included: true },
        { name: "Professional PDF nutrition report", value: "Included", included: true },
        { name: "Weekly nutrition & sleep recommendations", value: "Included", included: true },
        { name: "Monthly email follow-up", value: "Included", included: true },
        { name: "Monthly nutrition follow-up certificate", value: "Included", included: true }
      ]
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-gray-900">
            Sportology Plus 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Nutrition Packages</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect package that suits your goals and get comprehensive nutritional support
          </p>
        </motion.div>

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
                    <div className="text-sm text-gray-600">{pkg.price.threeMonths} for 3 months</div>
                    <div className="text-sm text-gray-600">{pkg.price.sixMonths} for 6 months</div>
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
                <button className={`w-full py-4 rounded-2xl bg-gradient-to-r ${pkg.buttonColor} text-white font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                  Get {pkg.name} Package
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}