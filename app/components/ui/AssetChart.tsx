"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, TrendingDown, BarChart3, Calendar, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AssetChartProps {
  coinId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  isOpen: boolean;
  onClose: () => void;
}

interface PriceData {
  timestamp: number;
  price: number;
}

interface TechnicalIndicator {
  sma20: number;
  sma50: number;
  rsi: number;
  volume: number;
}

export function AssetChart({ 
  coinId, 
  symbol, 
  name, 
  currentPrice, 
  change24h, 
  isOpen, 
  onClose 
}: AssetChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicator | null>(null);
  const [timeRange, setTimeRange] = useState<'1D' | '7D' | '30D' | '90D' | '1Y'>('7D');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && coinId) {
      fetchPriceData();
    }
  }, [isOpen, coinId, timeRange]);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate days based on time range
      const days = {
        '1D': 1,
        '7D': 7,
        '30D': 30,
        '90D': 90,
        '1Y': 365
      }[timeRange];

      // Fetch historical price data from CoinGecko
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }

      const data = await response.json();
      
      // Transform data
      const prices: PriceData[] = data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price
      }));

      setPriceData(prices);

      // Calculate technical indicators
      if (prices.length >= 50) {
        const recentPrices = prices.slice(-50).map(p => p.price);
        const sma20 = calculateSMA(recentPrices.slice(-20));
        const sma50 = calculateSMA(recentPrices);
        const rsi = calculateRSI(recentPrices.slice(-14));
        
        setIndicators({
          sma20,
          sma50,
          rsi,
          volume: 0 // Would need separate API call for volume
        });
      }
    } catch (err: any) {
      console.error('Error fetching price data:', err);
      setError(err.message);
      
      // Generate mock data for demonstration
      const mockData = generateMockPriceData(currentPrice, timeRange);
      setPriceData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const calculateSMA = (prices: number[]): number => {
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  };

  const calculateRSI = (prices: number[]): number => {
    if (prices.length < 2) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }
    
    const avgGain = gains / (prices.length - 1);
    const avgLoss = losses / (prices.length - 1);
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  const generateMockPriceData = (basePrice: number, range: string): PriceData[] => {
    const days = {
      '1D': 1,
      '7D': 7,
      '30D': 30,
      '90D': 90,
      '1Y': 365
    }[range];

    const points = range === '1D' ? 24 : days;
    const interval = range === '1D' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 hour or 1 day
    const now = Date.now();
    
    const data: PriceData[] = [];
    
    for (let i = points; i >= 0; i--) {
      const timestamp = now - (i * interval);
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = basePrice * (1 + variation * (i / points));
      
      data.push({
        timestamp,
        price: Math.max(price, basePrice * 0.5) // Minimum 50% of base price
      });
    }
    
    return data;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    if (timeRange === '1D') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = {
    labels: priceData.map(d => formatDate(d.timestamp)),
    datasets: [
      {
        label: `${symbol} Price`,
        data: priceData.map(d => d.price),
        borderColor: change24h >= 0 ? '#10B981' : '#EF4444',
        backgroundColor: change24h >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: change24h >= 0 ? '#10B981' : '#EF4444',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: change24h >= 0 ? '#10B981' : '#EF4444',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            return `${symbol}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 8,
          color: '#6B7280'
        }
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          callback: (value: any) => `$${value.toLocaleString()}`
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-500">{symbol}</span>
                <span className="text-2xl font-bold">${currentPrice.toLocaleString()}</span>
                <div className={`flex items-center space-x-1 ${change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Price Chart</span>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['1D', '7D', '30D', '90D', '1Y'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="px-3 py-1"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              <p>Error loading chart data: {error}</p>
            </div>
          ) : (
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}

          {/* Technical Indicators */}
          {indicators && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-500">SMA 20</div>
                <div className="font-medium">${indicators.sma20.toLocaleString()}</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-500">SMA 50</div>
                <div className="font-medium">${indicators.sma50.toLocaleString()}</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-500">RSI</div>
                <div className={`font-medium ${
                  indicators.rsi > 70 ? 'text-red-500' : 
                  indicators.rsi < 30 ? 'text-green-500' : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {indicators.rsi.toFixed(1)}
                </div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-500">Signal</div>
                <div className={`font-medium ${
                  indicators.rsi > 70 ? 'text-red-500' : 
                  indicators.rsi < 30 ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {indicators.rsi > 70 ? 'Overbought' : 
                   indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
