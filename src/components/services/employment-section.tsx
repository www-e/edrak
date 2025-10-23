'use client';

import { motion } from 'framer-motion';
import { Briefcase, UserPlus, FileCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
  {
    icon: UserPlus,
    title: 'Create a Professional Profile',
    description: 'We help you build a distinguished profile that highlights your skills and experience'
  },
  {
    icon: FileCheck,
    title: 'Direct Connection with Sports Organizations',
    description: 'We connect you with clubs and sports institutions looking for talents'
  },
  {
    icon: TrendingUp,
    title: 'Professional Skills Development Workshops',
    description: 'Training programs to enhance your opportunities in the sports job market'
  }
];

const targetRoles = [
  'Sports Coach',
  'Sports Nutrition Specialist',
  'Physical Performance Expert',
  'Recovery and Rehabilitation Specialist',
  'Sports Manager',
  'Performance Analyst'
];

export default function EmploymentSection() {
  return (
    <section id="employment" className="py-32 relative overflow-hidden">
      <div className="container max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 text-sm font-medium mb-6">
              <span className="text-xl">💼</span>
              <span>Sports Employment Services</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Connect You with Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 mt-2">
                Opportunity in Sports
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Whether you are a coach, nutrition specialist, or physical performance expert – we help you find job opportunities that match your skills in sports institutions and clubs.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/60 border border-border hover:border-indigo-500/50 hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium mb-3">
                    Limited Time Offer
                  </div>
                  <p className="text-2xl font-bold mb-1">Free</p>
                  <p className="text-white/80 text-sm">For New Users</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm mb-1">Professional Plan</p>
                  <p className="text-2xl font-bold">200 EGP/Year</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-0 hover:opacity-90" asChild>
              <Link href="/employment">
                <span>Register Now for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right: Target Roles Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/60 border border-border rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-heading">Available Jobs</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {targetRoles.map((role, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="px-4 py-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center hover:bg-indigo-500/10 transition-colors cursor-pointer"
                    >
                      <p className="text-sm font-medium text-foreground">{role}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                  {[
                    { value: '500+', label: 'Job Opportunities' },
                    { value: '150+', label: 'Clubs & Institutions' },
                    { value: '95%', label: 'Employment Rate' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 top-8 -right-8 w-full h-full rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 blur-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Final CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Start Your Sports Journey Today with SportologyPlus
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Whether you are at the beginning of your journey or at the peak of your professionalism, we are here to be your partner in every step.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link href="/courses">
                  <span>Browse Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
