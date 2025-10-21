import { NextResponse } from 'next/server';
import { mockChartData } from '@/app/store/mock-data';

export async function GET() {
  try {
    return NextResponse.json(mockChartData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch charts' },
      { status: 500 }
    );
  }
}
