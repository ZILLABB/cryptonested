import { create } from 'zustand';

interface WebSocketState {
    isConnected: boolean;
    lastMessage: any;
    error: string | null;
    subscribe: (symbols: string[]) => void;
    unsubscribe: (symbols: string[]) => void;
    connect: () => void;
}

const WEBSOCKET_URL = 'wss://stream.binance.com:9443/ws';

export const useWebSocket = create<WebSocketState>((set, get) => {
    let ws: WebSocket | null = null;
    let subscribedSymbols: Set<string> = new Set();
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 5000;

    const connect = () => {
        if (typeof window === 'undefined') return; // Don't connect on server
        if (ws?.readyState === WebSocket.OPEN) return;

        try {
            ws = new WebSocket(WEBSOCKET_URL);
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            set({ error: 'Failed to create connection' });
            return;
        }

        ws.onopen = () => {
            console.log('WebSocket connected');
            set({ isConnected: true, error: null });
            reconnectAttempts = 0;

            // Resubscribe to all symbols
            if (subscribedSymbols.size > 0) {
                const symbols = Array.from(subscribedSymbols);
                subscribe(symbols);
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                set({ lastMessage: data });
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            set({ error: 'Connection error occurred' });
        };

        ws.onclose = () => {
            set({ isConnected: false });
            ws = null;

            // Attempt to reconnect
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                setTimeout(connect, RECONNECT_DELAY);
            } else {
                set({ error: 'Failed to connect after multiple attempts' });
            }
        };
    };

    const subscribe = (symbols: string[]) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            connect();
            // Add symbols to pending subscriptions
            symbols.forEach(symbol => subscribedSymbols.add(symbol));
            return;
        }

        const subscribeMessage = {
            method: 'SUBSCRIBE',
            params: symbols.map(symbol => `${symbol.toLowerCase()}@ticker`),
            id: Date.now()
        };

        ws.send(JSON.stringify(subscribeMessage));
        symbols.forEach(symbol => subscribedSymbols.add(symbol));
    };

    const unsubscribe = (symbols: string[]) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        const unsubscribeMessage = {
            method: 'UNSUBSCRIBE',
            params: symbols.map(symbol => `${symbol.toLowerCase()}@ticker`),
            id: Date.now()
        };

        ws.send(JSON.stringify(unsubscribeMessage));
        symbols.forEach(symbol => subscribedSymbols.delete(symbol));
    };

    // Don't auto-connect, let components decide when to connect

    return {
        isConnected: false,
        lastMessage: null,
        error: null,
        subscribe,
        unsubscribe,
        connect
    };
}); 