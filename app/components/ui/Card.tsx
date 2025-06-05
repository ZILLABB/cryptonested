import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium';
  animate?: boolean;
  delay?: number;
  animationVariant?: 'fade' | 'slide' | 'scale' | 'none';
}

// Animation variants for the card
const cardVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.4
      }
    })
  },
  slide: {
    hidden: { y: 20, opacity: 0 },
    visible: (delay: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: delay,
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    })
  },
  scale: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: (delay: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: delay,
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    })
  },
  none: {
    hidden: {},
    visible: {}
  }
};

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  animate = true,
  delay = 0,
  animationVariant = 'fade'
}: CardProps) {
  if (!animate) {
    return (
      <div className={`${variant === 'premium' ? 'premium-card' : 'theme-card'} p-4 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`${variant === 'premium' ? 'premium-card' : 'theme-card'} p-4 ${className}`}
      initial="hidden"
      animate="visible"
      variants={cardVariants[animationVariant]}
      custom={delay}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <motion.div 
      className={`font-semibold text-lg mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
