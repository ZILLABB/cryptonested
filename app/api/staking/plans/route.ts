import { NextRequest, NextResponse } from 'next/server';
import { getStakingPlans } from '../../../../lib/staking';

export async function GET(request: NextRequest) {
  try {
    const result = await getStakingPlans();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to fetch staking plans' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error('Error in staking plans API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
