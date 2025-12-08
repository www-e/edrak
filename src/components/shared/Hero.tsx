'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: ReactNode;
  iconEmoji?: string;
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
  }>;
  primaryButton?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryButton?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  backgroundGradient?: string;
  iconBackgroundColor?: string;
  className?: string;
  children?: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
}

export default function Hero({
  title,
  subtitle,
  description,
  icon,
  iconEmoji,
  breadcrumbItems,
  primaryButton,
  secondaryButton,
  backgroundGradient = 'from-primary/10 to-green-100/50',
  iconBackgroundColor = 'bg-primary/10',
  className = '',
  children,
  imageUrl,
  imageAlt
}: HeroProps) {
  return (
    <section className={`relative overflow-hidden pt-32 pb-24 bg-gradient-to-br ${backgroundGradient} ${className}`}>
      {/* Enhanced floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-[10%] w-80 h-80 bg-gradient-to-r from-primary/20 to-green-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-[15%] w-96 h-96 bg-gradient-to-r from-green-400/20 to-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-200/30 to-primary/30 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Enhanced Breadcrumb */}
        {breadcrumbItems && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 text-sm text-muted-foreground mb-12"
          >
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {item.href ? (
                  <Link href={item.href} className="hover:text-primary transition-colors font-medium px-3 py-1 rounded-full hover:bg-primary/5">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {item.label}
                  </span>
                )}
                {index < breadcrumbItems.length - 1 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            ))}
          </motion.nav>
        )}

        {/* Enhanced Hero content with grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${iconBackgroundColor} text-primary text-sm font-semibold mb-8 border border-primary/20`}
            >
              {iconEmoji && <span className="text-3xl animate-bounce">{iconEmoji}</span>}
              {icon}
              <span>{subtitle || 'Service'}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight"
            >
              <span className="text-gray-900">{title.split(' ').slice(0, -1).join(' ')}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-600 to-primary mt-2 animate-pulse">
                {title.split(' ').slice(-1)[0]}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl"
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            {(primaryButton || secondaryButton) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {primaryButton && primaryButton.href ? (
                  <Link href={primaryButton.href} className="px-6 py-3 bg-gradient-to-r from-primary to-green-600 text-white font-bold rounded-2xl hover:from-primary/90 hover:to-green-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center">
                    {primaryButton.text}
                  </Link>
                ) : primaryButton ? (
                  <button
                    onClick={primaryButton.onClick}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-green-600 text-white font-bold rounded-2xl hover:from-primary/90 hover:to-green-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {primaryButton.text}
                  </button>
                ) : null}

                {secondaryButton && secondaryButton.href ? (
                  <Link href={secondaryButton.href} className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-primary/20 text-primary font-bold rounded-2xl hover:bg-white hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl text-center">
                    {secondaryButton.text}
                  </Link>
                ) : secondaryButton ? (
                  <button
                    onClick={secondaryButton.onClick}
                    className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-primary/20 text-primary font-bold rounded-2xl hover:bg-white hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {secondaryButton.text}
                  </button>
                ) : null}
              </motion.div>
            )}

            {/* Additional content */}
            {children}
          </div>

          {/* Hero image */}
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex justify-center"
            >
              <Image
                src={imageUrl}
                alt={imageAlt || 'Hero Image'}
                width={600}
                height={400}
                className="w-full h-auto max-w-full rounded-2xl shadow-xl"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}