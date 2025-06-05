"use client";

import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from './Card';
import { Clock, ArrowRight, ArrowUpRight, ArrowDownRight, RefreshCw, Shuffle } from 'lucide-react';
import { Transaction } from '../../services/portfolioService';
import { formatCurrency, formatDateTime } from '../../services/dashboardService';
import Link from 'next/link';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions, compact = false }: RecentTransactionsProps & { compact?: boolean }) {
  // Function to get the appropriate icon for each transaction type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Buy':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'Sell':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'Transfer':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'Swap':
        return <Shuffle className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Function to get the appropriate color for each transaction type
  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'Buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Transfer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Swap':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Card className="premium-card overflow-hidden">
      <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
            <span className="text-xl font-semibold">Recent Transactions</span>
          </div>
          <Link
            href="/portfolio"
            className="text-sm flex items-center text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:underline"
          >
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {compact ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactions.slice(0, 4).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${getTransactionColor(tx.type)}`}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{tx.type} {tx.symbol}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(tx.date).split(',')[0]}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{formatCurrency(tx.value)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-4 ${getTransactionColor(tx.type)}`}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="font-semibold">{tx.coin}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tx.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })} {tx.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(tx.value)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(tx.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
