'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingIntroProps {
  onComplete?: () => void;
}

export default function LoadingIntro({ onComplete }: LoadingIntroProps) {
  const [counter, setCounter] = useState(0);
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';

    // Faster loading animation - reduce from 2 seconds to 1 second for instant feel
    const duration = 1000; // 1 second
    const steps = 100;
    const interval = duration / steps;

    let currentCount = 0;
    const counterInterval = setInterval(() => {
      currentCount += 1;
      setCounter(currentCount);

      if (currentCount >= 100) {
        clearInterval(counterInterval);
        // Minimal delay before exiting
        setTimeout(() => {
          setShouldExit(true);
        }, 200);
      }
    }, interval);

    return () => {
      clearInterval(counterInterval);
      document.body.style.overflow = '';
    };
  }, []);

  // Handle exit animation complete
  const handleExitComplete = () => {
    document.body.style.overflow = '';
    onComplete?.();
  };

  if (shouldExit) {
    return (
      <motion.div
        className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onAnimationComplete={handleExitComplete}
      >
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold font-heading text-primary mb-8">
            SportologyPlus
          </h1>
          <div className="text-4xl font-mono text-primary">100%</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center">
        {/* Animated text */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold font-heading text-primary mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        >
          {'SportologyPlus'.split('').map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.05,
                ease: [0.33, 1, 0.68, 1]
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Counter */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-4xl font-mono text-primary">{counter}</div>
          <span className="text-2xl text-muted-foreground">%</span>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-80 h-1 bg-gray-200 mx-auto overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${counter}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
