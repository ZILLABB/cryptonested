"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent } from './Card';

interface CryptoHolding {
  id: number;
  name: string;
  symbol: string;
  quantity: number;
  price: number;
  value: number;
  change: number;
  allocation: number;
}

interface CryptoHoldingsProps {
  holdings: CryptoHolding[];
}

// Animation variants
const tableHeaderVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { delay: 0.2 }
  }
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + (i * 0.05),
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }),
  hover: { 
    backgroundColor: 'rgba(var(--primary-500-rgb), 0.05)',
    transition: { duration: 0.2 }
  }
};

const progressBarVariants = {
  hidden: { width: 0 },
  visible: (width: number) => ({
    width: `${Math.min(100, width)}%`,
    transition: { 
      delay: 0.5,
      duration: 0.8,
      ease: 'easeOut'
    }
  })
};

export function CryptoHoldings({ holdings }: CryptoHoldingsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <Card 
      className="w-full" 
      variant="premium"
      animationVariant="slide"
      delay={0.2}
    >
      <CardHeader className="text-[var(--foreground)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          My Holdings
        </motion.div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <motion.thead
              variants={tableHeaderVariants}
              initial="hidden"
              animate="visible"
            >
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Asset</th>
                <th className="text-right pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                <th className="text-right pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Holdings</th>
                <th className="text-right pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Value</th>
                <th className="text-right pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Change</th>
                <th className="text-right pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Allocation</th>
              </tr>
            </motion.thead>
            <AnimatePresence>
              {isLoaded && (
                <tbody>
                  {holdings.map((holding, index) => (
                    <motion.tr 
                      key={holding.id} 
                      className="border-b border-gray-100 dark:border-gray-800 transition-colors"
                      variants={tableRowVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <td className="py-4">
                        <div className="flex items-center">
                          <motion.div 
                            className="ml-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + (index * 0.05) }}
                          >
                            <div className="font-medium">{holding.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{holding.symbol}</div>
                          </motion.div>
                        </div>
                      </td>
                      <td className="py-4 text-right">{formatCurrency(holding.price)}</td>
                      <td className="py-4 text-right">{holding.quantity.toLocaleString('en-US', { maximumFractionDigits: 8 })}</td>
                      <td className="py-4 text-right font-medium">{formatCurrency(holding.value)}</td>
                      <td className={`py-4 text-right ${getChangeColor(holding.change)} ${holding.change >= 0 ? 'dark:text-green-400' : 'dark:text-red-400'}`}>
                        {formatPercentage(holding.change)}
                      </td>
                      <td className="py-4 text-right">
                        <div className="inline-flex items-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2 overflow-hidden">
                            <motion.div 
                              className={`h-2 rounded-full ${holding.change >= 0 ? 'bg-[var(--primary-500)]' : 'bg-red-500'}`} 
                              variants={progressBarVariants}
                              custom={holding.allocation * 2}
                              initial="hidden"
                              animate="visible"
                            ></motion.div>
                          </div>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 + (index * 0.05) }}
                          >
                            {holding.allocation.toFixed(1)}%
                          </motion.span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              )}
            </AnimatePresence>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
