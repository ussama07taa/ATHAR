import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const res = await fetch(
      `${API_URL}/api/orders/track?${searchParams.toString()}`,
      { headers: { Accept: 'application/json' }, cache: 'no-store' },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Backend server is offline' }, { status: 503 });
  }
}
