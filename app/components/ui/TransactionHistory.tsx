"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Filter, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: number;
  type: 'Buy' | 'Sell' | 'Transfer';
  coin: string;
  symbol: string;
  amount: number;
  price: number;
  value: number;
  date: string;
  status: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'transfer'>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    // Filter by transaction type
    if (filter !== 'all') {
      if (filter === 'buy' && transaction.type !== 'Buy') return false;
      if (filter === 'sell' && transaction.type !== 'Sell') return false;
      if (filter === 'transfer' && transaction.type !== 'Transfer') return false;
    }

    // Filter by time range
    if (timeRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();

      if (timeRange === 'week' && (now.getTime() - transactionDate.getTime() > 7 * 24 * 60 * 60 * 1000)) {
        return false;
      }

      if (timeRange === 'month' && (now.getTime() - transactionDate.getTime() > 30 * 24 * 60 * 60 * 1000)) {
        return false;
      }

      if (timeRange === 'year' && (now.getTime() - transactionDate.getTime() > 365 * 24 * 60 * 60 * 1000)) {
        return false;
      }
    }

    return true;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Buy':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'Sell':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'Transfer':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'Buy':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'Sell':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'Transfer':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      className="premium-card p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Transaction History</h2>
        <div className="relative">
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-4 shadow-sm"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isFilterOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-5 z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-3">Transaction Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['all', 'buy', 'sell', 'transfer'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter(type as any)}
                      className={`px-4 py-2 text-sm rounded-full capitalize ${filter === type ? 'bg-[var(--primary-500)] text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                      {type === 'all' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Time Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['all', 'week', 'month', 'year'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range as any)}
                      className={`px-4 py-2 text-sm rounded-full capitalize ${timeRange === range ? 'bg-[var(--primary-500)] text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                      {range === 'all' ? 'All Time' : `Last ${range}`}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              className="flex items-center justify-between p-5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02, x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-5 shadow-md ${getTransactionColor(transaction.type)}`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full mr-3 ${getTransactionColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                    <h3 className="font-semibold text-base">{transaction.coin}</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                    {transaction.amount} {transaction.symbol} @ ${transaction.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-base">${transaction.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end mt-1.5">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <RefreshCw className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Try changing your filters or add a new transaction
            </p>
          </div>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="mt-6 text-center">
          <Button className="text-[var(--primary-500)] hover:text-[var(--primary-600)] bg-transparent hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/10 py-2.5 px-5 text-base font-medium">
            View All Transactions
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
