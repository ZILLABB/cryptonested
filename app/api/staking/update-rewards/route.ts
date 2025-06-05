import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateAndAddRewards } from '../../../../lib/staking';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // This endpoint should be called by a cron job or background service
    // For security, you might want to add authentication here
    
    // Get all active staking positions
    const { data: positions, error } = await supabase
      .from('staking_positions')
      .select('id')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching staking positions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch staking positions' },
        { status: 500 }
      );
    }

    if (!positions || positions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active staking positions to update',
        updated: 0,
      });
    }

    // Update rewards for each position
    let updatedCount = 0;
    let errorCount = 0;

    for (const position of positions) {
      try {
        const result = await calculateAndAddRewards(position.id);
        if (result.success) {
          updatedCount++;
        } else {
          errorCount++;
          console.error(`Failed to update rewards for position ${position.id}:`, result.error);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error updating rewards for position ${position.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Rewards update completed`,
      total_positions: positions.length,
      updated: updatedCount,
      errors: errorCount,
    });
  } catch (error: any) {
    console.error('Error in rewards update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// This endpoint can also be called via GET for manual testing
export async function GET(request: NextRequest) {
  return POST(request);
}
