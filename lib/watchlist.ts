import { supabase } from './supabase';
import { Database } from '../types/supabase';

export type WatchlistItem = Database['public']['Tables']['watchlist']['Row'];

export type ApiResponse<T> = {
  success: boolean;
  error: { message: string } | null;
  data: T | null;
};

/**
 * Get user's watchlist
 */
export async function getUserWatchlist(userId: string): Promise<ApiResponse<WatchlistItem[]>> {
  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId);

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
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}

/**
 * Add a coin to watchlist
 */
export async function addToWatchlist(
  userId: string,
  coinId: string
): Promise<ApiResponse<WatchlistItem>> {
  try {
    // Check if the coin is already in the watchlist
    const { data: existingItems } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .eq('coin_id', coinId);

    if (existingItems && existingItems.length > 0) {
      return {
        success: false,
        error: { message: 'This coin is already in your watchlist' },
        data: null,
      };
    }

    // Add the coin to the watchlist
    const { data, error } = await supabase
      .from('watchlist')
      .insert({
        user_id: userId,
        coin_id: coinId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

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
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}

/**
 * Remove a coin from watchlist
 */
export async function removeFromWatchlist(
  userId: string,
  coinId: string
): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('coin_id', coinId);

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

/**
 * Check if a coin is in the user's watchlist
 */
export async function isInWatchlist(
  userId: string,
  coinId: string
): Promise<ApiResponse<boolean>> {
  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .eq('coin_id', coinId);

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
      data: data && data.length > 0,
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}
