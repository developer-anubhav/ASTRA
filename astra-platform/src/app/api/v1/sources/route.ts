import { NextResponse } from 'next/server';
import { sourcesService } from '@/services';

export async function GET() {
  const result = await sourcesService.getSources();
  return NextResponse.json(result);
}
