import { NextResponse } from 'next/server';
import { spaceService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const satTypes = searchParams.get('type') ? [searchParams.get('type')!] : undefined;

  const result = await spaceService.getSatellites({ search, satTypes });
  return NextResponse.json(result);
}
