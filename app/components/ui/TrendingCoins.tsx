"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from './Card';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { SimpleCryptoCoin } from '../../services/cryptoService';
import { formatCurrency, formatPercentage } from '../../services/dashboardService';
import Link from 'next/link';

interface TrendingCoinsProps {
  coins: SimpleCryptoCoin[];
}

export function TrendingCoins({ coins }: TrendingCoinsProps) {
  return (
    <Card className="premium-card overflow-hidden">
      <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
            <span className="text-xl font-semibold">Trending Coins</span>
          </div>
          <Link 
            href="/market" 
            className="text-sm flex items-center text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:underline"
          >
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {coins.map((coin) => (
            <div 
              key={coin.id} 
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 mr-4">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <div className="font-semibold">{coin.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(coin.price)}</div>
                <div className={`text-sm ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(coin.change24h)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
