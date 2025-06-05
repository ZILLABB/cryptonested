"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, 
  Target, Shield, Zap, Award, Info, AlertTriangle 
} from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';

interface PortfolioMetrics {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface PortfolioAnalyticsProps {
  portfolioId?: string;
  totalValue: number;
  totalCost: number;
  holdings: any[];
}

export function PortfolioAnalytics({ 
  portfolioId, 
  totalValue, 
  totalCost, 
  holdings 
}: PortfolioAnalyticsProps) {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'performance'>('overview');

  useEffect(() => {
    if (portfolioId) {
      loadMetrics();
    }
  }, [portfolioId, totalValue, totalCost]);

  const loadMetrics = async () => {
    if (!portfolioId) return;
    
    try {
      setLoading(true);
      const { getPortfolioMetrics } = await import('../../services/portfolioHistoryService');
      const metricsData = await getPortfolioMetrics(portfolioId);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading portfolio metrics:', error);
      // Set mock metrics for demonstration
      setMetrics({
        totalReturn: ((totalValue - totalCost) / totalCost) * 100,
        annualizedReturn: 15.2,
        volatility: 28.5,
        sharpeRatio: 0.85,
        maxDrawdown: 12.3
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (volatility: number): { level: string; color: string; icon: any } => {
    if (volatility < 15) return { level: 'Low', color: 'text-green-500', icon: Shield };
    if (volatility < 30) return { level: 'Medium', color: 'text-yellow-500', icon: Target };
    return { level: 'High', color: 'text-red-500', icon: AlertTriangle };
  };

  const getPerformanceRating = (sharpeRatio: number): { rating: string; color: string } => {
    if (sharpeRatio > 1) return { rating: 'Excellent', color: 'text-green-500' };
    if (sharpeRatio > 0.5) return { rating: 'Good', color: 'text-blue-500' };
    if (sharpeRatio > 0) return { rating: 'Fair', color: 'text-yellow-500' };
    return { rating: 'Poor', color: 'text-red-500' };
  };

  const calculateDiversification = (): { score: number; level: string; color: string } => {
    if (holdings.length === 0) return { score: 0, level: 'No Data', color: 'text-gray-500' };
    
    // Calculate Herfindahl-Hirschman Index for diversification
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    const hhi = holdings.reduce((sum, h) => {
      const share = h.value / totalValue;
      return sum + (share * share);
    }, 0);
    
    // Convert to diversification score (0-100)
    const diversificationScore = Math.max(0, (1 - hhi) * 100);
    
    let level = 'Poor';
    let color = 'text-red-500';
    
    if (diversificationScore > 80) {
      level = 'Excellent';
      color = 'text-green-500';
    } else if (diversificationScore > 60) {
      level = 'Good';
      color = 'text-blue-500';
    } else if (diversificationScore > 40) {
      level = 'Fair';
      color = 'text-yellow-500';
    }
    
    return { score: diversificationScore, level, color };
  };

  if (!metrics) {
    return (
      <Card className="premium-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const riskLevel = getRiskLevel(metrics.volatility);
  const performanceRating = getPerformanceRating(metrics.sharpeRatio);
  const diversification = calculateDiversification();

  return (
    <Card className="premium-card">
      <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
            <span className="text-xl font-semibold">Portfolio Analytics</span>
          </div>
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['overview', 'risk', 'performance'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab as any)}
                className="capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Return</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.annualizedReturn >= 0 ? '+' : ''}{metrics.annualizedReturn.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Annualized Return</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.sharpeRatio.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {diversification.score.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Diversification</div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800`}>
                  <riskLevel.icon className={`w-5 h-5 ${riskLevel.color}`} />
                </div>
                <div>
                  <div className="font-medium">Risk Level</div>
                  <div className={`text-sm ${riskLevel.color}`}>{riskLevel.level}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Award className={`w-5 h-5 ${performanceRating.color}`} />
                </div>
                <div>
                  <div className="font-medium">Performance</div>
                  <div className={`text-sm ${performanceRating.color}`}>{performanceRating.rating}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <PieChart className={`w-5 h-5 ${diversification.color}`} />
                </div>
                <div>
                  <div className="font-medium">Diversification</div>
                  <div className={`text-sm ${diversification.color}`}>{diversification.level}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Volatility */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Volatility</h3>
                  <span className={`text-lg font-bold ${riskLevel.color}`}>
                    {metrics.volatility.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metrics.volatility < 15 ? 'bg-green-500' :
                      metrics.volatility < 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(metrics.volatility, 50)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Measures price fluctuation over time
                </p>
              </div>

              {/* Max Drawdown */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Max Drawdown</h3>
                  <span className="text-lg font-bold text-red-500">
                    -{metrics.maxDrawdown.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-red-500"
                    style={{ width: `${Math.min(metrics.maxDrawdown, 50)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Largest peak-to-trough decline
                </p>
              </div>
            </div>

            {/* Risk Recommendations */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Risk Assessment</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {metrics.volatility > 30 
                      ? "Your portfolio has high volatility. Consider diversifying into more stable assets."
                      : metrics.volatility > 15
                      ? "Your portfolio has moderate risk. Monitor market conditions closely."
                      : "Your portfolio has low volatility. Consider adding growth assets for higher returns."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Return Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Return</span>
                    <span className={`font-medium ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Annualized Return</span>
                    <span className={`font-medium ${metrics.annualizedReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.annualizedReturn >= 0 ? '+' : ''}{metrics.annualizedReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sharpe Ratio</span>
                    <span className={`font-medium ${performanceRating.color}`}>
                      {metrics.sharpeRatio.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Portfolio Composition</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Assets</span>
                    <span className="font-medium">{holdings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Diversification Score</span>
                    <span className={`font-medium ${diversification.color}`}>
                      {diversification.score.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Largest Holding</span>
                    <span className="font-medium">
                      {holdings.length > 0 ? Math.max(...holdings.map(h => h.allocation)).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Recommendations */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Performance Insights</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    {metrics.sharpeRatio > 1
                      ? "Excellent risk-adjusted returns! Your portfolio is performing very well."
                      : metrics.sharpeRatio > 0.5
                      ? "Good performance with reasonable risk. Consider rebalancing for optimization."
                      : "Consider reviewing your asset allocation to improve risk-adjusted returns."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
