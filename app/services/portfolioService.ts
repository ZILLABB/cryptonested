import { fetchData } from './apiService';
import { mockPortfolio, mockHoldings, mockTransactions } from '../data/mockData';
import { getTopCryptos, SimpleCryptoCoin, formatMarketCap, getCryptoById } from './cryptoService';
import {
  getUserPortfolios,
  getPortfolioHoldings as getDbPortfolioHoldings,
  getUserTransactions,
  createPortfolio as createDbPortfolio,
  addHolding as addDbHolding,
  addTransaction as addDbTransaction,
  Portfolio as DbPortfolio,
  Holding as DbHolding,
  Transaction as DbTransaction
} from '../../lib/portfolio';

// Base URL for portfolio API (fallback)
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

/**
 * Calculate portfolio summary from real holdings data
 */
export const calculatePortfolioSummary = async (holdings: PortfolioHolding[]): Promise<PortfolioSummary> => {
  let totalValue = 0;
  let totalCost = 0;
  let totalProfit = 0;

  for (const holding of holdings) {
    totalValue += holding.value;
    totalCost += holding.totalCost;
    totalProfit += holding.profit;
  }

  const profitPercentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  // For now, we'll use mock data for time-based changes
  // TODO: Implement historical portfolio value tracking
  return {
    totalValue,
    totalCost,
    totalProfit,
    profitPercentage,
    dailyChange: 2.34, // Mock data - implement real calculation
    weeklyChange: -1.23, // Mock data - implement real calculation
    monthlyChange: 8.56, // Mock data - implement real calculation
    allTimeHigh: totalValue * 1.15, // Mock calculation
    allTimeLow: totalValue * 0.75, // Mock calculation
  };
};

// Get portfolio summary (with real data integration)
export const getPortfolioSummary = async (userId?: string): Promise<PortfolioSummary> => {
  try {
    if (!userId) {
      // Fallback to mock data if no user
      return {
        totalValue: mockPortfolio.totalValue,
        totalCost: mockPortfolio.totalValue * 0.85,
        totalProfit: mockPortfolio.totalValue * 0.15,
        profitPercentage: 15,
        dailyChange: mockPortfolio.dailyChange,
        weeklyChange: mockPortfolio.weeklyChange,
        monthlyChange: mockPortfolio.monthlyChange,
        allTimeHigh: mockPortfolio.totalValue * 1.2,
        allTimeLow: mockPortfolio.totalValue * 0.6,
      };
    }

    // Get user's portfolios and calculate summary
    const portfoliosResult = await getUserPortfolios(userId);
    if (!portfoliosResult.success || !portfoliosResult.data?.length) {
      // Return empty portfolio summary
      return {
        totalValue: 0,
        totalCost: 0,
        totalProfit: 0,
        profitPercentage: 0,
        dailyChange: 0,
        weeklyChange: 0,
        monthlyChange: 0,
        allTimeHigh: 0,
        allTimeLow: 0,
      };
    }

    // Get holdings for all portfolios and calculate summary
    const allHoldings: PortfolioHolding[] = [];
    for (const portfolio of portfoliosResult.data) {
      const holdings = await getPortfolioHoldings(portfolio.id);
      allHoldings.push(...holdings);
    }

    return calculatePortfolioSummary(allHoldings);
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    // Fallback to mock data on error
    return {
      totalValue: mockPortfolio.totalValue,
      totalCost: mockPortfolio.totalValue * 0.85,
      totalProfit: mockPortfolio.totalValue * 0.15,
      profitPercentage: 15,
      dailyChange: mockPortfolio.dailyChange,
      weeklyChange: mockPortfolio.weeklyChange,
      monthlyChange: mockPortfolio.monthlyChange,
      allTimeHigh: mockPortfolio.totalValue * 1.2,
      allTimeLow: mockPortfolio.totalValue * 0.6,
    };
  }
};

// Get asset allocation (with real data integration)
export const getAssetAllocation = async (userId?: string): Promise<AssetAllocation[]> => {
  try {
    if (!userId) {
      // Fallback to mock data
      return mockPortfolio.allocation;
    }

    // Get portfolio holdings and convert to allocation
    const holdings = await getPortfolioHoldings(undefined, userId);

    return holdings.map(holding => ({
      name: holding.name,
      symbol: holding.symbol,
      value: holding.value,
      percentage: holding.allocation,
      color: getCryptoColor(holding.symbol)
    }));
  } catch (error) {
    console.error('Error fetching asset allocation:', error);
    // Fallback to mock data
    return mockPortfolio.allocation;
  }
};

/**
 * Get color for cryptocurrency symbol
 */
