'use client';

import { useEffect } from 'react';
import { useLivePrices } from '../../hooks/useLivePrices.js';
import { ArrowUp, ArrowDown } from 'lucide-react';

type CryptoData = {
  id: string;
  name: string;
  symbol: string;
  price: string | null;
  change24h: number;
};

export function LivePricesTicker() {
  const { prices, loading, subscribe } = useLivePrices({
    symbols: ['bitcoin', 'ethereum', 'cardano', 'solana', 'ripple'],
    autoSubscribe: true
  });

  // Format price with proper currency formatting
  const formatPrice = (price: string | null) => {
    if (!price) return { formatted: '$0.00', value: 0 };
    const value = parseFloat(price);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return { formatted, value };
  };

  // Get CSS class for price change
  const getPriceChangeClass = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  // Get icon for price change
  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-3 h-3" />;
    if (change < 0) return <ArrowDown className="w-3 h-3" />;
    return null;
  };

  // Static data for crypto info (in a real app, this would come from an API)
  const cryptos: CryptoData[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: prices.bitcoin, change24h: 0 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: prices.ethereum, change24h: 0 },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: prices.cardano, change24h: 0 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: prices.solana, change24h: 0 },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', price: prices.ripple, change24h: 0 },
  ];

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="py-2 px-4">
          <div className="flex items-center space-x-8 overflow-x-auto hide-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-2 whitespace-nowrap">
                <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="py-2 px-4">
        <div className="flex items-center space-x-8 overflow-x-auto hide-scrollbar">
          {cryptos.map((crypto) => {
            const price = formatPrice(crypto.price);
            const changeClass = getPriceChangeClass(crypto.change24h);
            const changeIcon = getPriceChangeIcon(crypto.change24h);
            
            return (
              <div key={crypto.id} className="flex items-center space-x-2 whitespace-nowrap">
                <span className="font-medium text-gray-900 dark:text-white">{crypto.symbol}</span>
                <span className="text-gray-900 dark:text-white">{price.formatted}</span>
                <span className={`text-sm ${changeClass} flex items-center`}>
                  {changeIcon} {Math.abs(crypto.change24h).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
