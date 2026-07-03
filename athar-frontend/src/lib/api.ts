export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.atharfragrances.ma';

export function parseApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') return fallback;
  const payload = data as { message?: string; errors?: Record<string, string[]> };
  if (payload.errors) {
    const first = Object.values(payload.errors).flat()[0];
    if (first) return first;
  }
  return payload.message ?? fallback;
}
