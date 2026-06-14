import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.toString();
    const url = query
      ? `${API_URL}/api/products/filters?${query}`
      : `${API_URL}/api/products/filters`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch from backend');
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: 'Backend server is offline' }, { status: 503 });
  }
}
