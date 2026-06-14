import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

const BACKEND = `${API_URL}/api/collections`;

export async function GET(request: NextRequest) {
  try {
    const isMenu = request.nextUrl.searchParams.get('menu') === 'true';
    const url = isMenu ? `${BACKEND}/menu` : BACKEND;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch from backend');
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Backend server is offline' }, { status: 503 });
  }
}
