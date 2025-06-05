import { supabase } from './supabase';
import { Database } from '../types/supabase';

export type Portfolio = Database['public']['Tables']['portfolios']['Row'];
export type Holding = Database['public']['Tables']['holdings']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];

export type ApiResponse<T> = {
  success: boolean;
  error: { message: string } | null;
  data: T | null;
};

/**
 * Get all portfolios for a user
 */
export async function getUserPortfolios(userId: string): Promise<ApiResponse<Portfolio[]>> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
 * Create a new portfolio
 */
export async function createPortfolio(
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<ApiResponse<Portfolio>> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: userId,
        name,
        description,
        is_public: isPublic,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
 * Get all holdings for a portfolio
 */
export async function getPortfolioHoldings(portfolioId: string): Promise<ApiResponse<Holding[]>> {
  try {
    const { data, error } = await supabase
      .from('holdings')
      .select('*')
      .eq('portfolio_id', portfolioId);

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
 * Add a holding to a portfolio
 */
export async function addHolding(
  portfolioId: string,
  coinId: string,
  quantity: number,
  purchasePrice?: number,
  purchaseDate?: string
): Promise<ApiResponse<Holding>> {
  try {
    const { data, error } = await supabase
      .from('holdings')
      .insert({
        portfolio_id: portfolioId,
        coin_id: coinId,
        quantity,
        purchase_price: purchasePrice,
        purchase_date: purchaseDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
 * Get all transactions for a user
 */
export async function getUserTransactions(userId: string): Promise<ApiResponse<Transaction[]>> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

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
 * Add a transaction
 */
export async function addTransaction(
  userId: string,
  type: 'buy' | 'sell' | 'transfer',
  coinId: string,
  quantity: number,
  price: number,
  fee?: number,
  notes?: string,
  transactionDate: string = new Date().toISOString()
): Promise<ApiResponse<Transaction>> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type,
        coin_id: coinId,
        quantity,
        price,
        fee,
        notes,
        transaction_date: transactionDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
 * Update a portfolio
 */
export async function updatePortfolio(
  portfolioId: string,
  name?: string,
  description?: string,
  isPublic?: boolean
): Promise<ApiResponse<Portfolio>> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.is_public = isPublic;

    const { data, error } = await supabase
      .from('portfolios')
      .update(updateData)
      .eq('id', portfolioId)
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
 * Delete a portfolio
 */
export async function deletePortfolio(portfolioId: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId);

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
 * Update a holding
 */
export async function updateHolding(
  holdingId: string,
  quantity?: number,
  purchasePrice?: number,
  purchaseDate?: string
): Promise<ApiResponse<Holding>> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (quantity !== undefined) updateData.quantity = quantity;
    if (purchasePrice !== undefined) updateData.purchase_price = purchasePrice;
    if (purchaseDate !== undefined) updateData.purchase_date = purchaseDate;

    const { data, error } = await supabase
      .from('holdings')
      .update(updateData)
      .eq('id', holdingId)
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
 * Delete a holding
 */
export async function deleteHolding(holdingId: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from('holdings')
      .delete()
      .eq('id', holdingId);

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
