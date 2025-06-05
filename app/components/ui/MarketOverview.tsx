"use client";

import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from './Card';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { MarketData } from '../../services/cryptoService';
import { formatNumber } from '../../services/dashboardService';

interface MarketOverviewProps {
  marketData: MarketData;
}

export function MarketOverview({ marketData }: MarketOverviewProps) {
  return (
    <Card className="premium-card overflow-hidden">
      <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Activity className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
          <span className="text-xl font-semibold">Market Overview</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Total Market Cap */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/30">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Global</div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Market Cap</h3>
            <p className="text-xl font-bold">${formatNumber(marketData.totalMarketCap)}</p>
          </div>
          
          {/* 24h Volume */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800/30">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-xs font-medium text-purple-600 dark:text-purple-400">24h</div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Trading Volume</h3>
            <p className="text-xl font-bold">${formatNumber(marketData.totalVolume)}</p>
          </div>
          
          {/* BTC Dominance */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-800/30">
                <PieChart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-xs font-medium text-amber-600 dark:text-amber-400">BTC</div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">BTC Dominance</h3>
            <p className="text-xl font-bold">{marketData.btcDominance}%</p>
          </div>
          
          {/* ETH Dominance */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-800/30">
                <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">ETH</div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ETH Dominance</h3>
            <p className="text-xl font-bold">{marketData.ethDominance}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
