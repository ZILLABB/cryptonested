'use client';

import { useEffect, useCallback } from 'react';
import { usePrices } from '../contexts/PriceContext.js';

interface UseLivePricesProps {
  symbols?: string[];
  autoSubscribe?: boolean;
}

export const useLivePrices = ({ 
  symbols = [], 
  autoSubscribe = true 
}: UseLivePricesProps = {}) => {
  const { 
    prices, 
    loading, 
    error, 
    subscribe, 
    unsubscribe, 
    subscribedSymbols 
  } = usePrices();

  // Subscribe to price updates when the component mounts
  useEffect(() => {
    if (autoSubscribe && symbols.length > 0) {
      subscribe(symbols);
      
      // Cleanup subscription when component unmounts
      return () => {
        unsubscribe(symbols);
      };
    }
  }, [autoSubscribe, subscribe, symbols, unsubscribe]);

  // Get the current price for a specific symbol
  const getPrice = useCallback((symbol: string): string | null => {
    const normalizedSymbol = symbol.toLowerCase();
    return prices[normalizedSymbol] || null;
  }, [prices]);

  // Get prices for multiple symbols
  const getPrices = useCallback((symbols: string[]): Record<string, string> => {
    return symbols.reduce((acc, symbol) => {
      const normalizedSymbol = symbol.toLowerCase();
      if (prices[normalizedSymbol]) {
        acc[normalizedSymbol] = prices[normalizedSymbol];
      }
      return acc;
    }, {} as Record<string, string>);
  }, [prices]);

  // Check if a symbol is being tracked
  const isSubscribed = useCallback((symbol: string): boolean => {
    return subscribedSymbols.includes(symbol.toLowerCase());
  }, [subscribedSymbols]);

  return {
    prices,
    loading,
    error,
    getPrice,
    getPrices,
    isSubscribed,
    subscribe,
    unsubscribe,
    subscribedSymbols
  };
};
