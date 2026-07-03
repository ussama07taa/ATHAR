import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://athar.ma';
const API_URL  = process.env.NEXT_PUBLIC_API_URL  ?? 'https://api.atharfragrances.ma';

interface Product {
  slug: string;
  updated_at: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Product[] = [];

  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
    if (res.ok) products = await res.json();
  } catch {
    // API offline — return static sitemap only
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
