import { NextResponse } from 'next/server';
import { analyticsService } from '@/services';

export async function GET() {
  const result = await analyticsService.getOverview();
  return NextResponse.json(result);
}
