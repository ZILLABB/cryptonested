"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent } from './Card';

interface PortfolioSummaryProps {
  totalValue: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
}

// Animation variants
const valueVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: 0.2
    }
  }
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: 0.3 + (i * 0.1)
    }
  })
};

export function PortfolioSummary({ 
  totalValue, 
  dailyChange, 
  weeklyChange, 
  monthlyChange 
}: PortfolioSummaryProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Animate the total value counting up
    const duration = 1500; // ms
    const steps = 20;
    const stepValue = totalValue / steps;
    const stepTime = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setDisplayValue(Math.min(stepValue * current, totalValue));
      
      if (current >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [totalValue]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const stats = [
    { label: '24h Change', value: dailyChange },
    { label: '7d Change', value: weeklyChange },
    { label: '30d Change', value: monthlyChange }
  ];

  return (
    <Card 
      className="w-full" 
      variant="premium" 
      animationVariant="slide"
      delay={0.1}
    >
      <CardHeader className="text-[var(--foreground)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Portfolio Summary
        </motion.div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="mb-4">
            <motion.h3 
              className="text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Total Value
            </motion.h3>
            <AnimatePresence>
              {isLoaded && (
                <motion.p 
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)]"
                  variants={valueVariants}
                  initial="hidden"
                  animate="visible"
                  key="total-value"
                >
                  {formatCurrency(displayValue)}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                custom={index}
                variants={statsVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <h3 className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</h3>
                <p className={`font-medium ${getChangeColor(stat.value)} ${stat.value >= 0 ? 'dark:text-green-400' : 'dark:text-red-400'}`}>
                  {formatPercentage(stat.value)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
