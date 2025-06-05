import { supabase } from './supabase';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

let sessionTimeoutId: NodeJS.Timeout | null = null;
let refreshTimeoutId: NodeJS.Timeout | null = null;

export const sessionManager = {
    startSessionTimer: () => {
        // Clear any existing timers
        if (sessionTimeoutId) clearTimeout(sessionTimeoutId);
        if (refreshTimeoutId) clearTimeout(refreshTimeoutId);

        // Set up session timeout
        sessionTimeoutId = setTimeout(async () => {
            await supabase.auth.signOut();
            window.location.href = '/auth/signin?reason=inactivity';
        }, SESSION_TIMEOUT);

        // Set up refresh timer
        refreshTimeoutId = setTimeout(async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (session) {
                    await supabase.auth.refreshSession();
                }
            } catch (error) {
                console.error('Error refreshing session:', error);
            }
        }, SESSION_TIMEOUT - REFRESH_THRESHOLD);
    },

    resetSessionTimer: () => {
        sessionManager.startSessionTimer();
    },

    clearSessionTimers: () => {
        if (sessionTimeoutId) clearTimeout(sessionTimeoutId);
        if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
    }
};

// Activity tracking
let lastActivity = Date.now();

const resetActivityTimer = () => {
    lastActivity = Date.now();
    sessionManager.resetSessionTimer();
};

// Track user activity
export const setupActivityTracking = () => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    events.forEach(event => {
        window.addEventListener(event, resetActivityTimer);
    });

    return () => {
        events.forEach(event => {
            window.removeEventListener(event, resetActivityTimer);
        });
    };
}; 