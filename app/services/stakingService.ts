import { 
  getStakingPlans, 
  getUserStakingPositions, 
  createStakingPosition, 
  withdrawStakingPosition,
  calculateAndAddRewards,
  StakingPlan, 
  StakingPosition, 
  StakingReward 
} from '../../lib/staking';
import { getCryptoById } from './cryptoService';

// Extended types for frontend use
export interface StakingPlanWithDetails extends StakingPlan {
  title: string;
  description: string;
  benefits: string[];
  icon: string;
}

export interface StakingPositionWithDetails extends StakingPosition {
  coin_name?: string;
  coin_symbol?: string;
  current_value?: number;
  projected_annual_reward?: number;
  days_remaining?: number;
  can_withdraw?: boolean;
  early_withdrawal_penalty?: number;
}

export interface StakingSummary {
  total_staked: number;
  total_rewards: number;
  active_positions: number;
  projected_annual_income: number;
  average_apy: number;
}

/**
 * Get all available staking plans with enhanced details
 */
export async function getStakingPlansWithDetails(): Promise<StakingPlanWithDetails[]> {
  try {
    const result = await getStakingPlans();
    
    if (!result.success || !result.data) {
      console.error('Failed to fetch staking plans:', result.error);
      return [];
    }

    // Enhance plans with UI details
    return result.data.map(plan => ({
      ...plan,
      title: plan.name,
      description: getStakingPlanDescription(plan),
      benefits: getStakingPlanBenefits(plan),
      icon: getStakingPlanIcon(plan.name),
    }));
  } catch (error) {
    console.error('Error fetching staking plans:', error);
    return [];
  }
}

/**
 * Get user's staking positions with enhanced details
 */
export async function getUserStakingPositionsWithDetails(userId: string): Promise<StakingPositionWithDetails[]> {
  try {
    const result = await getUserStakingPositions(userId);
    
    if (!result.success || !result.data) {
      console.error('Failed to fetch staking positions:', result.error);
      return [];
    }

    // Enhance positions with additional details
    const enhancedPositions = await Promise.all(
      result.data.map(async (position) => {
        try {
          // Get coin details
          const coinData = await getCryptoById(position.coin_id);
          
          // Calculate additional metrics
          const now = new Date();
          const startDate = new Date(position.start_date);
          const endDate = position.end_date ? new Date(position.end_date) : null;
          
          const daysStaked = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const daysRemaining = endDate ? Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
          
          const currentValue = coinData ? position.amount * coinData.current_price : position.amount;
          const projectedAnnualReward = (position.amount * (position.staking_plan?.apy || 0)) / 100;
          
          const canWithdraw = !endDate || now >= endDate || position.staking_plan?.lock_period_days === 0;
          const earlyWithdrawalPenalty = !canWithdraw ? 0.1 : 0; // 10% penalty for early withdrawal

          return {
            ...position,
            coin_name: coinData?.name || position.coin_id,
            coin_symbol: coinData?.symbol?.toUpperCase() || position.coin_id.toUpperCase(),
            current_value: currentValue,
            projected_annual_reward: projectedAnnualReward,
            days_remaining: daysRemaining,
            can_withdraw: canWithdraw,
            early_withdrawal_penalty: earlyWithdrawalPenalty,
          };
        } catch (error) {
          console.error(`Error enhancing position ${position.id}:`, error);
          return {
            ...position,
            coin_name: position.coin_id,
            coin_symbol: position.coin_id.toUpperCase(),
            current_value: position.amount,
            projected_annual_reward: 0,
            days_remaining: 0,
            can_withdraw: true,
            early_withdrawal_penalty: 0,
          };
        }
      })
    );

    return enhancedPositions;
  } catch (error) {
    console.error('Error fetching staking positions:', error);
    return [];
  }
}

/**
 * Get staking summary for a user
 */
