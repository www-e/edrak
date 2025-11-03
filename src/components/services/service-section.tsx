'use client';

import { motion } from 'framer-motion';
import { Check, Dumbbell, Apple, Brain, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ServiceSectionProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  targetAudience?: string;
  price: string;
  icon: 'dumbbell' | 'apple' | 'brain';
  gradient: string;
  reverse?: boolean;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const iconMap: Record<string, LucideIcon> = {
  dumbbell: Dumbbell,
  apple: Apple,
  brain: Brain,
};

export default function ServiceSection({
  id,
  title,
  subtitle,
  description,
  features,
  targetAudience,
  price,
  icon,
  gradient,
  reverse = false,
  ctaText = "Book Now",
  ctaHref,
  imageSrc,
  imageAlt = "Service illustration"
}: ServiceSectionProps) {
  const Icon = iconMap[icon];

  return (
    <section id={id} className="py-24">
      <div className="container max-w-[1400px] mx-auto px-6">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={reverse ? 'lg:order-2' : ''}
          >
            {/* Icon Badge */}
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-6`}>
              <Icon className="w-8 h-8" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              {title}
            </h2>
            
            <p className="text-xl text-primary font-medium mb-6">
              {subtitle}
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {description}
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4">Service includes:</h3>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Target Audience */}
            {targetAudience && (
              <div className="bg-secondary/50 border border-border rounded-xl p-6 mb-8">
                <h3 className="text-sm font-bold text-foreground mb-2">Target Audience:</h3>
                <p className="text-muted-foreground">{targetAudience}</p>
              </div>
            )}

            {/* Pricing */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-3xl font-bold text-foreground">{price}</p>
              </div>
              {ctaHref ? (
                <Link href={ctaHref}>
                  <Button size="lg" className={`gap-2 bg-gradient-to-r ${gradient} text-white border-0 hover:opacity-90`}>
                    {ctaText}
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className={`gap-2 bg-gradient-to-r ${gradient} text-white border-0 hover:opacity-90`}>
                  {ctaText}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={reverse ? 'lg:order-1' : ''}
          >
            {imageSrc ? (
              /* Image-based visual */
              <div className={`relative aspect-[4/3] rounded-3xl bg-gradient-to-br ${gradient} p-1 group hover:scale-105 transition-transform duration-300`}>
                <div className="w-full h-full rounded-3xl bg-background relative overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover rounded-3xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                
                {/* Floating badge */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon className={`w-12 h-12 bg-gradient-to-br ${gradient} text-transparent bg-clip-text`} />
                </motion.div>
              </div>
            ) : (
              /* Icon-based visual (original design) */
              <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${gradient} p-1 group hover:scale-105 transition-transform duration-300`}>
                <div className="w-full h-full rounded-3xl bg-background p-12 flex items-center justify-center">
                  <Icon className={`w-full h-full text-transparent bg-clip-text bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon className={`w-12 h-12 bg-gradient-to-br ${gradient} text-transparent bg-clip-text`} />
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
