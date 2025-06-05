import { create } from 'zustand';
import { useMarketData, CryptoPrice } from './marketData';

interface PriceAlert {
    id: string;
    symbol: string;
    targetPrice: number;
    condition: 'above' | 'below';
    triggered: boolean;
    createdAt: number;
}

interface NotificationState {
    alerts: PriceAlert[];
    addAlert: (alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => void;
    removeAlert: (id: string) => void;
    checkAlerts: (price: CryptoPrice) => void;
    clearAlerts: () => void;
}

export const usePriceNotifications = create<NotificationState>((set, get) => {
    // Subscribe to market data updates
    const unsubscribe = useMarketData.subscribe(
        state => state.prices,
        prices => {
            Object.values(prices).forEach(price => {
                get().checkAlerts(price);
            });
        }
    );

    return {
        alerts: [],

        addAlert: (alert) => {
            const newAlert: PriceAlert = {
                ...alert,
                id: Math.random().toString(36).substr(2, 9),
                triggered: false,
                createdAt: Date.now()
            };

            set(state => ({
                alerts: [...state.alerts, newAlert]
            }));

            // Check if the alert should be triggered immediately
            const currentPrice = useMarketData.getState().getPrice(alert.symbol);
            if (currentPrice) {
                get().checkAlerts(currentPrice);
            }
        },

        removeAlert: (id) => {
            set(state => ({
                alerts: state.alerts.filter(alert => alert.id !== id)
            }));
        },

        checkAlerts: (price) => {
            const alerts = get().alerts;
            const triggeredAlerts: PriceAlert[] = [];

            alerts.forEach(alert => {
                if (alert.symbol === price.symbol && !alert.triggered) {
                    const shouldTrigger = alert.condition === 'above'
                        ? price.price >= alert.targetPrice
                        : price.price <= alert.targetPrice;

                    if (shouldTrigger) {
                        triggeredAlerts.push({
                            ...alert,
                            triggered: true
                        });

                        // Show notification
                        if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification('Price Alert', {
                                body: `${alert.symbol} is now ${alert.condition} ${alert.targetPrice}`,
                                icon: '/logo.png'
                            });
                        }
                    }
                }
            });

            if (triggeredAlerts.length > 0) {
                set(state => ({
                    alerts: state.alerts.map(alert =>
                        triggeredAlerts.find(t => t.id === alert.id) || alert
                    )
                }));
            }
        },

        clearAlerts: () => {
            set({ alerts: [] });
        }
    };
});

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
};

// Format price for display
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
};

// Format percentage for display
export const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value / 100);
}; 