// Dashboard service to provide real-time data for the dashboard
// This service aggregates data from various sources

import {
  getTopCryptos,
  getGainersLosers,
  getMarketData,
  getPopularCoins,
  SimpleCryptoCoin,
  MarketData,
  GainersLosers
} from './cryptoService';

import {
  getLatestNews,
  SimpleNewsArticle
} from './newsService';

import {
  getPortfolioSummary,
  getPortfolioHoldings,
  getAssetAllocation,
  getTransactionHistory,
  PortfolioSummary,
  PortfolioHolding,
  AssetAllocation,
  Transaction
} from './portfolioService';

import { cache } from '../lib/cache';
import { fetchData } from './apiService';

// Interface for dashboard data
export interface DashboardData {
  marketOverview: MarketData;
  topCryptos: SimpleCryptoCoin[];
  trendingCoins: SimpleCryptoCoin[];
  gainersLosers: GainersLosers;
  latestNews: SimpleNewsArticle[];
  portfolioSummary: PortfolioSummary;
  topHoldings: PortfolioHolding[];
  assetAllocation: AssetAllocation[];
  recentTransactions: Transaction[];
}

// Base URL for dashboard API
const API_BASE_URL = 'https://api.dashboard.example.com';

// Dashboard summary interface
export interface DashboardSummary {
  totalValue: number;
  totalProfit: number;
  profitPercentage: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
}

/**
 * Get all dashboard data in a single call
 * @returns Promise with all dashboard data
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // Try to get from cache first (5 minute expiry)
    return await cache.getOrFetch('dashboardData', async () => {
      console.log('Fetching dashboard data from APIs...');

      // Fetch all data in parallel for better performance
      const [
        marketData,
        topCryptos,
        trendingCoins,
        gainersLosersData,
        newsData,
        portfolioSummary,
        holdings,
        allocation,
        transactions
      ] = await Promise.all([
        getMarketData().catch((error) => {
          console.error('Error fetching market data:', error);
          return {
            totalMarketCap: 0,
            totalVolume: 0,
            btcDominance: 0,
            ethDominance: 0
          };
        }),
        getTopCryptos(10).catch((error) => {
          console.error('Error fetching top cryptos:', error);
          return [];
        }),
        getPopularCoins(6).catch((error) => {
          console.error('Error fetching popular coins:', error);
          return [];
        }),
        getGainersLosers(5).catch((error) => {
          console.error('Error fetching gainers/losers:', error);
          return { gainers: [], losers: [] };
        }),
        getLatestNews(6).catch((error) => {
          console.error('Error fetching news:', error);
          return [];
        }),
        getPortfolioSummary().catch((error) => {
          console.error('Error fetching portfolio summary:', error);
          return {
            totalValue: 0,
            totalCost: 0,
            totalProfit: 0,
            profitPercentage: 0,
            dailyChange: 0,
            weeklyChange: 0,
            monthlyChange: 0,
            allTimeHigh: 0,
            allTimeLow: 0
          };
        }),
        getPortfolioHoldings().catch((error) => {
          console.error('Error fetching portfolio holdings:', error);
          return [];
        }),
        getAssetAllocation().catch((error) => {
          console.error('Error fetching asset allocation:', error);
          return [];
        }),
        getTransactionHistory().catch((error) => {
          console.error('Error fetching transaction history:', error);
          return [];
        })
      ]);

      console.log('Dashboard data fetched successfully');

      // Create the dashboard data object
      const dashboardData = {
        marketOverview: marketData,
        topCryptos,
        trendingCoins,
        gainersLosers: gainersLosersData,
        latestNews: newsData,
        portfolioSummary: portfolioSummary,
        topHoldings: holdings.slice(0, 5),
        assetAllocation: allocation,
        recentTransactions: transactions.slice(0, 5)
      };

      // Log some basic info to verify data
      console.log(`Top cryptos: ${dashboardData.topCryptos.length}`);
      console.log(`Trending coins: ${dashboardData.trendingCoins.length}`);
      console.log(`Latest news: ${dashboardData.latestNews.length}`);
      console.log(`Top holdings: ${dashboardData.topHoldings.length}`);

      return dashboardData;
    }, 5 * 60 * 1000); // 5 minute cache
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Format currency values
 * @param value Number to format
 * @returns Formatted string (e.g., $1,234.56)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format large numbers
 * @param value Number to format
 * @returns Formatted string (e.g., 1.23M)
 */
export const formatNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  } else {
    return value.toFixed(2);
  }
};

/**
 * Format percentage values
 * @param value Percentage value
 * @returns Formatted string (e.g., +1.23%)
 */
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

/**
 * Format date values
 * @param dateString Date string
 * @returns Formatted date string (e.g., Jan 1, 2023)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Format time values
 * @param dateString Date string
 * @returns Formatted time string (e.g., 12:34 PM)
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

/**
 * Format date and time values
 * @param dateString Date string
 * @returns Formatted date and time string (e.g., Jan 1, 2023, 12:34 PM)
 */
export const formatDateTime = (dateString: string): string => {
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

// Get dashboard summary
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const data = await fetchData<DashboardSummary>(`${API_BASE_URL}/summary`);
    return data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};
