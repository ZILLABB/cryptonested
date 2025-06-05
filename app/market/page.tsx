"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import DashboardWrapper from '../components/DashboardWrapper';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Star, StarOff, ArrowUpDown, Filter, TrendingUp, TrendingDown, BarChart3, Loader2, Award, Bell } from 'lucide-react';
import { useMarketData, CryptoPrice } from '../../lib/marketData';
import { usePriceNotifications, formatPrice, formatPercentage, requestNotificationPermission } from '../../lib/priceNotifications';
import { FilterModal } from '../components/ui/FilterModal';
import {
  Skeleton,
  SkeletonPopularCoins,
  SkeletonGainersLosers,
  SkeletonMarketTable
} from '../components/ui/Skeleton';

// Define animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

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

export default function MarketPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'watchlist'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotificationPermission, setShowNotificationPermission] = useState(false);

  // Market data
  const { prices, subscribeToSymbols, unsubscribeFromSymbols } = useMarketData();
  const { alerts, addAlert, removeAlert } = usePriceNotifications();

  // Filter state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: 'rank',
    sortDirection: 'asc',
    priceRange: null,
    changeRange: null,
    showPositiveChangeOnly: false,
    showNegativeChangeOnly: false,
  });

  // Subscribe to market data
  useEffect(() => {
    const symbols = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'DOGE'];
    subscribeToSymbols(symbols);

    return () => {
      unsubscribeFromSymbols(symbols);
    };
  }, []);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setShowNotificationPermission(true);
    }
  }, []);

  // Handle notification permission request
  const handleNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    setShowNotificationPermission(!granted);
  };

  // Apply filters and sorting to coins
  const filteredCoins = Object.values(prices)
    .filter(coin => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          coin.symbol.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Price range filter
      if (filterOptions.priceRange) {
        const { min, max } = filterOptions.priceRange;
        if (coin.price < min || coin.price > max) return false;
      }

      // Change range filter
      if (filterOptions.changeRange) {
        const { min, max } = filterOptions.changeRange;
        if (coin.priceChangePercent < min || coin.priceChangePercent > max) return false;
      }

      // Positive/negative change filters
      if (filterOptions.showPositiveChangeOnly && coin.priceChangePercent < 0) return false;
      if (filterOptions.showNegativeChangeOnly && coin.priceChangePercent >= 0) return false;

      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      let comparison = 0;

      switch (filterOptions.sortBy) {
        case 'name':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'change':
          comparison = a.priceChangePercent - b.priceChangePercent;
          break;
        case 'marketCap':
          comparison = a.marketCap - b.marketCap;
          break;
        case 'volume':
          comparison = a.volume - b.volume;
          break;
      }

      // Apply sort direction
      return filterOptions.sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <DashboardWrapper>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Market Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-2">Market</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Track prices and trends across the crypto market</p>
        </motion.div>

        {/* Notification Permission Banner */}
        {showNotificationPermission && (
          <motion.div
            variants={itemVariants}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Enable notifications to receive price alerts
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNotificationPermission}
            >
              Enable
            </Button>
          </motion.div>
        )}

        {/* Market Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">Market Overview</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search coins..."
                    className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilterModal(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Coin</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">24h Change</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Market Cap</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Volume (24h)</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoins.map((coin) => (
                      <tr
                        key={coin.symbol}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <span className="font-medium">{coin.symbol}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatPrice(coin.price)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`${
                              coin.priceChangePercent >= 0
                                ? 'text-green-500 dark:text-green-400'
                                : 'text-red-500 dark:text-red-400'
                            }`}
                          >
                            {formatPercentage(coin.priceChangePercent)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatPrice(coin.marketCap)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatPrice(coin.volume)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Add price alert
                              addAlert({
                                symbol: coin.symbol,
                                targetPrice: coin.price,
                                condition: 'above'
                              });
                            }}
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filterOptions={filterOptions}
          onFilterChange={setFilterOptions}
        />
      </motion.div>
    </DashboardWrapper>
  );
}
