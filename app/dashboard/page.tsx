"use client";

import { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import DashboardWrapper from '../components/DashboardWrapper';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, TrendingUp, Wallet, LineChart, Info,
  RefreshCw, Bell, Settings, ChevronRight, PlusCircle,
  ArrowUp, ArrowDown, DollarSign, Activity, Zap, Clock
} from 'lucide-react';

// Lazy load components for better performance
const MarketOverview = lazy(() => import("../components/ui/MarketOverview").then(mod => ({ default: mod.MarketOverview })));
const TrendingCoins = lazy(() => import("../components/ui/TrendingCoins").then(mod => ({ default: mod.TrendingCoins })));
const RecentTransactions = lazy(() => import("../components/ui/RecentTransactions").then(mod => ({ default: mod.RecentTransactions })));
const MarketTrends = lazy(() => import("../components/ui/MarketTrends").then(mod => ({ default: mod.MarketTrends })));
const CryptoNews = lazy(() => import("../components/ui/CryptoNews").then(mod => ({ default: mod.CryptoNews })));
// LivePricesTicker component will be added later
const LivePricesTicker = () => (
  <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center">
    Live prices will be displayed here
  </div>
);

import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { SkeletonMarketOverview,
  SkeletonTrendingCoins,
  SkeletonPortfolioSummary,
  SkeletonMarketTrends,
  SkeletonNews,
  SkeletonTransactions
} from '../components/ui/Skeleton';
import { getDashboardData, formatCurrency, formatPercentage } from "../services/dashboardService";
import type { DashboardData } from "../services/dashboardService";
import { useAuth } from '../../contexts/AuthContext';

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

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Add ticker animation styles
  useEffect(() => {
    // Add keyframes for ticker animation to the stylesheet
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ticker {
        0% { transform: translateX(0); }
        100% { transform: translateX(-100%); }
      }
      @keyframes ticker2 {
        0% { transform: translateX(100%); }
        100% { transform: translateX(0); }
      }
      .animate-ticker {
        animation: ticker 30s linear infinite;
      }
      .animate-ticker2 {
        animation: ticker2 30s linear infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch dashboard data with optimized loading
  useEffect(() => {
    let isMounted = true;

    const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        if (isMounted) {
          setDashboardData(data);
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }, []);

    // Start fetching immediately
    fetchData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const renderMarketOverview = () => {
    if (loading) return <SkeletonMarketOverview />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!dashboardData?.marketOverview) return null;
    return (
      <Suspense fallback={<SkeletonMarketOverview />}>
        <MarketOverview marketData={dashboardData.marketOverview} />
      </Suspense>
    );
  };

  const renderTrendingCoins = () => {
    if (loading) return <SkeletonTrendingCoins />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!dashboardData?.trendingCoins) return null;
    return (
      <Suspense fallback={<SkeletonTrendingCoins />}>
        <TrendingCoins coins={dashboardData.trendingCoins} />
      </Suspense>
    );
  };

  const renderMarketTrends = () => {
    if (loading) return <SkeletonMarketTrends />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!dashboardData?.gainersLosers) return null;
    return (
      <Suspense fallback={<SkeletonMarketTrends />}>
        <MarketTrends gainersLosers={dashboardData.gainersLosers} />
      </Suspense>
    );
  };

  const renderCryptoNews = () => {
    if (loading) return <SkeletonNews />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!dashboardData?.latestNews) return null;
    return (
      <Suspense fallback={<SkeletonNews />}>
        <CryptoNews news={dashboardData.latestNews} compact={true} />
      </Suspense>
    );
  };

  const renderRecentTransactions = () => {
    if (loading) return <SkeletonTransactions />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!dashboardData?.recentTransactions) return null;
    return (
      <Suspense fallback={<SkeletonTransactions />}>
        <RecentTransactions transactions={dashboardData.recentTransactions} compact={true} />
      </Suspense>
    );
  };

  return (
    <DashboardWrapper>
      <div className="sticky top-0 z-10">
        <Suspense fallback={<div className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse" />}>
          <LivePricesTicker />
        </Suspense>
      </div>
      <motion.div 
        className="container mx-auto px-4 py-6 md:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {loading ? 'Loading...' : `Welcome, ${user?.email?.split('@')[0] || 'Crypto Enthusiast'}`}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Here's what's happening in the crypto market today</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="py-2.5 px-5 text-base shadow-sm"
              onClick={() => {
                // Refresh data
                setLoading(true);
                getDashboardData()
                  .then(data => {
                    setDashboardData(data);
                    setLoading(false);
                    setError(null);
                  })
                  .catch(err => {
                    console.error('Error refreshing data:', err);
                    setError('Failed to refresh data. Please try again.');
                    setLoading(false);
                  });
              }}
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Link href="/portfolio">
              <Button
                size="lg"
                className="py-2.5 px-5 text-base bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white shadow-md"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Portfolio
              </Button>
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <>
            {/* Market Ticker Skeleton */}
            <motion.div variants={itemVariants}>
              <Card className="premium-card overflow-hidden">
                <div className="relative flex items-center h-14 overflow-hidden px-6">
                  <div className="flex space-x-8">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-4 w-10 bg-gray-200 dark:bg-gray-800 rounded ml-2 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Portfolio Summary & Market Overview Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                {/* Portfolio Summary Skeleton */}
                <Card className="premium-card overflow-hidden mb-8">
                  <CardContent className="p-6">
                    <SkeletonPortfolioSummary />
                  </CardContent>
                </Card>

                {/* Market Overview Skeleton */}
                <Card className="premium-card overflow-hidden">
                  <CardContent className="p-6">
                    <SkeletonMarketOverview />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-1">
                {/* Trending Coins Skeleton */}
                <Card className="premium-card overflow-hidden">
                  <CardContent className="p-6">
                    <SkeletonTrendingCoins />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Market Trends & News Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <Card className="premium-card overflow-hidden">
                  <CardContent className="p-6">
                    <SkeletonMarketTrends />
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="premium-card overflow-hidden">
                  <CardContent className="p-6">
                    <SkeletonNews />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Transactions Skeleton */}
            <motion.div variants={itemVariants}>
              <Card className="premium-card overflow-hidden">
                <CardContent className="p-6">
                  <SkeletonTransactions />
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : error ? (
          <motion.div variants={itemVariants} className="text-center py-20 text-red-500">
            <p className="text-xl">{error}</p>
          </motion.div>
        ) : dashboardData ? (
          <>
            {/* Market Ticker */}
            <motion.div variants={itemVariants}>
              <Card className="premium-card overflow-hidden">
                <div className="relative flex items-center h-14 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-white dark:from-gray-900 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-white dark:from-gray-900 to-transparent"></div>

                  <div className="flex animate-ticker whitespace-nowrap">
                    {dashboardData.topCryptos.map((coin, index) => (
                      <div key={`ticker-1-${index}`} className="flex items-center px-4">
                        <span className="font-medium">{coin.symbol}</span>
                        <span className={`ml-2 ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercentage(coin.change24h)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex animate-ticker2 whitespace-nowrap absolute left-full">
                    {dashboardData.topCryptos.map((coin, index) => (
                      <div key={`ticker-2-${index}`} className="flex items-center px-4">
                        <span className="font-medium">{coin.symbol}</span>
                        <span className={`ml-2 ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercentage(coin.change24h)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Portfolio Summary & Market Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                {/* Portfolio Summary Card */}
                <Card className="premium-card overflow-hidden mb-8">
                  <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wallet className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
                        <span className="text-xl font-semibold">Portfolio Summary</span>
                      </div>
                      <Link
                        href="/portfolio"
                        className="text-sm flex items-center text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:underline"
                      >
                        View details <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Value</p>
                        <p className="text-3xl font-bold">{formatCurrency(dashboardData.portfolioSummary.totalValue)}</p>
                        <div className={`flex items-center text-sm mt-2 ${dashboardData.portfolioSummary.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {dashboardData.portfolioSummary.dailyChange >= 0 ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          )}
                          <span>{formatPercentage(dashboardData.portfolioSummary.dailyChange)}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">24h</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Profit/Loss</p>
                        <p className={`text-3xl font-bold ${dashboardData.portfolioSummary.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(dashboardData.portfolioSummary.totalProfit)}
                        </p>
                        <div className={`flex items-center text-sm mt-2 ${dashboardData.portfolioSummary.profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {dashboardData.portfolioSummary.profitPercentage >= 0 ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          )}
                          <span>{formatPercentage(dashboardData.portfolioSummary.profitPercentage)}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">All time</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Holdings */}
                    <div>
                      <h3 className="text-base font-semibold mb-3">Top Holdings</h3>
                      <div className="space-y-3">
                        {dashboardData.topHoldings.slice(0, 3).map((holding) => (
                          <div key={holding.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {holding.image && (
                                <div className="w-8 h-8 mr-3">
                                  <Image
                                    src={holding.image}
                                    alt={holding.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{holding.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{holding.symbol}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(holding.value)}</div>
                              <div className={`text-xs ${holding.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatPercentage(holding.change24h)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {renderMarketOverview()}
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-1">
                {renderTrendingCoins()}
              </motion.div>
            </div>

            {/* Market Trends & News */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants} className="lg:col-span-1">
                {renderMarketTrends()}
              </motion.div>
              <motion.div variants={itemVariants} className="lg:col-span-2">
                {renderCryptoNews()}
              </motion.div>
            </div>

            {/* Recent Transactions */}
            <motion.div variants={itemVariants}>
              {renderRecentTransactions()}
            </motion.div>
          </>
        ) : null}
      </motion.div>
    </DashboardWrapper>
  );
}
