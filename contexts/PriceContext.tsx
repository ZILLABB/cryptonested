'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import WebSocketService from '../lib/services/websocket.js';

interface PriceData {
  [key: string]: string; // e.g., { bitcoin: '50000.00', ethereum: '3000.00' }
}
interface PriceContextType {
  prices: PriceData;
  loading: boolean;
  error: string | null;
  subscribedSymbols: string[];
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribedSymbols, setSubscribedSymbols] = useState<string[]>([]);
  const wsService = WebSocketService.getInstance();

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((data: any) => {
    setPrices(prevPrices => ({
      ...prevPrices,
      ...data
    }));
  }, []);

  // Setup WebSocket connection and message handler
  useEffect(() => {
    wsService.connect();
    
    // Subscribe to the message handler
    const cleanup = wsService.addMessageHandler(handleMessage);

    return () => {
      // Cleanup message handler on unmount
      cleanup();
    };
  }, [handleMessage, wsService]);

  // Subscribe to price updates for specific symbols
  const subscribe = useCallback((symbols: string[]) => {
    try {
      setLoading(true);
      // Filter out already subscribed symbols
      const newSymbols = symbols.filter(sym => !subscribedSymbols.includes(sym));
      
      if (newSymbols.length > 0) {
        // Update the WebSocket subscription
        wsService.subscribeToSymbols(newSymbols);
        // Update the local state
        setSubscribedSymbols(prev => [...new Set([...prev, ...newSymbols])]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error subscribing to symbols:', err);
      setError('Failed to subscribe to price updates');
      setLoading(false);
    }
  }, [subscribedSymbols, wsService]);

  // Unsubscribe from price updates for specific symbols
  const unsubscribe = useCallback((symbols: string[]) => {
    try {
      setLoading(true);
      // Update the WebSocket subscription
      wsService.unsubscribeFromSymbols(symbols);
      // Update the local state
      setSubscribedSymbols(prev => prev.filter(sym => !symbols.includes(sym)));
      setLoading(false);
    } catch (err) {
      console.error('Error unsubscribing from symbols:', err);
      setError('Failed to unsubscribe from price updates');
      setLoading(false);
    }
  }, [wsService]);

  return (
    <PriceContext.Provider value={{
      prices,
      loading,
      error,
      subscribedSymbols,
      subscribe,
      unsubscribe
    }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrices = (): PriceContextType => {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error('usePrices must be used within a PriceProvider');
  }
  return context;
};
