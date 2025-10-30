'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Common animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6 }
};

// Stagger container for multiple items
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Stagger child items
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

// Common animation durations
export const animations = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.8
};

// Motion wrapper components for common patterns
interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  viewport?: boolean;
}

export function FadeInUp({ 
  children, 
  className = '', 
  delay = 0,
  viewport = true 
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={viewport ? { once: true } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ 
  children, 
  className = '', 
  delay = 0,
  viewport = true 
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={viewport ? { once: true } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ 
  children, 
  className = '', 
  delay = 0,
  viewport = true 
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={viewport ? { once: true } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInRight({ 
  children, 
  className = '', 
  delay = 0,
  viewport = true 
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={viewport ? { once: true } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ 
  children, 
  className = '', 
  delay = 0,
  viewport = true 
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={viewport ? { once: true } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger wrapper for lists
interface StaggerWrapperProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerWrapper({ 
  children, 
  className = '', 
  staggerDelay = 0.1 
}: StaggerWrapperProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className = '' 
}: MotionWrapperProps) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}