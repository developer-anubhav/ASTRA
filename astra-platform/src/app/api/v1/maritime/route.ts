import { NextResponse } from 'next/server';
import { maritimeService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const types = searchParams.get('type') ? [searchParams.get('type')!] : undefined;

  const result = await maritimeService.getVessels({ search, vesselTypes: types });
  return NextResponse.json(result);
}
