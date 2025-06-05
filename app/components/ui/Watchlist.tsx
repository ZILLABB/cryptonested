"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Plus, Search, TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import { Button } from './Button';
import { addToWatchlist, removeFromWatchlist } from '../../../lib/watchlist';
import { useAuth } from '../../../contexts/AuthContext';

interface WatchlistItem {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
}

interface WatchlistProps {
  watchlist: WatchlistItem[];
  onAddToWatchlist?: (coinId: string) => void;
  onRemoveFromWatchlist?: (coinId: string) => void;
}

export function Watchlist({ watchlist, onAddToWatchlist, onRemoveFromWatchlist }: WatchlistProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCoin, setNewCoin] = useState('');

  const filteredWatchlist = watchlist.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToWatchlist = async () => {
    if (!newCoin.trim() || !user) return;

    try {
      if (onAddToWatchlist) {
        onAddToWatchlist(newCoin);
      } else if (user) {
        await addToWatchlist(user.id, newCoin);
      }
      setNewCoin('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const handleRemoveFromWatchlist = async (coinId: string) => {
    if (!user) return;

    try {
      if (onRemoveFromWatchlist) {
        onRemoveFromWatchlist(coinId);
      } else if (user) {
        await removeFromWatchlist(user.id, coinId);
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
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
        <h2 className="text-2xl font-semibold">Watchlist</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-full text-sm bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-400)] w-40"
            />
          </div>
          <Button
            onClick={() => setIsAdding(!isAdding)}
            className="p-2.5 rounded-full bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white shadow-md"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isAdding && (
        <motion.div
          className="mb-6 p-5 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter coin symbol (e.g., BTC)"
              value={newCoin}
              onChange={(e) => setNewCoin(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-400)] shadow-sm"
            />
            <Button
              onClick={handleAddToWatchlist}
              className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white px-5 py-2.5 text-base shadow-md"
            >
              Add
            </Button>
          </div>
        </motion.div>
      )}

      <div className="space-y-5">
        {filteredWatchlist.length > 0 ? (
          filteredWatchlist.map((item) => (
            <motion.div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              whileHover={{ scale: 1.02, x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 mr-4 relative">
                  <Image
                    src={`https://cryptologos.cc/logos/${item.name.toLowerCase()}-${item.symbol.toLowerCase()}-logo.png`}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/40x40/png?text=${item.symbol}`;
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-base">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.symbol}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="font-semibold text-base">${item.price.toLocaleString()}</p>
                  <p className={`text-sm flex items-center justify-end font-medium ${item.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change24h >= 0 ? <TrendingUp className="h-4 w-4 mr-1.5" /> : <TrendingDown className="h-4 w-4 mr-1.5" />}
                    {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFromWatchlist(item.symbol)}
                  className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                >
                  <EyeOff className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10">
            <Eye className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No coins in your watchlist</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {searchTerm ? 'Try a different search term' : 'Click the + button to add coins'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
