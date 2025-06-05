import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

// Default timeout in milliseconds (15 minutes)
const DEFAULT_TIMEOUT = 15 * 60 * 1000;

/**
 * Hook to handle user inactivity timeout and automatic logout
 * @param isAuthenticated - Boolean indicating if user is authenticated
 * @param timeout - Timeout in milliseconds before logging out (default: 15 minutes)
 * @param warningTime - Time in milliseconds before timeout to show warning (default: 1 minute)
 */
export function useInactivityTimeout(
  isAuthenticated: boolean,
  timeout: number = DEFAULT_TIMEOUT,
  warningTime: number = 60 * 1000
) {
  const router = useRouter();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningToastRef = useRef<string | null>(null);

  const resetTimeout = () => {
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
    if (isAuthenticated) {
      // Set warning timeout
      warningTimeoutRef.current = setTimeout(() => {
        const toastId = toast({
          title: "Session Expiring Soon",
          description: "You'll be logged out due to inactivity in 1 minute. Click anywhere to stay logged in.",
          variant: "destructive",
          duration: warningTime,
        });
        warningToastRef.current = toastId;
      }, timeout - warningTime);

      // Set logout timeout
      timeoutRef.current = setTimeout(() => {
        // Perform logout
        localStorage.removeItem('session');
        sessionStorage.clear();
        
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
      if (warningToastRef.current) {
        // Logic to dismiss toast would go here
        warningToastRef.current = null;
      }
      
      resetTimeout();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Initial setup
    resetTimeout();
    
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
  }, [isAuthenticated, timeout, warningTime]);

  return { resetTimeout };
}
