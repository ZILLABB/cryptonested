'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from '../lib/websocket';

type CryptoPrices = {
  bitcoin?: string;
  ethereum?: string;
  cardano?: string;
  solana?: string;
  ripple?: string;
  [key: string]: string | undefined;
};

type CryptoPricesContextType = {
  prices: CryptoPrices;
  isLoading: boolean;
  error: string | null;
};

const CryptoPricesContext = createContext<CryptoPricesContextType | undefined>(
  undefined
);

export function CryptoPricesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prices, setPrices] = useState<CryptoPrices>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up WebSocket connection
  const { isConnected, lastMessage, error: wsError, subscribe, connect } = useWebSocket();

  // Initialize connection on mount
  useEffect(() => {
    connect();
  }, [connect]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      setIsLoading(false);
      setError(null);

      // Update prices with new data
      setPrices(prevPrices => ({
        ...prevPrices,
        [lastMessage.s]: lastMessage.c // symbol: current price
      }));
    }
  }, [lastMessage]);

  // Handle connection status changes
  useEffect(() => {
    if (!isConnected) {
      setIsLoading(true);
      setError('Disconnected from price updates. Reconnecting...');
    } else {
      setError(null);
      // Subscribe to popular crypto symbols when connected
      subscribe(['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'XRPUSDT']);
    }
  }, [isConnected, subscribe]);

  // Handle WebSocket errors
  useEffect(() => {
    if (wsError) {
      setError(wsError);
      setIsLoading(false);
    }
  }, [wsError]);

  return (
    <CryptoPricesContext.Provider value={{ prices, isLoading, error }}>
      {children}
    </CryptoPricesContext.Provider>
  );
}

export const useCryptoPrices = (): CryptoPricesContextType => {
  const context = useContext(CryptoPricesContext);
  if (context === undefined) {
    throw new Error('useCryptoPrices must be used within a CryptoPricesProvider');
  }
  return context;
};
