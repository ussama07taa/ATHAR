import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetail from '@/components/product/ProductDetail';
import RelatedProducts from '@/components/product/RelatedProducts';
import { Product } from '@/app/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://athar.ma';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
    if (!res.ok) return null;
    const all: Product[] = await res.json();
    return all.find((p) => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produit introuvable' };

  const title = product.meta_title?.trim() || `${product.name} — Parfum Marocain`;
  const description = product.meta_description?.trim() || product.description;

  return {
    title,
    description,
    openGraph: {
      title: product.meta_title?.trim() || `${product.name} | Athar`,
      description,
      url: `${BASE_URL}/products/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  // Per-product JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: `${BASE_URL}/products/${slug}`,
    brand: { '@type': 'Brand', name: 'Athar' },
    offers: product.variants.map((v) => ({
      '@type': 'Offer',
      sku: v.sku,
      name: `${product.name} ${v.size}`,
      price: v.price,
      priceCurrency: 'MAD',
      availability:
        v.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    })),
  };

  return (
    <main
      style={{
        minHeight: '100dvh',
        transition: 'background-color 300ms ease',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse 50% 60% at 30% 40%, rgba(200,162,92,0.07) 0%, transparent 70%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <ProductDetail product={product} />
        <RelatedProducts products={product.related_products || []} />
      </div>
    </main>
  );
}
