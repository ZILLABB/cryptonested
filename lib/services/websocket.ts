type MessageHandler = (data: any) => void;

export interface SubscriptionMessage {
  [key: string]: string; // e.g., { bitcoin: '50000.00', ethereum: '3000.00' }
}

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect() {
    if (this.isConnected() || this.isConnecting) return;

    this.isConnecting = true;
    this.socket = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano,solana,ripple');

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.isConnecting = false;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyHandlers(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnecting = false;
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.socket?.close();
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
      
      console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public subscribe(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    
    // Auto-connect if not already connected
    if (!this.isConnected() && !this.isConnecting) {
      this.connect();
    }

    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(handler);
      
      // Disconnect if no more handlers
      if (this.messageHandlers.size === 0) {
        this.disconnect();
      }
    };
  }

  private notifyHandlers(data: SubscriptionMessage) {
    this.messageHandlers.forEach(handler => handler(data));
  }

  public addMessageHandler(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.removeMessageHandler(handler);
  }

  public removeMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
  }

  public subscribeToSymbols(symbols: string[]): void {
    // In a real implementation, this would send a message to the WebSocket
    // to subscribe to the given symbols
    console.log('Subscribing to symbols:', symbols);
  }

  public unsubscribeFromSymbols(symbols: string[]): void {
    // In a real implementation, this would send a message to the WebSocket
    // to unsubscribe from the given symbols
    console.log('Unsubscribing from symbols:', symbols);
  }
}

export function useWebSocket(onMessage: MessageHandler, dependencies: any[] = []) {
  console.warn('useWebSocket hook is not implemented with React hooks in this version');
  
  const wsService = WebSocketService.getInstance();
  
  const handleMessage = (data: any) => {
    onMessage(data);
  };

  wsService.addMessageHandler(handleMessage);
  
  // No cleanup in this simplified version
  // In a real implementation, you would return a cleanup function
  // that removes the message handler
}

export default WebSocketService;
