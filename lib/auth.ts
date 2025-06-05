import { supabase } from './supabase';

export type AuthError = {
  message: string;
};

export type AuthResponse = {
  success: boolean;
  error: AuthError | null;
  data: any | null;
};

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      console.error('Sign up error:', authError);
      return {
        success: false,
        error: { message: authError.message },
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: authData,
    };
  } catch (error: any) {
    console.error('Sign up exception:', error);
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}

/**
 * Sign in a user with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: { message: error.message },
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data,
    };
  } catch (error: any) {
    console.error('Sign in exception:', error);
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: { message: error.message },
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: null,
    };
  } catch (error: any) {
    console.error('Sign out exception:', error);
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        error: { message: error.message },
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: data.user,
    };
  } catch (error: any) {
    console.error('Get user exception:', error);
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}

/**
 * Reset password for a user
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: { message: error.message },
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: null,
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}
