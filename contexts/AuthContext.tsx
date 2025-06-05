import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { signIn, signOut, signUp } from '../lib/auth';
import { LoadingScreen } from '../app/components/ui/LoadingScreen';
import { sessionManager, setupActivityTracking } from '../lib/session';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          // Start session management
          sessionManager.startSessionTimer();
          // Setup activity tracking
          const cleanup = setupActivityTracking();
          return cleanup;
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const cleanup = checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);

        if (session?.user) {
          sessionManager.startSessionTimer();
          setupActivityTracking();
        } else {
          sessionManager.clearSessionTimers();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
      sessionManager.clearSessionTimers();
      if (cleanup) cleanup();
    };
  }, []);

  const handleSignIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const result = await signIn(email, password);
      if (!result.success) {
        return { success: false, error: result.error?.message || 'Sign in failed' };
      }

      // Set session persistence based on remember me
      await supabase.auth.setSession({
        access_token: result.data.session?.access_token || '',
        refresh_token: result.data.session?.refresh_token || '',
      });

      if (rememberMe) {
        // Store the remember me preference
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign in failed' };
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      const result = await signUp(email, password, name);
      if (!result.success) {
        return { success: false, error: result.error?.message || 'Sign up failed' };
      }
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign up failed' };
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      sessionManager.clearSessionTimers();
      localStorage.removeItem('rememberMe');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
