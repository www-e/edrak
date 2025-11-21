'use client';

import { motion } from 'framer-motion';
import { CheckCircle, X, Star, Crown, Diamond, Brain } from 'lucide-react';

export default function PsychologyPackages() {
  const packages = [
    {
      name: "Silver",
      tier: "🥈 Silver",
      price: {
        monthly: "400 EGP",
        threeMonths: "999 EGP",
        sixMonths: "Not Available"
      },
      icon: Star,
      color: "from-gray-400 to-gray-500",
      borderColor: "border-gray-200",
      buttonColor: "from-gray-600 to-gray-700",
      features: [
        { name: "Number of psychological sessions", value: "1 session (30 minutes) per month", included: true },
        { name: "WhatsApp support for inquiries", value: "Not available", included: false },
        { name: "Psychological follow-up PDF report", value: "Not available", included: false },
        { name: "Psychological recommendations for athletic performance", value: "Once", included: true },
        { name: "Initial psychological assessment", value: "Included", included: true },
        { name: "Psychologist selection option", value: "Not available", included: false },
        { name: "Discount on additional sessions", value: "Not available", included: false },
        { name: "Psychological support session attendance certificate", value: "Not available", included: false },
        { name: "Pre-competition psychological support session", value: "Not available", included: false },
        { name: "Two-month written psychological support plan", value: "Not available", included: false },
        { name: "Email support between sessions", value: "Not available", included: false }
      ]
    },
    {
      name: "Gold",
      tier: "🥇 Gold",
      price: {
        monthly: "999 EGP",
        threeMonths: "Not Available",
        sixMonths: "Not Available"
      },
      icon: Crown,
      color: "from-yellow-400 to-yellow-500",
      borderColor: "border-yellow-200",
      buttonColor: "from-yellow-500 to-yellow-600",
      popular: true,
      features: [
        { name: "Number of psychological sessions", value: "3 sessions (30 minutes) per month", included: true },
        { name: "WhatsApp support for inquiries", value: "Response within 5 days", included: true },
        { name: "Psychological follow-up PDF report", value: "After the last session", included: true },
        { name: "Psychological recommendations for athletic performance", value: "Weekly", included: true },
        { name: "Initial psychological assessment", value: "Included", included: true },
        { name: "Psychologist selection option", value: "Included", included: true },
        { name: "Discount on additional sessions", value: "10%", included: true },
        { name: "Psychological support session attendance certificate", value: "Included", included: true },
        { name: "Pre-competition psychological support session", value: "Not available", included: false },
        { name: "Two-month written psychological support plan", value: "Not available", included: false },
        { name: "Email support between sessions", value: "Not available", included: false }
      ]
    },
    {
      name: "Diamond",
      tier: "💎 Diamond",
      price: {
        monthly: "2300 EGP",
        threeMonths: "Not Available",
        sixMonths: "Not Available"
      },
      icon: Diamond,
      color: "from-blue-400 to-indigo-500",
      borderColor: "border-blue-200",
      buttonColor: "from-blue-600 to-indigo-600",
      features: [
        { name: "Number of psychological sessions", value: "5 sessions (30 minutes) over 2 months", included: true },
        { name: "WhatsApp support for inquiries", value: "Response within 2 days", included: true },
        { name: "Psychological follow-up PDF report", value: "After each session", included: true },
        { name: "Psychological recommendations for athletic performance", value: "Customized per case", included: true },
        { name: "Initial psychological assessment", value: "Included + detailed results analysis", included: true },
        { name: "Psychologist selection option", value: "With recommendation for best fit", included: true },
        { name: "Discount on additional sessions", value: "20%", included: true },
        { name: "Psychological support session attendance certificate", value: "With case development assessment", included: true },
        { name: "Pre-competition psychological support session", value: "Free (30 minutes)", included: true },
        { name: "Two-month written psychological support plan", value: "Customized per athletic goal", included: true },
        { name: "Email support between sessions", value: "Weekly availability", included: true }
      ]
    }
  ];

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
            Sportology Plus 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Psychology Packages</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the package that suits your mental performance goals and get comprehensive psychological support
          </p>
        </motion.div>

        {/* Why You Need Mental Sports Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-sm border mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-purple-500" />
            Why Do You Need Mental Sports Support?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-2">Build Self-Confidence</h4>
              <p className="text-sm text-muted-foreground">Before competitions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-2">Manage Stress & Pressure</h4>
              <p className="text-sm text-muted-foreground">During training preparation</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-2">Improve Focus & Mental Discipline</h4>
              <p className="text-sm text-muted-foreground">For peak performance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-2">Overcome Psychological Barriers</h4>
              <p className="text-sm text-muted-foreground">After injuries or setbacks</p>
            </div>
          </div>
        </motion.div>

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
                    <div className="text-2xl font-bold text-gray-900">{pkg.price.monthly}<span className="text-sm font-normal text-gray-500">/package</span></div>
                    {pkg.price.threeMonths !== "Not Available" && (
                      <div className="text-sm text-gray-600">{pkg.price.threeMonths} for 3 months</div>
                    )}
                    {pkg.price.sixMonths !== "Not Available" && (
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
                <button className={`w-full py-4 rounded-2xl bg-gradient-to-r ${pkg.buttonColor} text-white font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                  Choose {pkg.name} Package
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Suitable for Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Which Package Is Right For You?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <Star className="w-8 h-8 text-gray-500 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Silver Package</h4>
              <p className="text-sm text-muted-foreground">Beginner athletes starting their mental performance journey</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Gold Package</h4>
              <p className="text-sm text-muted-foreground">Intermediate level (preparing for local championships)</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <Diamond className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Diamond Package</h4>
              <p className="text-sm text-muted-foreground">Professional athletes or first-division teams</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}