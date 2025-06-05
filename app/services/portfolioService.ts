import { fetchData } from './apiService';
import { mockPortfolio, mockHoldings, mockTransactions } from '../data/mockData';
import { getTopCryptos, SimpleCryptoCoin, formatMarketCap } from './cryptoService';

// Base URL for portfolio API
const API_BASE_URL = 'https://api.portfolio.example.com';

// Portfolio summary interface
export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalProfit: number;
  profitPercentage: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  allTimeHigh: number;
  allTimeLow: number;
}

// Asset allocation interface
export interface AssetAllocation {
  name: string;
  symbol: string;
  value: number;
  percentage: number;
  color: string;
}

// Portfolio holding interface
export interface PortfolioHolding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  price: number;
  value: number;
  averageBuyPrice: number;
  totalCost: number;
  profit: number;
  profitPercentage: number;
  change24h: number;
  allocation: number;
  image?: string;
}

// Transaction interface
export interface Transaction {
  id: string;
  type: 'Buy' | 'Sell' | 'Transfer' | 'Swap';
  coin: string;
  symbol: string;
  amount: number;
  price: number;
  value: number;
  fee: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  notes?: string;
}

// Portfolio performance data point
export interface PerformanceDataPoint {
  date: string;
  value: number;
}

// Portfolio performance interface
export interface PortfolioPerformance {
  daily: PerformanceDataPoint[];
  weekly: PerformanceDataPoint[];
  monthly: PerformanceDataPoint[];
  yearly: PerformanceDataPoint[];
  allTime: PerformanceDataPoint[];
}

// Get portfolio summary
export const getPortfolioSummary = async (): Promise<PortfolioSummary> => {
  try {
    const data = await fetchData<PortfolioSummary>(`${API_BASE_URL}/summary`);
    return data;
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    throw error;
  }
};

// Get asset allocation
export const getAssetAllocation = async (): Promise<AssetAllocation[]> => {
  try {
    const data = await fetchData<AssetAllocation[]>(`${API_BASE_URL}/allocation`);
    return data;
  } catch (error) {
    console.error('Error fetching asset allocation:', error);
    throw error;
  }
};

// Real portfolio data - this would typically come from a database
// For demonstration, we're hardcoding some popular cryptocurrencies with realistic holdings
const realPortfolioData = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    quantity: 0.75,
    purchasePrice: 38500
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    quantity: 5.2,
    purchasePrice: 2100
  },
  {
    id: 'solana',
    symbol: 'SOL',
    quantity: 45,
    purchasePrice: 85
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    quantity: 2500,
    purchasePrice: 0.45
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    quantity: 150,
    purchasePrice: 6.8
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    quantity: 100,
    purchasePrice: 12.5
  },
  {
    id: 'avalanche-2',
    symbol: 'AVAX',
    quantity: 60,
    purchasePrice: 28
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    quantity: 120,
    purchasePrice: 5.2
  }
];

// Get portfolio holdings
export const getPortfolioHoldings = async (): Promise<PortfolioHolding[]> => {
  try {
    const data = await fetchData<PortfolioHolding[]>(`${API_BASE_URL}/holdings`);
    return data;
  } catch (error) {
    console.error('Error fetching portfolio holdings:', error);
    throw error;
  }
};

// Get transaction history
export const getTransactionHistory = async (): Promise<Transaction[]> => {
  try {
    const data = await fetchData<Transaction[]>(`${API_BASE_URL}/transactions`);
    return data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};

// Get portfolio performance
export const getPortfolioPerformance = async (): Promise<PortfolioPerformance> => {
  try {
    const data = await fetchData<PortfolioPerformance>(`${API_BASE_URL}/performance`);
    return data;
  } catch (error) {
    console.error('Error fetching portfolio performance:', error);
    throw error;
  }
};
