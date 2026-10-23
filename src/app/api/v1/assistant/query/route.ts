import { NextResponse } from 'next/server';
import { assistantService } from '@/services';
import type { CortexQueryRequest } from '@/types';

export async function POST(request: Request) {
  try {
    const body: CortexQueryRequest = await request.json();
    if (!body || !body.query) {
      return NextResponse.json(
        { error: 'Field "query" is required', isDemo: true },
        { status: 400 }
      );
    }
    const result = await assistantService.query(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON request body';
    return NextResponse.json(
      { error: message, isDemo: true },
      { status: 400 }
    );
  }
}
