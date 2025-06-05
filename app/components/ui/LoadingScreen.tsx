"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-[var(--primary-500)] border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-[var(--primary-400)] border-b-transparent border-l-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-[var(--primary-300)] border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl font-semibold text-gray-800 dark:text-gray-200"
        >
          Loading CryptoNested
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-400 mt-2"
        >
          Please wait while we prepare your dashboard...
        </motion.p>
      </motion.div>
    </div>
  );
}
