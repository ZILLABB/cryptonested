'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from '../lib/services/websocket.js';

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

  // Handle WebSocket messages
  const handleMessage = (data: any) => {
    setIsLoading(false);
    setError(null);
    
    // Update prices with new data
    setPrices(prevPrices => ({
      ...prevPrices,
      ...data
    }));
  };

  // Set up WebSocket connection
  const { isConnected } = useWebSocket(handleMessage);

  // Handle connection status changes
  useEffect(() => {
    if (!isConnected) {
      setIsLoading(true);
      setError('Disconnected from price updates. Reconnecting...');
    } else {
      setError(null);
    }
  }, [isConnected]);

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
