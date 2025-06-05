/**
 * Real-time Price Update Service
 * Manages WebSocket connections for live cryptocurrency price updates
 */

import { useState, useEffect } from 'react';

interface PriceUpdate {
  symbol: string;
  price: number;
  change24h: number;
  timestamp: number;
}

interface PriceSubscription {
  symbols: string[];
  callback: (updates: PriceUpdate[]) => void;
}

class PriceUpdateService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, PriceSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private isConnecting = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  /**
   * Connect to WebSocket
   */
  private connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    try {
      // Using CoinCap WebSocket API for real-time prices
      this.ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana,cardano,polkadot,chainlink,avalanche-2,uniswap,polygon,litecoin,ripple,tether');

      this.ws.onopen = () => {
        console.log('Price WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handlePriceUpdate(data);
        } catch (error) {
          console.error('Error parsing price data:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Price WebSocket disconnected');
        this.isConnecting = false;
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('Price WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Handle incoming price updates
   */
  private handlePriceUpdate(data: any) {
    const updates: PriceUpdate[] = [];
    
    // CoinCap sends data in format: { bitcoin: "45000.123", ethereum: "3000.456" }
    for (const [coinId, priceStr] of Object.entries(data)) {
      const price = parseFloat(priceStr as string);
      if (!isNaN(price)) {
        // Map coin IDs to symbols
        const symbol = this.mapCoinIdToSymbol(coinId);
        if (symbol) {
          updates.push({
            symbol,
            price,
            change24h: 0, // CoinCap WebSocket doesn't provide 24h change, would need separate API call
            timestamp: Date.now()
          });
        }
      }
    }

    if (updates.length > 0) {
      this.notifySubscribers(updates);
    }
  }

  /**
   * Map CoinCap coin IDs to symbols
   */
  private mapCoinIdToSymbol(coinId: string): string | null {
    const mapping: { [key: string]: string } = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'solana': 'SOL',
      'cardano': 'ADA',
      'polkadot': 'DOT',
      'chainlink': 'LINK',
      'avalanche-2': 'AVAX',
      'uniswap': 'UNI',
      'polygon': 'MATIC',
      'litecoin': 'LTC',
      'ripple': 'XRP',
      'tether': 'USDT'
    };
    return mapping[coinId] || null;
  }

  /**
   * Notify all subscribers of price updates
   */
  private notifySubscribers(updates: PriceUpdate[]) {
    this.subscriptions.forEach((subscription) => {
      const relevantUpdates = updates.filter(update => 
        subscription.symbols.includes(update.symbol)
      );
      
      if (relevantUpdates.length > 0) {
        try {
          subscription.callback(relevantUpdates);
        } catch (error) {
          console.error('Error in price update callback:', error);
        }
      }
    });
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnection in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        // Send ping to keep connection alive
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Subscribe to price updates for specific symbols
   */
  public subscribe(id: string, symbols: string[], callback: (updates: PriceUpdate[]) => void) {
    this.subscriptions.set(id, { symbols, callback });
    
    // If not connected, try to connect
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect();
    }
  }

  /**
   * Unsubscribe from price updates
   */
  public unsubscribe(id: string) {
    this.subscriptions.delete(id);
    
    // If no more subscriptions, close connection
    if (this.subscriptions.size === 0 && this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' {
    if (this.isConnecting) return 'connecting';
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return 'connected';
    return 'disconnected';
  }

  /**
   * Force reconnection
   */
  public reconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.reconnectAttempts = 0;
    this.connect();
  }

  /**
   * Cleanup
   */
  public destroy() {
    this.subscriptions.clear();
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create singleton instance
export const priceUpdateService = new PriceUpdateService();

// Hook for React components
export function usePriceUpdates(symbols: string[], enabled: boolean = true) {
  const [prices, setPrices] = useState<Map<string, PriceUpdate>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    if (!enabled || symbols.length === 0) return;

    const subscriptionId = `subscription_${Date.now()}_${Math.random()}`;
    
    const handlePriceUpdate = (updates: PriceUpdate[]) => {
      setPrices(prev => {
        const newPrices = new Map(prev);
        updates.forEach(update => {
          newPrices.set(update.symbol, update);
        });
        return newPrices;
      });
    };

    // Subscribe to price updates
    priceUpdateService.subscribe(subscriptionId, symbols, handlePriceUpdate);

    // Update connection status
    const updateStatus = () => {
      setConnectionStatus(priceUpdateService.getConnectionStatus());
    };
    
    updateStatus();
    const statusInterval = setInterval(updateStatus, 1000);

    return () => {
      priceUpdateService.unsubscribe(subscriptionId);
      clearInterval(statusInterval);
    };
  }, [symbols, enabled]);

  return {
    prices: Object.fromEntries(prices),
    connectionStatus,
    reconnect: () => priceUpdateService.reconnect()
  };
}

// Export types
export type { PriceUpdate };
