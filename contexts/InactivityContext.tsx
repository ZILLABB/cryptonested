"use client";

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../app/components/ui/use-toast';
import { useAuth } from './AuthContext';

// Default timeout in milliseconds (15 minutes)
const DEFAULT_TIMEOUT = 15 * 60 * 1000;
// Warning time before logout (1 minute)
const DEFAULT_WARNING_TIME = 60 * 1000;

type InactivityContextType = {
  resetInactivityTimer: () => void;
};

const InactivityContext = createContext<InactivityContextType | undefined>(undefined);

export function InactivityProvider({
  children,
  timeout = DEFAULT_TIMEOUT,
  warningTime = DEFAULT_WARNING_TIME
}: {
  children: React.ReactNode;
  timeout?: number;
  warningTime?: number;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningToastIdRef = useRef<string | null>(null);

  const resetInactivityTimer = () => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }

    // Only set new timeouts if user is authenticated
    if (user) {
      // Set warning timeout
      warningTimeoutRef.current = setTimeout(() => {
        const toastId = toast({
          title: "Session Expiring Soon",
          description: "You'll be logged out due to inactivity in 1 minute. Move your mouse or press any key to stay logged in.",
          variant: "destructive",
          duration: warningTime,
        }) as unknown as string;
        warningToastIdRef.current = toastId;
      }, timeout - warningTime);

      // Set logout timeout
      timeoutRef.current = setTimeout(async () => {
        // Perform logout
        await signOut();

        // Redirect to login page
        router.push('/auth/signin?reason=inactivity');

        // Show logout notification
        toast({
          title: "Logged Out",
          description: "You've been logged out due to inactivity",
          duration: 5000,
        });
      }, timeout);
    }
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress',
      'scroll', 'touchstart', 'click', 'keydown'
    ];

    const handleUserActivity = () => {
      // If there's a warning toast showing, dismiss it
      if (warningToastIdRef.current) {
        // Logic to dismiss toast would go here if needed
        warningToastIdRef.current = null;
      }

      resetInactivityTimer();
    };

    // Only add listeners if user is authenticated
    if (user) {
      // Add event listeners
      activityEvents.forEach(event => {
        window.addEventListener(event, handleUserActivity);
      });

      // Initial setup
      resetInactivityTimer();
    }

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [user, timeout, warningTime]);

  const value = {
    resetInactivityTimer,
  };

  return (
    <InactivityContext.Provider value={value}>
      {children}
    </InactivityContext.Provider>
  );
}

export function useInactivity() {
  const context = useContext(InactivityContext);
  if (context === undefined) {
    throw new Error('useInactivity must be used within an InactivityProvider');
  }
  return context;
}
