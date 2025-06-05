"use client";

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import DashboardWrapper from '../components/DashboardWrapper';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { AddAssetModal } from '../components/ui/AddAssetModal';
import { EditHoldingModal } from '../components/ui/EditHoldingModal';
import { ImportCSVModal } from '../components/ui/ImportCSVModal';
import { PortfolioSelector } from '../components/ui/PortfolioSelector';
import { PortfolioAnalytics } from '../components/ui/PortfolioAnalytics';
import { AssetChart } from '../components/ui/AssetChart';
import { Button } from '../components/ui/Button';
import {
  ArrowUpDown, Plus, Filter, Download, Wallet, PieChart, Clock,
  TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, Loader2,
  Search, Edit3, Upload
} from 'lucide-react';
import {
  Skeleton,
  SkeletonPortfolioSummaryCards,
  SkeletonPortfolioPerformanceChart,
  SkeletonAssetAllocation,
  SkeletonTopHoldings,
  SkeletonHoldingsTable,
  SkeletonTransactionsTable
} from '../components/ui/Skeleton';

// Lazy load components for better performance
const CryptoHoldings = lazy(() => import('../components/ui/CryptoHoldings').then(mod => ({ default: mod.CryptoHoldings })));
const PortfolioAllocation = lazy(() => import('../components/ui/PortfolioAllocation').then(mod => ({ default: mod.PortfolioAllocation })));
const PortfolioPerformanceChart = lazy(() => import('../components/ui/PortfolioPerformanceChart').then(mod => ({ default: mod.PortfolioPerformanceChart })));
import {
  getPortfolioSummary, getAssetAllocation, getPortfolioHoldings,
  getTransactionHistory, getPortfolioPerformance, getPortfolios, createPortfolio,
  PortfolioSummary, AssetAllocation, PortfolioHolding, Transaction, PortfolioPerformance
} from '../services/portfolioService';
import { usePriceUpdates } from '../services/priceUpdateService';
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

