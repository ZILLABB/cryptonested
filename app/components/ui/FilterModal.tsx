import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpDown, DollarSign, PercentIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './Button';

// Define filter types
type SortOption = 'rank' | 'name' | 'price' | 'change' | 'marketCap' | 'volume';
type SortDirection = 'asc' | 'desc';
type PriceRange = { min: number; max: number } | null;
type ChangeRange = { min: number; max: number } | null;

interface FilterOptions {
  sortBy: SortOption;
  sortDirection: SortDirection;
  priceRange: PriceRange;
  changeRange: ChangeRange;
  showPositiveChangeOnly: boolean;
  showNegativeChangeOnly: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: FilterOptions;
  onApplyFilters: (options: FilterOptions) => void;
}

export function FilterModal({ isOpen, onClose, filterOptions, onApplyFilters }: FilterModalProps) {
  // Local state for filter options (to avoid changing parent state until Apply is clicked)
  const [localOptions, setLocalOptions] = useState<FilterOptions>({ ...filterOptions });
  
  // Handle sort option change
  const handleSortByChange = (sortBy: SortOption) => {
    setLocalOptions(prev => ({ ...prev, sortBy }));
  };
  
  // Handle sort direction change
  const toggleSortDirection = () => {
    setLocalOptions(prev => ({
      ...prev,
      sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Handle price range change
  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setLocalOptions(prev => ({
      ...prev,
      priceRange: {
        min: field === 'min' ? numValue : prev.priceRange?.min || 0,
        max: field === 'max' ? numValue : prev.priceRange?.max || 100000
      }
    }));
  };
  
  // Handle change range change
  const handleChangeRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setLocalOptions(prev => ({
      ...prev,
      changeRange: {
        min: field === 'min' ? numValue : prev.changeRange?.min || -100,
        max: field === 'max' ? numValue : prev.changeRange?.max || 100
      }
    }));
  };
  
  // Toggle price range filter
  const togglePriceRangeFilter = () => {
    setLocalOptions(prev => ({
      ...prev,
      priceRange: prev.priceRange ? null : { min: 0, max: 100000 }
    }));
  };
  
  // Toggle change range filter
  const toggleChangeRangeFilter = () => {
    setLocalOptions(prev => ({
      ...prev,
      changeRange: prev.changeRange ? null : { min: -100, max: 100 }
    }));
  };
  
  // Toggle positive change only filter
  const togglePositiveChangeOnly = () => {
    setLocalOptions(prev => {
      // If turning on positive change, turn off negative change
      const showNegativeChangeOnly = prev.showPositiveChangeOnly ? prev.showNegativeChangeOnly : false;
      
      return {
        ...prev,
        showPositiveChangeOnly: !prev.showPositiveChangeOnly,
        showNegativeChangeOnly
      };
    });
  };
  
  // Toggle negative change only filter
  const toggleNegativeChangeOnly = () => {
    setLocalOptions(prev => {
      // If turning on negative change, turn off positive change
      const showPositiveChangeOnly = prev.showNegativeChangeOnly ? prev.showPositiveChangeOnly : false;
      
      return {
        ...prev,
        showNegativeChangeOnly: !prev.showNegativeChangeOnly,
        showPositiveChangeOnly
      };
    });
  };
  
  // Handle apply filters
  const handleApplyFilters = () => {
    onApplyFilters(localOptions);
    onClose();
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    const resetOptions: FilterOptions = {
      sortBy: 'rank',
      sortDirection: 'asc',
      priceRange: null,
      changeRange: null,
      showPositiveChangeOnly: false,
      showNegativeChangeOnly: false
    };
    
    setLocalOptions(resetOptions);
    onApplyFilters(resetOptions);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filter & Sort</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Sort Options */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <ArrowUpDown className="h-5 w-5 mr-2" />
                  Sort By
                </h3>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { value: 'rank', label: 'Rank' },
                    { value: 'name', label: 'Name' },
                    { value: 'price', label: 'Price' },
                    { value: 'change', label: '24h %' },
                    { value: 'marketCap', label: 'Market Cap' },
                    { value: 'volume', label: 'Volume' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`py-2 px-3 rounded-lg border ${
                        localOptions.sortBy === option.value
                          ? 'bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 border-[var(--primary-500)] text-[var(--primary-600)] dark:text-[var(--primary-400)]'
                          : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleSortByChange(option.value as SortOption)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center">
                  <span className="mr-3">Direction:</span>
                  <button
                    className="flex items-center py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={toggleSortDirection}
                  >
                    {localOptions.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                    <ArrowUpDown className={`h-4 w-4 ml-2 ${localOptions.sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Price Range
                  </h3>
                  <button
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      localOptions.priceRange ? 'bg-[var(--primary-500)]' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    onClick={togglePriceRangeFilter}
                  >
                    <span
                      className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        localOptions.priceRange ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
                
                {localOptions.priceRange && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Min ($)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                        value={localOptions.priceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Max ($)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                        value={localOptions.priceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Change Range Filter */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <PercentIcon className="h-5 w-5 mr-2" />
                    24h Change Range
                  </h3>
                  <button
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      localOptions.changeRange ? 'bg-[var(--primary-500)]' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    onClick={toggleChangeRangeFilter}
                  >
                    <span
                      className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        localOptions.changeRange ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
                
                {localOptions.changeRange && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Min (%)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                        value={localOptions.changeRange.min}
                        onChange={(e) => handleChangeRangeChange('min', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Max (%)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                        value={localOptions.changeRange.max}
                        onChange={(e) => handleChangeRangeChange('max', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick Filters */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Quick Filters</h3>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`flex items-center py-2 px-4 rounded-lg border ${
                      localOptions.showPositiveChangeOnly
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={togglePositiveChangeOnly}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Gainers Only
                  </button>
                  
                  <button
                    className={`flex items-center py-2 px-4 rounded-lg border ${
                      localOptions.showNegativeChangeOnly
                        ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={toggleNegativeChangeOnly}
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Losers Only
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