export async function getStakingSummary(userId: string): Promise<StakingSummary> {
  try {
    const positions = await getUserStakingPositionsWithDetails(userId);
    const activePositions = positions.filter(p => p.status === 'active');

    const totalStaked = activePositions.reduce((sum, p) => sum + p.amount, 0);
    const totalRewards = activePositions.reduce((sum, p) => sum + p.total_rewards, 0);
    const projectedAnnualIncome = activePositions.reduce((sum, p) => sum + (p.projected_annual_reward || 0), 0);
    
    const averageApy = activePositions.length > 0 
      ? activePositions.reduce((sum, p) => sum + (p.staking_plan?.apy || 0), 0) / activePositions.length
      : 0;

    return {
      total_staked: totalStaked,
      total_rewards: totalRewards,
      active_positions: activePositions.length,
      projected_annual_income: projectedAnnualIncome,
      average_apy: averageApy,
    };
  } catch (error) {
    console.error('Error calculating staking summary:', error);
    return {
      total_staked: 0,
      total_rewards: 0,
      active_positions: 0,
      projected_annual_income: 0,
      average_apy: 0,
    };
  }
}

/**
 * Start a new staking position
 */
export async function startStaking(
  userId: string,
  planId: string,
  coinId: string,
  amount: number
): Promise<{ success: boolean; error?: string; data?: StakingPosition }> {
  try {
    const result = await createStakingPosition(userId, planId, coinId, amount);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error?.message || 'Failed to create staking position',
      };
    }

    return {
      success: true,
      data: result.data || undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to start staking',
    };
  }
}

/**
 * Withdraw from a staking position
 */
export async function withdrawStaking(
  userId: string,
  positionId: string,
  isEarlyWithdrawal: boolean = false
): Promise<{ success: boolean; error?: string; data?: StakingPosition }> {
  try {
    const result = await withdrawStakingPosition(userId, positionId, isEarlyWithdrawal);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error?.message || 'Failed to withdraw staking position',
      };
    }

    return {
      success: true,
      data: result.data || undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to withdraw staking',
    };
  }
}

/**
 * Update rewards for all active positions (background task)
 */
export async function updateAllRewards(userId: string): Promise<void> {
  try {
    const positions = await getUserStakingPositions(userId);
    
    if (positions.success && positions.data) {
      const activePositions = positions.data.filter(p => p.status === 'active');
      
      // Update rewards for each active position
      await Promise.all(
        activePositions.map(position => calculateAndAddRewards(position.id))
      );
    }
  } catch (error) {
    console.error('Error updating rewards:', error);
  }
}

// Helper functions for UI enhancement
function getStakingPlanDescription(plan: StakingPlan): string {
  switch (plan.name) {
    case 'Flexible Staking':
      return 'Stake your crypto with no lock-up period and withdraw anytime.';
    case 'Standard Staking':
      return 'Lock your assets for 3 months and earn higher returns.';
    case 'Premium Staking':
      return 'Maximum returns when you lock your assets for 12 months.';
    default:
      return `Earn ${plan.apy}% APY on your cryptocurrency holdings.`;
  }
}

function getStakingPlanBenefits(plan: StakingPlan): string[] {
  const baseBenefits = [
    `${plan.apy}% Annual Percentage Yield`,
    `Minimum stake: $${plan.minimum_amount}`,
    `${plan.supported_coins.length}+ supported cryptocurrencies`,
  ];

  switch (plan.name) {
    case 'Flexible Staking':
      return [
        ...baseBenefits,
        'No minimum staking period',
        'Withdraw anytime',
        'Weekly rewards distribution',
      ];
    case 'Standard Staking':
      return [
        ...baseBenefits,
        '3-month lock-up period',
        'Higher APY than flexible staking',
        'Daily rewards distribution',
      ];
    case 'Premium Staking':
      return [
        ...baseBenefits,
        '12-month lock-up period',
        'Highest possible APY',
        'Daily rewards distribution',
        'Priority customer support',
      ];
    default:
      return baseBenefits;
  }
}

function getStakingPlanIcon(planName: string): string {
  switch (planName) {
    case 'Flexible Staking':
      return 'CreditCard';
    case 'Standard Staking':
      return 'Percent';
    case 'Premium Staking':
      return 'Lock';
    default:
      return 'DollarSign';
  }
}

// Export types for use in components
export type { StakingPlan, StakingPosition, StakingReward, StakingPlanWithDetails, StakingPositionWithDetails, StakingSummary };
