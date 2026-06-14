import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.toString();
    const backendUrl = query
      ? `${API_URL}/api/products?${query}`
      : `${API_URL}/api/products`;

    const res = await fetch(backendUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch from backend');
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Backend server is offline' }, { status: 503 });
  }
}
