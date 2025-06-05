/**
 * Portfolio History Service
 * Tracks and manages historical portfolio values for performance charts
 */

import { supabase } from '../../lib/supabase';

export interface PortfolioSnapshot {
  id: string;
  portfolio_id: string;
  total_value: number;
  total_cost: number;
  profit_loss: number;
  profit_percentage: number;
  snapshot_date: string;
  created_at: string;
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
  profit?: number;
  profitPercentage?: number;
}

export interface PortfolioPerformanceData {
  daily: PerformanceDataPoint[];
  weekly: PerformanceDataPoint[];
  monthly: PerformanceDataPoint[];
  yearly: PerformanceDataPoint[];
  allTime: PerformanceDataPoint[];
}

/**
 * Create a portfolio snapshot
 */
export async function createPortfolioSnapshot(
  portfolioId: string,
  totalValue: number,
  totalCost: number,
  profitLoss: number,
  profitPercentage: number
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('portfolio_snapshots')
      .insert({
        portfolio_id: portfolioId,
        total_value: totalValue,
        total_cost: totalCost,
        profit_loss: profitLoss,
        profit_percentage: profitPercentage,
        snapshot_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating portfolio snapshot:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating portfolio snapshot:', error);
    return { success: false, error };
  }
}

/**
 * Get portfolio snapshots for a date range
 */
export async function getPortfolioSnapshots(
  portfolioId: string,
  startDate: string,
  endDate: string
): Promise<{ success: boolean; data?: PortfolioSnapshot[]; error?: any }> {
  try {
    const { data, error } = await supabase
      .from('portfolio_snapshots')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .gte('snapshot_date', startDate)
      .lte('snapshot_date', endDate)
      .order('snapshot_date', { ascending: true });

    if (error) {
      console.error('Error fetching portfolio snapshots:', error);
      return { success: false, error };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching portfolio snapshots:', error);
    return { success: false, error };
  }
}

/**
 * Generate performance data for different time ranges
 */
export async function getPortfolioPerformanceData(
  portfolioId: string,
  currentValue: number,
  currentCost: number
): Promise<PortfolioPerformanceData> {
  const now = new Date();
  
  // Calculate date ranges
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const allTimeStart = new Date('2020-01-01'); // Arbitrary start date

  try {
    // Fetch snapshots for different time ranges
    const [dailyResult, weeklyResult, monthlyResult, yearlyResult, allTimeResult] = await Promise.all([
      getPortfolioSnapshots(portfolioId, oneDayAgo.toISOString(), now.toISOString()),
      getPortfolioSnapshots(portfolioId, oneWeekAgo.toISOString(), now.toISOString()),
      getPortfolioSnapshots(portfolioId, oneMonthAgo.toISOString(), now.toISOString()),
      getPortfolioSnapshots(portfolioId, oneYearAgo.toISOString(), now.toISOString()),
      getPortfolioSnapshots(portfolioId, allTimeStart.toISOString(), now.toISOString())
    ]);

    // Convert snapshots to performance data points
    const convertSnapshots = (snapshots: PortfolioSnapshot[]): PerformanceDataPoint[] => {
      return snapshots.map(snapshot => ({
        date: new Date(snapshot.snapshot_date).toLocaleDateString(),
        value: snapshot.total_value,
        profit: snapshot.profit_loss,
        profitPercentage: snapshot.profit_percentage
      }));
    };

    // Add current value as the latest data point
    const currentDataPoint: PerformanceDataPoint = {
      date: now.toLocaleDateString(),
      value: currentValue,
      profit: currentValue - currentCost,
      profitPercentage: currentCost > 0 ? ((currentValue - currentCost) / currentCost) * 100 : 0
    };

    const daily = dailyResult.success ? convertSnapshots(dailyResult.data || []) : [];
    const weekly = weeklyResult.success ? convertSnapshots(weeklyResult.data || []) : [];
    const monthly = monthlyResult.success ? convertSnapshots(monthlyResult.data || []) : [];
    const yearly = yearlyResult.success ? convertSnapshots(yearlyResult.data || []) : [];
    const allTime = allTimeResult.success ? convertSnapshots(allTimeResult.data || []) : [];

    // Add current data point to each array if not already present
    const addCurrentIfNeeded = (data: PerformanceDataPoint[]) => {
      if (data.length === 0 || data[data.length - 1].date !== currentDataPoint.date) {
        return [...data, currentDataPoint];
      }
      return data;
    };

    return {
      daily: addCurrentIfNeeded(daily),
      weekly: addCurrentIfNeeded(weekly),
      monthly: addCurrentIfNeeded(monthly),
      yearly: addCurrentIfNeeded(yearly),
      allTime: addCurrentIfNeeded(allTime)
    };
  } catch (error) {
    console.error('Error generating performance data:', error);
    
    // Return mock data if real data fails
    return generateMockPerformanceData(currentValue);
  }
}

/**
 * Generate mock performance data for fallback
 */
function generateMockPerformanceData(currentValue: number): PortfolioPerformanceData {
  const now = new Date();
  
  const generateDataPoints = (days: number, baseValue: number): PerformanceDataPoint[] => {
    const points: PerformanceDataPoint[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const value = baseValue * (1 + variation * (i / days));
      
      points.push({
        date: date.toLocaleDateString(),
        value: Math.max(value, baseValue * 0.5), // Minimum 50% of base value
        profit: value - baseValue * 0.85,
        profitPercentage: ((value - baseValue * 0.85) / (baseValue * 0.85)) * 100
      });
    }
    
    return points;
  };

  return {
    daily: generateDataPoints(1, currentValue),
    weekly: generateDataPoints(7, currentValue),
    monthly: generateDataPoints(30, currentValue),
    yearly: generateDataPoints(365, currentValue),
    allTime: generateDataPoints(730, currentValue) // 2 years
  };
}

/**
 * Schedule automatic portfolio snapshots
 * This should be called periodically (e.g., daily) to track portfolio history
 */
export async function schedulePortfolioSnapshot(
  portfolioId: string,
  totalValue: number,
  totalCost: number
): Promise<void> {
  const profitLoss = totalValue - totalCost;
  const profitPercentage = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

  // Check if we already have a snapshot for today
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const existingSnapshot = await getPortfolioSnapshots(
    portfolioId,
    todayStart.toISOString(),
    todayEnd.toISOString()
  );

  // Only create a new snapshot if we don't have one for today
  if (existingSnapshot.success && existingSnapshot.data && existingSnapshot.data.length === 0) {
    await createPortfolioSnapshot(portfolioId, totalValue, totalCost, profitLoss, profitPercentage);
  }
}

/**
 * Clean up old snapshots (keep only last 2 years)
 */
export async function cleanupOldSnapshots(portfolioId: string): Promise<void> {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  try {
    await supabase
      .from('portfolio_snapshots')
      .delete()
      .eq('portfolio_id', portfolioId)
      .lt('snapshot_date', twoYearsAgo.toISOString());
  } catch (error) {
    console.error('Error cleaning up old snapshots:', error);
  }
}

/**
 * Get portfolio performance metrics
 */
export async function getPortfolioMetrics(portfolioId: string): Promise<{
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}> {
  try {
    // Get all-time snapshots
    const allTimeResult = await getPortfolioSnapshots(
      portfolioId,
      new Date('2020-01-01').toISOString(),
      new Date().toISOString()
    );

    if (!allTimeResult.success || !allTimeResult.data || allTimeResult.data.length < 2) {
      return {
        totalReturn: 0,
        annualizedReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      };
    }

    const snapshots = allTimeResult.data;
    const values = snapshots.map(s => s.total_value);
    const returns = [];

    // Calculate daily returns
    for (let i = 1; i < values.length; i++) {
      const dailyReturn = (values[i] - values[i - 1]) / values[i - 1];
      returns.push(dailyReturn);
    }

    // Calculate metrics
    const totalReturn = (values[values.length - 1] - values[0]) / values[0];
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const annualizedReturn = Math.pow(1 + avgReturn, 365) - 1;
    
    // Calculate volatility (standard deviation of returns)
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * Math.sqrt(365); // Annualized

    // Calculate Sharpe ratio (assuming 2% risk-free rate)
    const riskFreeRate = 0.02;
    const sharpeRatio = volatility > 0 ? (annualizedReturn - riskFreeRate) / volatility : 0;

    // Calculate maximum drawdown
    let maxDrawdown = 0;
    let peak = values[0];
    
    for (const value of values) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return {
      totalReturn: totalReturn * 100,
      annualizedReturn: annualizedReturn * 100,
      volatility: volatility * 100,
      sharpeRatio,
      maxDrawdown: maxDrawdown * 100
    };
  } catch (error) {
    console.error('Error calculating portfolio metrics:', error);
    return {
      totalReturn: 0,
      annualizedReturn: 0,
      volatility: 0,
      sharpeRatio: 0,
      maxDrawdown: 0
    };
  }
}
