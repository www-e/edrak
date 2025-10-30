'use client';

import { motion } from 'framer-motion';

interface FloatingShape {
  size: string;
  position: string;
  color: string;
  blur: string;
  duration: number;
  delay?: number;
}

interface FloatingShapesProps {
  shapes?: FloatingShape[];
  className?: string;
}

const defaultShapes: FloatingShape[] = [
  {
    size: 'w-80 h-80',
    position: 'top-20 right-[10%]',
    color: 'from-primary/20 to-green-300/20',
    blur: 'blur-3xl',
    duration: 12
  },
  {
    size: 'w-96 h-96',
    position: 'bottom-20 left-[15%]',
    color: 'from-green-400/20 to-primary/20',
    blur: 'blur-3xl',
    duration: 15
  },
  {
    size: 'w-64 h-64',
    position: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    color: 'from-green-200/30 to-primary/30',
    blur: 'blur-2xl',
    duration: 10
  }
];

export default function FloatingShapes({ 
  shapes = defaultShapes,
  className = ''
}: FloatingShapesProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.position} ${shape.size} bg-gradient-to-r ${shape.color} rounded-full ${shape.blur}`}
          animate={{
            scale: shape.duration <= 10 ? [1, 1.4, 1] : [1, 1.3, 1],
            opacity: shape.duration <= 10 ? [0.1, 0.3, 0.1] : [0.2, 0.5, 0.2],
            rotate: shape.duration <= 10 ? [0, 0, 0] : [0, 90, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay || 0
          }}
        />
      ))}
    </div>
  );
}

// Convenience component for common shape patterns
export const NutritionShapes = () => (
  <FloatingShapes
    shapes={[
      {
        size: 'w-80 h-80',
        position: 'top-20 right-[10%]',
        color: 'from-green-400/20 to-blue-300/20',
        blur: 'blur-3xl',
        duration: 12
      },
      {
        size: 'w-96 h-96',
        position: 'bottom-20 left-[15%]',
        color: 'from-emerald-500/20 to-primary/20',
        blur: 'blur-3xl',
        duration: 15
      },
      {
        size: 'w-64 h-64',
        position: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        color: 'from-green-200/30 to-emerald-400/30',
        blur: 'blur-2xl',
        duration: 10
      }
    ]}
  />
);

export const ServicesShapes = () => (
  <FloatingShapes
    shapes={[
      {
        size: 'w-80 h-80',
        position: 'top-20 right-[10%]',
        color: 'from-primary/20 to-green-300/20',
        blur: 'blur-3xl',
        duration: 12
      },
      {
        size: 'w-96 h-96',
        position: 'bottom-20 left-[15%]',
        color: 'from-accent/20 to-blue-300/20',
        blur: 'blur-3xl',
        duration: 15
      },
      {
        size: 'w-64 h-64',
        position: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        color: 'from-green-200/30 to-primary/30',
        blur: 'blur-2xl',
        duration: 10
      }
    ]}
  />
);

export const LandingShapes = () => (
  <FloatingShapes
    shapes={[
      {
        size: 'w-64 h-64',
        position: 'top-20 left-[10%]',
        color: 'bg-white/10',
        blur: 'blur-2xl',
        duration: 8
      },
      {
        size: 'w-80 h-80',
        position: 'bottom-20 right-[15%]',
        color: 'bg-white/5',
        blur: 'blur-3xl',
        duration: 10
      }
    ]}
  />
);