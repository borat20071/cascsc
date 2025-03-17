import React from 'react';
import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[50vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Loading...
      </p>
    </motion.div>
  );
} 