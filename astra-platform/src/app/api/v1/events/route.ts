import { NextResponse } from 'next/server';
import { eventsService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const categories = searchParams.get('category') ? [searchParams.get('category')!] : undefined;
  const severities = searchParams.get('severity') ? [searchParams.get('severity')!] : undefined;

  const result = await eventsService.getEvents({ search, categories, severities });
  return NextResponse.json(result);
}