export default function PortfolioPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions'>('holdings');
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showEditHoldingModal, setShowEditHoldingModal] = useState(false);
  const [showImportCSVModal, setShowImportCSVModal] = useState(false);
  const [showAssetChart, setShowAssetChart] = useState(false);
  const [editingHolding, setEditingHolding] = useState<PortfolioHolding | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<PortfolioHolding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPortfolioId, setCurrentPortfolioId] = useState<string | null>(null);

  // Portfolio data state
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation[]>([]);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [performance, setPerformance] = useState<PortfolioPerformance | null>(null);

  // Real-time price updates
  const holdingSymbols = holdings.map(h => h.symbol);
  const { prices, connectionStatus } = usePriceUpdates(holdingSymbols, holdings.length > 0);

  // Update holdings with real-time prices
  const updatedHoldings = holdings.map(holding => {
    const priceUpdate = prices[holding.symbol];
    if (priceUpdate) {
      const newPrice = priceUpdate.price;
      const newValue = holding.quantity * newPrice;
      const profit = newValue - holding.totalCost;
      const profitPercentage = holding.totalCost > 0 ? (profit / holding.totalCost) * 100 : 0;

      return {
        ...holding,
        price: newPrice,
        value: newValue,
        profit,
        profitPercentage,
        change24h: priceUpdate.change24h
      };
    }
    return holding;
  });

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setIsLoading(true);

        if (!user) {
          setError('Please sign in to view your portfolio');
          setIsLoading(false);
          return;
        }

        // Get user's portfolios first
        const portfoliosResult = await getPortfolios(user.id);
        let portfolioId = null;

        if (portfoliosResult.success && portfoliosResult.data?.length) {
          // Use the first portfolio for now
          portfolioId = portfoliosResult.data[0].id;
          setCurrentPortfolioId(portfolioId);
        } else {
          // Create a default portfolio if user doesn't have any
          const createResult = await createPortfolio(user.id, 'My Portfolio', 'Default portfolio');
          if (createResult.success && createResult.data) {
            portfolioId = createResult.data.id;
            setCurrentPortfolioId(portfolioId);
          }
        }

        // Fetch all portfolio data in parallel
        const [summary, allocation, holdingsData, transactionsData] = await Promise.all([
          getPortfolioSummary(user.id),
          getAssetAllocation(user.id),
          getPortfolioHoldings(portfolioId, user.id),
          getTransactionHistory(user.id)
        ]);

        // Get performance data with current portfolio values
        const performanceData = await getPortfolioPerformance(
          portfolioId,
          summary.totalValue,
          summary.totalCost
        );

        setPortfolioSummary(summary);
        setAssetAllocation(allocation);
        setHoldings(holdingsData);
        setTransactions(transactionsData);
        setPerformance(performanceData);

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user]);

  // Handle portfolio change
  const handlePortfolioChange = async (portfolioId: string) => {
    setCurrentPortfolioId(portfolioId);
    await refreshPortfolioData(portfolioId);
  };

  // Handle asset added successfully
  const handleAssetAdded = async () => {
    await refreshPortfolioData(currentPortfolioId);
  };

  // Handle holding updated
  const handleHoldingUpdated = async () => {
    await refreshPortfolioData(currentPortfolioId);
  };

  // Handle holding deleted
  const handleHoldingDeleted = async () => {
    await refreshPortfolioData(currentPortfolioId);
  };

  // Handle edit holding
  const handleEditHolding = (holding: PortfolioHolding) => {
    setEditingHolding(holding);
    setShowEditHoldingModal(true);
  };

  // Refresh portfolio data
  const refreshPortfolioData = async (portfolioId: string | null) => {
    try {
      if (!user) return;

      const [summary, allocation, holdingsData, transactionsData] = await Promise.all([
        getPortfolioSummary(user.id),
        getAssetAllocation(user.id),
        getPortfolioHoldings(portfolioId, user.id),
        getTransactionHistory(user.id)
      ]);

      // Get performance data with current portfolio values
      const performanceData = await getPortfolioPerformance(
        portfolioId,
        summary.totalValue,
        summary.totalCost
      );

      setPortfolioSummary(summary);
      setAssetAllocation(allocation);
      setHoldings(holdingsData);
      setTransactions(transactionsData);
      setPerformance(performanceData);
    } catch (err) {
      console.error('Error refreshing portfolio data:', err);
    }
  };

  // Format date for transaction history
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <DashboardWrapper>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Portfolio Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Manage and track your crypto assets</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="py-2.5 px-5 text-base shadow-sm"
                onClick={() => setShowImportCSVModal(true)}
              >
                <Upload className="w-5 h-5 mr-2" />
                Import CSV
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="py-2.5 px-5 text-base shadow-sm"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
              <Button
                size="lg"
                className="py-2.5 px-5 text-base bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white shadow-md"
                onClick={() => setShowAddAssetModal(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>

          {/* Portfolio Selector */}
          <div className="flex items-center justify-between">
            <PortfolioSelector
              currentPortfolioId={currentPortfolioId}
              onPortfolioChange={handlePortfolioChange}
              onPortfolioCreated={handleAssetAdded}
            />
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{holdings.length} assets</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' :
                  connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="capitalize">{connectionStatus}</span>
              </div>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <>
          {/* Portfolio Summary Cards Skeleton */}
          <motion.div variants={itemVariants}>
            <SkeletonPortfolioSummaryCards />
          </motion.div>

          {/* Portfolio Performance Chart Skeleton */}
          <motion.div variants={itemVariants} className="mt-8">
            <SkeletonPortfolioPerformanceChart />
          </motion.div>

          {/* Portfolio Allocation & Holdings Section Skeleton */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1">
              <SkeletonAssetAllocation />
            </div>
            <div className="md:col-span-2">
              <SkeletonTopHoldings />
            </div>
          </motion.div>

          {/* Holdings/Transactions Tabs Skeleton */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="px-6 py-3 text-base font-medium border-b-2 border-[var(--primary-600)] dark:border-[var(--primary-400)]">
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="px-6 py-3 text-base font-medium">
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            <SkeletonHoldingsTable />
          </motion.div>
        </>
      ) : error ? (
        <motion.div variants={itemVariants} className="text-center py-20 text-red-500">
          <p className="text-xl">{error}</p>
        </motion.div>
      ) : (
        <>
          {/* Portfolio Summary Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Total Value Card */}
            <Card className="premium-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30">
                    <Wallet className="h-6 w-6 text-[var(--primary-500)]" />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-sm font-medium ${portfolioSummary?.dailyChange && portfolioSummary.dailyChange >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {portfolioSummary?.dailyChange && portfolioSummary.dailyChange >= 0 ? '+' : ''}{portfolioSummary?.dailyChange}% (24h)
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Value</h3>
                <p className="text-2xl font-bold">{formatCurrency(portfolioSummary?.totalValue || 0)}</p>
              </CardContent>
            </Card>

            {/* Total Profit Card */}
            <Card className="premium-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-sm font-medium ${portfolioSummary?.profitPercentage && portfolioSummary.profitPercentage >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {portfolioSummary?.profitPercentage && portfolioSummary.profitPercentage >= 0 ? '+' : ''}{portfolioSummary?.profitPercentage.toFixed(2)}%
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Profit/Loss</h3>
                <p className={`text-2xl font-bold ${portfolioSummary?.totalProfit && portfolioSummary.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(portfolioSummary?.totalProfit || 0)}
                </p>
              </CardContent>
            </Card>

            {/* Monthly Change Card */}
            <Card className="premium-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-sm font-medium ${portfolioSummary?.monthlyChange && portfolioSummary.monthlyChange >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    30 days
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Monthly Change</h3>
                <p className={`text-2xl font-bold ${portfolioSummary?.monthlyChange && portfolioSummary.monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioSummary?.monthlyChange && portfolioSummary.monthlyChange >= 0 ? '+' : ''}{portfolioSummary?.monthlyChange}%
                </p>
              </CardContent>
            </Card>

            {/* All-Time High Card */}
            <Card className="premium-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">All-Time High</h3>
                <p className="text-2xl font-bold">{formatCurrency(portfolioSummary?.allTimeHigh || 0)}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Portfolio Performance Chart */}
          {performance && (
            <motion.div variants={itemVariants} className="mt-8">
              <Card className="premium-card overflow-hidden">
                <CardContent className="p-6">
                  <Suspense fallback={<SkeletonPortfolioPerformanceChart />}>
                    <PortfolioPerformanceChart
                      daily={performance.daily}
                      weekly={performance.weekly}
                      monthly={performance.monthly}
                      yearly={performance.yearly}
                      allTime={performance.allTime}
                    />
                  </Suspense>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Portfolio Allocation & Holdings Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
          >
            <div className="md:col-span-1">
              <Card className="premium-card h-full">
                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <PieChart className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
                    <span className="text-xl font-semibold">Asset Allocation</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Suspense fallback={<SkeletonAssetAllocation />}>
                    <PortfolioAllocation allocation={assetAllocation} />
                  </Suspense>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="premium-card h-full">
                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wallet className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
                      <span className="text-xl font-semibold">Top Holdings</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm"
                      onClick={() => setActiveTab('holdings')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {updatedHoldings.slice(0, 3).map((holding) => (
                      <div key={holding.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="flex items-center">
                          {holding.image && (
                            <div className="w-10 h-10 mr-4">
                              <Image
                                src={holding.image}
                                alt={holding.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold">{holding.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{holding.symbol} • {holding.quantity.toLocaleString('en-US', { maximumFractionDigits: 8 })}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(holding.value)}</div>
                          <div className={`text-sm flex items-center justify-end ${holding.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {holding.change24h >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {holding.change24h >= 0 ? '+' : ''}{holding.change24h}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </>
      )}

      {/* Holdings/Transactions Tabs */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`px-6 py-3 text-base font-medium ${activeTab === 'holdings' ? 'text-[var(--primary-600)] dark:text-[var(--primary-400)] border-b-2 border-[var(--primary-600)] dark:border-[var(--primary-400)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('holdings')}
          >
            Holdings
          </button>
          <button
            className={`px-6 py-3 text-base font-medium ${activeTab === 'transactions' ? 'text-[var(--primary-600)] dark:text-[var(--primary-400)] border-b-2 border-[var(--primary-600)] dark:border-[var(--primary-400)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </div>

        {isLoading ? (
          activeTab === 'holdings' ? <SkeletonHoldingsTable /> : <SkeletonTransactionsTable />
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p className="text-lg">{error}</p>
          </div>
        ) : activeTab === 'holdings' ? (
          <Card className="premium-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Wallet className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
                <span className="text-xl font-semibold">All Holdings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                  />
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="py-2.5 px-4 text-base shadow-sm"
                >
                  <ArrowUpDown className="w-5 h-5 mr-2" />
                  Sort
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Asset</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Price</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Holdings</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Avg. Buy Price</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Value</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Profit/Loss</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">24h</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatedHoldings.map((holding) => (
                      <tr key={holding.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <td className="py-5">
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
                              <div className="font-semibold">{holding.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{holding.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 text-right font-medium">{formatCurrency(holding.price)}</td>
                        <td className="py-5 text-right font-medium">{holding.quantity.toLocaleString('en-US', { maximumFractionDigits: 8 })}</td>
                        <td className="py-5 text-right font-medium">{formatCurrency(holding.averageBuyPrice)}</td>
                        <td className="py-5 text-right font-medium">{formatCurrency(holding.value)}</td>
                        <td className="py-5 text-right">
                          <div className={`font-medium ${holding.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCurrency(holding.profit)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {holding.profitPercentage >= 0 ? '+' : ''}{holding.profitPercentage.toFixed(2)}%
                          </div>
                        </td>
                        <td className={`py-5 text-right font-medium ${holding.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <div className="flex items-center justify-end">
                            {holding.change24h >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1.5" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1.5" />
                            )}
                            {holding.change24h >= 0 ? '+' : ''}{holding.change24h}%
                          </div>
                        </td>
                        <td className="py-5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditHolding(holding)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="premium-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Clock className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
                <span className="text-xl font-semibold">Transaction History</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="py-2.5 px-5 text-base shadow-sm"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="py-2.5 px-5 text-base shadow-sm"
                >
                  <ArrowUpDown className="w-5 h-5 mr-2" />
                  Sort
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Type</th>
                      <th className="text-left pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Asset</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Price</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Value</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Fee</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Date</th>
                      <th className="text-right pb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <td className="py-5">
                          <span className={`
                            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${tx.type === 'Buy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              tx.type === 'Sell' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                              tx.type === 'Swap' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}
                          `}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-5">
                          <div className="flex items-center">
                            <div>
                              <div className="font-semibold">{tx.coin}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{tx.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 text-right font-medium">{tx.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })}</td>
                        <td className="py-5 text-right font-medium">{formatCurrency(tx.price)}</td>
                        <td className="py-5 text-right font-medium">{formatCurrency(tx.value)}</td>
                        <td className="py-5 text-right font-medium">{formatCurrency(tx.fee)}</td>
                        <td className="py-5 text-right whitespace-nowrap">{formatDate(tx.date)}</td>
                        <td className="py-5 text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${tx.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
      </motion.div>

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={showAddAssetModal}
        onClose={() => setShowAddAssetModal(false)}
        portfolioId={currentPortfolioId}
        onAssetAdded={handleAssetAdded}
      />

      {/* Edit Holding Modal */}
      <EditHoldingModal
        isOpen={showEditHoldingModal}
        onClose={() => {
          setShowEditHoldingModal(false);
          setEditingHolding(null);
        }}
        holding={editingHolding}
        onHoldingUpdated={handleHoldingUpdated}
        onHoldingDeleted={handleHoldingDeleted}
      />

      {/* Import CSV Modal */}
      <ImportCSVModal
        isOpen={showImportCSVModal}
        onClose={() => setShowImportCSVModal(false)}
        portfolioId={currentPortfolioId}
        onImportComplete={handleAssetAdded}
      />
    </DashboardWrapper>
  );
}
