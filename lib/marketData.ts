import { create } from 'zustand';
import { useWebSocket } from './websocket';

export interface CryptoPrice {
    symbol: string;
    price: number;
    priceChange: number;
    priceChangePercent: number;
    volume: number;
    marketCap: number;
    lastUpdate: number;
}

interface MarketDataState {
    prices: Record<string, CryptoPrice>;
    isLoading: boolean;
    error: string | null;
    subscribeToSymbols: (symbols: string[]) => void;
    unsubscribeFromSymbols: (symbols: string[]) => void;
    getPrice: (symbol: string) => CryptoPrice | null;
    getAllPrices: () => CryptoPrice[];
}

export const useMarketData = create<MarketDataState>((set, get) => {
    const ws = useWebSocket.getState();

    // Subscribe to WebSocket updates
    ws.subscribe(['btcusdt', 'ethusdt', 'bnbusdt']); // Default subscriptions

    // Handle WebSocket messages
    const handleWebSocketMessage = (message: any) => {
        if (!message.s) return; // Not a price update

        const symbol = message.s.replace('USDT', '');
        const price = parseFloat(message.c);
        const priceChange = parseFloat(message.p);
        const priceChangePercent = parseFloat(message.P);
        const volume = parseFloat(message.v) * price; // 24h volume in USD
        const marketCap = volume * 24; // Rough estimate of market cap

        set(state => ({
            prices: {
                ...state.prices,
                [symbol]: {
                    symbol,
                    price,
                    priceChange,
                    priceChangePercent,
                    volume,
                    marketCap,
                    lastUpdate: Date.now()
                }
            }
        }));
    };

    // Subscribe to WebSocket updates
    const unsubscribe = useWebSocket.subscribe(
        state => state.lastMessage,
        message => {
            if (message) {
                handleWebSocketMessage(message);
            }
        }
    );

    return {
        prices: {},
        isLoading: false,
        error: null,

        subscribeToSymbols: (symbols: string[]) => {
            const formattedSymbols = symbols.map(s => `${s.toLowerCase()}usdt`);
            ws.subscribe(formattedSymbols);
        },

        unsubscribeFromSymbols: (symbols: string[]) => {
            const formattedSymbols = symbols.map(s => `${s.toLowerCase()}usdt`);
            ws.unsubscribe(formattedSymbols);
        },

        getPrice: (symbol: string) => {
            return get().prices[symbol] || null;
        },

        getAllPrices: () => {
            return Object.values(get().prices);
        }
    };
});

// Helper functions for market data calculations
export const calculateMarketCap = (price: number, circulatingSupply: number): number => {
    return price * circulatingSupply;
};

export const calculateVolume24h = (price: number, volume: number): number => {
    return price * volume;
};

export const calculatePriceChange = (currentPrice: number, previousPrice: number): number => {
    return currentPrice - previousPrice;
};

export const calculatePriceChangePercent = (currentPrice: number, previousPrice: number): number => {
    return ((currentPrice - previousPrice) / previousPrice) * 100;
};

// Data validation
export const validatePriceData = (data: any): boolean => {
    if (!data || typeof data !== 'object') return false;

    const requiredFields = ['symbol', 'price', 'priceChange', 'priceChangePercent', 'volume', 'marketCap'];
    return requiredFields.every(field => field in data);
};

// Error recovery
export const handleMarketDataError = (error: any): string => {
    console.error('Market data error:', error);

    if (error.response) {
        // API error
        return `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
    } else if (error.request) {
        // Network error
        return 'Network error: Unable to connect to the server';
    } else {
        // Other error
        return `Error: ${error.message || 'Unknown error occurred'}`;
    }
}; 