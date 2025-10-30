'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  background?: string;
  id?: string;
}

const maxWidthClasses = {
  sm: 'max-w-4xl',
  md: 'max-w-6xl', 
  lg: 'max-w-[1000px]',
  xl: 'max-w-[1200px]',
  '2xl': 'max-w-[1400px]',
  full: 'max-w-full'
};

const paddingClasses = {
  none: '',
  sm: 'py-12',
  md: 'py-16',
  lg: 'py-24'
};

export function SectionWrapper({ 
  children, 
  className = '', 
  maxWidth = '2xl',
  padding = 'lg',
  background = '',
  id
}: SectionWrapperProps) {
  return (
    <section 
      id={id}
      className={`${background} ${paddingClasses[padding]} ${className}`}
    >
      <div className={`container mx-auto px-6 ${maxWidthClasses[maxWidth]}`}>
        {children}
      </div>
    </section>
  );
}

interface AnimatedSectionProps extends SectionWrapperProps {
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function AnimatedSection({ 
  children, 
  className = '', 
  maxWidth = '2xl',
  padding = 'lg',
  background = '',
  id,
  delay = 0,
  direction = 'up'
}: AnimatedSectionProps) {
  const directionProps = {
    up: { opacity: 0, y: 20 },
    down: { opacity: 0, y: -20 },
    left: { opacity: 0, x: -20 },
    right: { opacity: 0, x: 20 },
    none: { opacity: 0 }
  };

  const directionValue = directionProps[direction];

  return (
    <motion.section 
      id={id}
      initial={directionValue}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`${background} ${paddingClasses[padding]} ${className}`}
    >
      <div className={`container mx-auto px-6 ${maxWidthClasses[maxWidth]}`}>
        {children}
      </div>
    </motion.section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  center?: boolean;
  badge?: string;
  badgeIcon?: ReactNode;
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  description, 
  center = true,
  badge,
  badgeIcon,
  className = ''
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-16 ${center ? 'text-center' : ''} ${className}`}
    >
      {badge && (
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20">
          {badgeIcon}
          <span>{badge}</span>
        </div>
      )}
      
      {subtitle && (
        <h2 className="text-xl md:text-2xl text-primary font-medium mb-4">
          {subtitle}
        </h2>
      )}

      <h3 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-gray-900">
        {title}
      </h3>

      {description && (
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}

interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
};

const gridGap = {
  sm: 'gap-4',
  md: 'gap-6', 
  lg: 'gap-8'
};

export function Grid({ 
  children, 
  cols = 3, 
  gap = 'lg',
  className = ''
}: GridProps) {
  return (
    <div className={`grid ${gridCols[cols]} ${gridGap[gap]} ${className}`}>
      {children}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  background?: string;
}

export function Card({ 
  children, 
  className = '', 
  hover = true,
  padding = 'lg',
  background = 'bg-white'
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`
        ${background}
        rounded-3xl 
        shadow-lg 
        border border-gray-100
        ${hover ? 'hover:shadow-xl transition-all duration-300' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}