const getCryptoColor = (symbol: string): string => {
  const colors: { [key: string]: string } = {
    'BTC': '#F7931A',
    'ETH': '#627EEA',
    'SOL': '#00FFA3',
    'USDC': '#2775CA',
    'ADA': '#0033AD',
    'DOT': '#E6007A',
    'LINK': '#375BD2',
    'AVAX': '#E84142',
    'UNI': '#FF007A',
    'MATIC': '#8247E5',
    'LTC': '#BFBBBB',
    'XRP': '#23292F',
  };
  return colors[symbol] || '#6B7280'; // Default gray color
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

/**
 * Convert database holding to portfolio holding with current market data
 */
const convertDbHoldingToPortfolioHolding = async (dbHolding: DbHolding): Promise<PortfolioHolding | null> => {
  try {
    // Fetch current crypto data
    const cryptoData = await getCryptoById(dbHolding.coin_id);
    if (!cryptoData) return null;

    const currentPrice = cryptoData.market_data?.current_price?.usd || 0;
    const change24h = cryptoData.market_data?.price_change_percentage_24h || 0;
    const currentValue = dbHolding.quantity * currentPrice;
    const purchasePrice = dbHolding.purchase_price || currentPrice;
    const totalCost = dbHolding.quantity * purchasePrice;
    const profit = currentValue - totalCost;
    const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return {
      id: dbHolding.id,
      name: cryptoData.name,
      symbol: cryptoData.symbol.toUpperCase(),
      quantity: dbHolding.quantity,
      price: currentPrice,
      value: currentValue,
      averageBuyPrice: purchasePrice,
      totalCost,
      profit,
      profitPercentage,
      change24h,
      allocation: 0, // Will be calculated after all holdings are fetched
      image: cryptoData.image?.large || cryptoData.image?.small
    };
  } catch (error) {
    console.error(`Error converting holding for ${dbHolding.coin_id}:`, error);
    return null;
  }
};

// Get portfolio holdings (with real data integration)
export const getPortfolioHoldings = async (portfolioId?: string, userId?: string): Promise<PortfolioHolding[]> => {
  try {
    if (!portfolioId && !userId) {
      // Fallback to mock data
      return mockHoldings.map(holding => ({
        id: holding.id.toString(),
        name: holding.name,
        symbol: holding.symbol,
        quantity: holding.quantity,
        price: holding.price,
        value: holding.value,
        averageBuyPrice: holding.price * 0.9,
        totalCost: holding.value * 0.9,
        profit: holding.value * 0.1,
        profitPercentage: 10,
        change24h: holding.change,
        allocation: holding.allocation
      }));
    }

    let allDbHoldings: DbHolding[] = [];

    if (portfolioId) {
      // Get holdings for specific portfolio
      const holdingsResult = await getDbPortfolioHoldings(portfolioId);
      if (holdingsResult.success && holdingsResult.data) {
        allDbHoldings = holdingsResult.data;
      }
    } else if (userId) {
      // Get holdings for all user portfolios
      const portfoliosResult = await getUserPortfolios(userId);
      if (portfoliosResult.success && portfoliosResult.data) {
        for (const portfolio of portfoliosResult.data) {
          const holdingsResult = await getDbPortfolioHoldings(portfolio.id);
          if (holdingsResult.success && holdingsResult.data) {
            allDbHoldings.push(...holdingsResult.data);
          }
        }
      }
    }

    // Convert database holdings to portfolio holdings with current market data
    const holdings: PortfolioHolding[] = [];
    for (const dbHolding of allDbHoldings) {
      const portfolioHolding = await convertDbHoldingToPortfolioHolding(dbHolding);
      if (portfolioHolding) {
        holdings.push(portfolioHolding);
      }
    }

    // Calculate allocation percentages
    const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
    holdings.forEach(holding => {
      holding.allocation = totalValue > 0 ? (holding.value / totalValue) * 100 : 0;
    });

    return holdings;
  } catch (error) {
    console.error('Error fetching portfolio holdings:', error);
    // Return mock data as fallback
    return mockHoldings.map(holding => ({
      id: holding.id.toString(),
      name: holding.name,
      symbol: holding.symbol,
      quantity: holding.quantity,
      price: holding.price,
      value: holding.value,
      averageBuyPrice: holding.price * 0.9,
      totalCost: holding.value * 0.9,
      profit: holding.value * 0.1,
      profitPercentage: 10,
      change24h: holding.change,
      allocation: holding.allocation
    }));
  }
};

/**
 * Convert database transaction to portfolio transaction
 */
const convertDbTransactionToPortfolioTransaction = (dbTransaction: DbTransaction): Transaction => {
  return {
    id: dbTransaction.id,
    type: dbTransaction.type.charAt(0).toUpperCase() + dbTransaction.type.slice(1) as 'Buy' | 'Sell' | 'Transfer' | 'Swap',
    coin: dbTransaction.coin_id, // We'll need to fetch coin name separately if needed
    symbol: dbTransaction.coin_id.toUpperCase(), // Simplified - should be actual symbol
    amount: dbTransaction.quantity,
    price: dbTransaction.price,
    value: dbTransaction.quantity * dbTransaction.price,
    fee: dbTransaction.fee || 0,
    date: dbTransaction.transaction_date,
    status: 'Completed', // Assuming all stored transactions are completed
    notes: dbTransaction.notes || undefined
  };
};

// Get transaction history (with real data integration)
export const getTransactionHistory = async (userId?: string): Promise<Transaction[]> => {
  try {
    if (!userId) {
      // Fallback to mock data
      return mockTransactions;
    }

    // Get user transactions from database
    const transactionsResult = await getUserTransactions(userId);
    if (!transactionsResult.success || !transactionsResult.data) {
      return [];
    }

    // Convert database transactions to portfolio transactions
    return transactionsResult.data.map(convertDbTransactionToPortfolioTransaction);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    // Fallback to mock data
    return mockTransactions;
  }
};

// Get portfolio performance (with real historical data)
export const getPortfolioPerformance = async (
  portfolioId?: string,
  currentValue?: number,
  currentCost?: number
): Promise<PortfolioPerformance> => {
  try {
    if (!portfolioId || currentValue === undefined || currentCost === undefined) {
      // Return mock data if no portfolio data available
      const mockPerformance: PortfolioPerformance = {
        daily: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: 37000 + Math.random() * 2000
        })),
        weekly: Array.from({ length: 4 }, (_, i) => ({
          date: new Date(Date.now() - (3 - i) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: 35000 + Math.random() * 5000
        })),
        monthly: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: 30000 + Math.random() * 10000
        })),
        yearly: Array.from({ length: 3 }, (_, i) => ({
          date: new Date(Date.now() - (2 - i) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: 20000 + Math.random() * 20000
        })),
        allTime: Array.from({ length: 10 }, (_, i) => ({
          date: new Date(Date.now() - (9 - i) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: 10000 + Math.random() * 30000
        }))
      };
      return mockPerformance;
    }

    // Import the portfolio history service
    const { getPortfolioPerformanceData, schedulePortfolioSnapshot } = await import('./portfolioHistoryService');

    // Schedule a snapshot for the current portfolio state
    await schedulePortfolioSnapshot(portfolioId, currentValue, currentCost);

    // Get real performance data
    const performanceData = await getPortfolioPerformanceData(portfolioId, currentValue, currentCost);

    return performanceData;
  } catch (error) {
    console.error('Error fetching portfolio performance:', error);

    // Fallback to mock data on error
    const mockPerformance: PortfolioPerformance = {
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: 37000 + Math.random() * 2000
      })),
      weekly: Array.from({ length: 4 }, (_, i) => ({
        date: new Date(Date.now() - (3 - i) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: 35000 + Math.random() * 5000
      })),
      monthly: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: 30000 + Math.random() * 10000
      })),
      yearly: Array.from({ length: 3 }, (_, i) => ({
        date: new Date(Date.now() - (2 - i) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: 20000 + Math.random() * 20000
      })),
      allTime: Array.from({ length: 10 }, (_, i) => ({
        date: new Date(Date.now() - (9 - i) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: 10000 + Math.random() * 30000
      }))
    };
    return mockPerformance;
  }
};

/**
 * Create a new portfolio for a user
 */
export const createPortfolio = async (
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
) => {
  return createDbPortfolio(userId, name, description, isPublic);
};

/**
 * Add a holding to a portfolio
 */
export const addHolding = async (
  portfolioId: string,
  coinId: string,
  quantity: number,
  purchasePrice?: number,
  purchaseDate?: string
) => {
  return addDbHolding(portfolioId, coinId, quantity, purchasePrice, purchaseDate);
};

/**
 * Add a transaction
 */
export const addTransaction = async (
  userId: string,
  type: 'buy' | 'sell' | 'transfer',
  coinId: string,
  quantity: number,
  price: number,
  fee?: number,
  notes?: string,
  transactionDate?: string
) => {
  return addDbTransaction(userId, type, coinId, quantity, price, fee, notes, transactionDate);
};

/**
 * Get user's portfolios
 */
export const getPortfolios = async (userId: string) => {
  return getUserPortfolios(userId);
};
