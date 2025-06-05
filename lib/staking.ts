import { supabase } from './supabase';

// Types for staking system
export interface StakingPlan {
  id: string;
  name: string;
  apy: number;
  lock_period_days: number;
  minimum_amount: number;
  maximum_amount?: number;
  supported_coins: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StakingPosition {
  id: string;
  user_id: string;
  staking_plan_id: string;
  coin_id: string;
  amount: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'withdrawn' | 'cancelled';
  total_rewards: number;
  last_reward_date?: string;
  created_at: string;
  updated_at: string;
  staking_plan?: StakingPlan;
}

export interface StakingReward {
  id: string;
  staking_position_id: string;
  amount: number;
  reward_date: string;
  apy_rate: number;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
}

/**
 * Get all available staking plans
 */
export async function getStakingPlans(): Promise<ApiResponse<StakingPlan[]>> {
  try {
    const { data, error } = await supabase
      .from('staking_plans')
      .select('*')
      .eq('is_active', true)
      .order('apy', { ascending: true });

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
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'Failed to fetch staking plans' },
      data: null,
    };
  }
}

/**
 * Get user's staking positions
 */
export async function getUserStakingPositions(userId: string): Promise<ApiResponse<StakingPosition[]>> {
  try {
    const { data, error } = await supabase
      .from('staking_positions')
      .select(`
        *,
        staking_plan:staking_plans(*)
      `)
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
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'Failed to fetch staking positions' },
      data: null,
    };
  }
}

/**
 * Create a new staking position
 */
export async function createStakingPosition(
  userId: string,
  stakingPlanId: string,
  coinId: string,
  amount: number
): Promise<ApiResponse<StakingPosition>> {
  try {
    // First, validate the staking plan
    const { data: plan, error: planError } = await supabase
      .from('staking_plans')
      .select('*')
      .eq('id', stakingPlanId)
      .eq('is_active', true)
      .single();

    if (planError || !plan) {
      return {
        success: false,
        error: { message: 'Invalid staking plan' },
        data: null,
      };
    }

    // Validate minimum amount
    if (amount < plan.minimum_amount) {
      return {
        success: false,
        error: { message: `Minimum staking amount is ${plan.minimum_amount}` },
        data: null,
      };
    }

    // Validate maximum amount if set
    if (plan.maximum_amount && amount > plan.maximum_amount) {
      return {
        success: false,
        error: { message: `Maximum staking amount is ${plan.maximum_amount}` },
        data: null,
      };
    }

    // Validate supported coin
    if (!plan.supported_coins.includes(coinId)) {
      return {
        success: false,
        error: { message: 'This cryptocurrency is not supported for this staking plan' },
        data: null,
      };
    }

    // Calculate end date if there's a lock period
    const startDate = new Date();
    const endDate = plan.lock_period_days > 0 
      ? new Date(startDate.getTime() + plan.lock_period_days * 24 * 60 * 60 * 1000)
      : null;

    // Create the staking position
    const { data, error } = await supabase
      .from('staking_positions')
      .insert({
        user_id: userId,
        staking_plan_id: stakingPlanId,
        coin_id: coinId,
        amount,
        start_date: startDate.toISOString(),
        end_date: endDate?.toISOString(),
        status: 'active',
        total_rewards: 0,
      })
      .select(`
        *,
        staking_plan:staking_plans(*)
      `)
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
      error: { message: error.message || 'Failed to create staking position' },
      data: null,
    };
  }
}

/**
 * Withdraw from a staking position
 */
export async function withdrawStakingPosition(
  userId: string,
  positionId: string,
  isEarlyWithdrawal: boolean = false
): Promise<ApiResponse<StakingPosition>> {
  try {
    // Get the staking position
    const { data: position, error: positionError } = await supabase
      .from('staking_positions')
      .select(`
        *,
        staking_plan:staking_plans(*)
      `)
      .eq('id', positionId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (positionError || !position) {
      return {
        success: false,
        error: { message: 'Staking position not found or already withdrawn' },
        data: null,
      };
    }

    // Check if early withdrawal is allowed
    if (position.end_date && new Date() < new Date(position.end_date) && !isEarlyWithdrawal) {
      return {
        success: false,
        error: { message: 'Cannot withdraw before lock period ends' },
        data: null,
      };
    }

    // Calculate final rewards before withdrawal
    await calculateAndAddRewards(positionId);

    // Update the position status
    const { data, error } = await supabase
      .from('staking_positions')
      .update({
        status: 'withdrawn',
        updated_at: new Date().toISOString(),
      })
      .eq('id', positionId)
      .eq('user_id', userId)
      .select(`
        *,
        staking_plan:staking_plans(*)
      `)
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
      error: { message: error.message || 'Failed to withdraw staking position' },
      data: null,
    };
  }
}

/**
 * Calculate and add rewards for a staking position
 */
export async function calculateAndAddRewards(positionId: string): Promise<ApiResponse<number>> {
  try {
    // Get the staking position with plan details
    const { data: position, error: positionError } = await supabase
      .from('staking_positions')
      .select(`
        *,
        staking_plan:staking_plans(*)
      `)
      .eq('id', positionId)
      .eq('status', 'active')
      .single();

    if (positionError || !position) {
      return {
        success: false,
        error: { message: 'Staking position not found' },
        data: null,
      };
    }

    const now = new Date();
    const lastRewardDate = position.last_reward_date 
      ? new Date(position.last_reward_date)
      : new Date(position.start_date);

    // Calculate days since last reward
    const daysSinceLastReward = Math.floor((now.getTime() - lastRewardDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastReward < 1) {
      // No rewards to calculate yet
      return {
        success: true,
        error: null,
        data: 0,
      };
    }

    // Calculate daily reward amount
    const annualReward = (position.amount * position.staking_plan.apy) / 100;
    const dailyReward = annualReward / 365;
    const totalReward = dailyReward * daysSinceLastReward;

    if (totalReward > 0) {
      // Add the reward record
      const { error: rewardError } = await supabase
        .from('staking_rewards')
        .insert({
          staking_position_id: positionId,
          amount: totalReward,
          reward_date: now.toISOString(),
          apy_rate: position.staking_plan.apy,
        });

      if (rewardError) {
        return {
          success: false,
          error: { message: rewardError.message },
          data: null,
        };
      }

      // Update the staking position
      const { error: updateError } = await supabase
        .from('staking_positions')
        .update({
          total_rewards: position.total_rewards + totalReward,
          last_reward_date: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('id', positionId);

      if (updateError) {
        return {
          success: false,
          error: { message: updateError.message },
          data: null,
        };
      }
    }

    return {
      success: true,
      error: null,
      data: totalReward,
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'Failed to calculate rewards' },
      data: null,
    };
  }
}
