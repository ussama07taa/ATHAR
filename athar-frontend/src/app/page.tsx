import StorefrontV2 from './StorefrontV2';

/* ── Types (exported for use in child components) ─────────── */
import { Product, ProductVariant } from '@/types/product';

/* ── Decorative perfume bottle SVG (kept for legacy) ─────── */
export const bottleColors: Record<string, string> = {
  'oud-sauvage': '#8B5E3C',
  'rose-dades': '#C47A7A',
  'musc-atlas': '#7A9C8B',
};

export function PerfumeBottle({ color }: { color: string }) {
  return (
    <svg width="54" height="90" viewBox="0 0 54 90" fill="none" aria-hidden="true">
      <rect x="18" y="0" width="18" height="10" rx="3" fill={color} opacity={0.7} />
      <rect x="22" y="10" width="10" height="8" fill={color} opacity={0.5} />
      <rect x="8" y="18" width="38" height="60" rx="10" fill={color} opacity={0.18} />
      <rect x="8" y="18" width="38" height="60" rx="10" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

/* ── JSON-LD Schema ───────────────────────────────────────── */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://athar.ma';

function buildProductSchema(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Parfums Athar — Collection Complète',
    url: BASE_URL,
    numberOfItems: products.length,
    itemListElement: products.map((p, idx) => ({
      '@type': 'Product',
      '@id': `${BASE_URL}/products/${p.slug}`,
      position: idx + 1,
      name: p.name,
      url: `${BASE_URL}/products/${p.slug}`,
      brand: { '@type': 'Brand', name: 'Athar' },
    })),
  };
}

/* ── Page (Server Component) ──────────────────────────────── */
export default async function Home() {
  let products: Product[] = [];
  let banners: any[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.atharfragrances.ma';
    const [resProducts, resBanners] = await Promise.all([
      fetch(`${apiUrl}/api/products`, { next: { revalidate: 60 } }),
      fetch(`${apiUrl}/api/banners`, { next: { revalidate: 60 } })
    ]);
    if (resProducts.ok) products = await resProducts.json();
    if (resBanners.ok) banners = await resBanners.json();
  } catch {
    /* server offline */
  }

  const schema = buildProductSchema(products);

  return (
    <main>
      {/* JSON-LD */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <StorefrontV2 products={products} banners={banners} />
    </main>
  );
}
