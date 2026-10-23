import { NextResponse } from 'next/server';
import { aviationService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const categories = searchParams.get('category') ? [searchParams.get('category')!] : undefined;

  const result = await aviationService.getAircraft({ search, categories });
  return NextResponse.json(result);
}
