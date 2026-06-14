import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/reviews/featured`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ reviews: [], stats: { count: 0, average: 0 } }, { status: 503 });
  }
}
