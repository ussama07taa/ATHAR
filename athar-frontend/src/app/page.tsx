import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';
import CollectionSection from '@/components/ui/CollectionSection';
import CustomerReviews from '@/components/ui/CustomerReviews';
import NewsletterForm from '@/components/ui/NewsletterForm';

/* ── Types (exported for use in child components) ─────────── */
export interface ProductVariant {
  id: number;
  size: string;
  price: string;
  compare_at_price?: string | null;
  sku: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  brand?: string;
  slug: string;
  description: string;
  image_url?: string;
  gallery_urls?: string[];
  related_products?: Product[];
  variants: ProductVariant[];
  category?: {
    name: string;
    slug: string;
  };
  is_pack?: boolean;
  badge_label?: string | null;
  badge_color?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

/* ── Decorative perfume bottle SVG ────────────────────────── */
export const bottleColors: Record<string, string> = {
  'oud-sauvage': '#8B5E3C',
  'rose-dades': '#C47A7A',
  'musc-atlas': '#7A9C8B',
  'rose-dades-edp': '#C47A7A',
  'musc-atlas-parfum': '#7A9C8B',
  'pack-oud-decouverte': '#8B5E3C',
  'pack-floral-decouverte': '#C47A7A',
};

export function PerfumeBottle({ color }: { color: string }) {
  return (
    <svg width="54" height="90" viewBox="0 0 54 90" fill="none" aria-hidden="true">
      <rect x="18" y="0" width="18" height="10" rx="3" fill={color} opacity={0.7} />
      <rect x="22" y="10" width="10" height="8" fill={color} opacity={0.5} />
      <rect x="8" y="18" width="38" height="60" rx="10" fill={color} opacity={0.18} />
      <rect x="8" y="18" width="38" height="60" rx="10" stroke={color} strokeWidth="1.5" />
      <rect x="14" y="24" width="6" height="28" rx="3" fill="white" opacity={0.12} />
      <rect x="8" y="48" width="38" height="18" rx="0" fill={color} opacity={0.12} />
    </svg>
  );
}

/* ── JSON-LD Schema ───────────────────────────────────────── */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://athar.ma';

function buildProductSchema(products: Product[]) {
  const itemListElements = products.map((p, idx) => ({
    '@type': 'Product',
    '@id': `${BASE_URL}/products/${p.slug}`,
    position: idx + 1,
    name: p.name,
    description: p.description,
    url: `${BASE_URL}/products/${p.slug}`,
    brand: { '@type': 'Brand', name: 'Athar' },
    category: p.category?.name ?? 'Parfums',
    offers: p.variants.map((v) => ({
      '@type': 'Offer',
      sku: v.sku,
      name: `${p.name} ${v.size}`,
      price: v.price,
      priceCurrency: 'MAD',
      availability:
        v.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Athar' },
    })),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Parfums Athar — Collection Complète',
    url: BASE_URL,
    numberOfItems: products.length,
    itemListElement: itemListElements,
  };
}

/* ── Page (Server Component) ──────────────────────────────── */
export default async function Home() {
  let products: Product[] = [];
  try {
    const res = await fetch('http://127.0.0.1:8000/api/products', { cache: 'no-store' });
    if (res.ok) products = await res.json();
  } catch {
    /* server offline */
  }

  const schema = buildProductSchema(products);

  return (
    <main
      style={{
        minHeight: '100dvh',
        transition: 'background-color 300ms ease',
      }}
    >
      {/* JSON-LD */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse 60% 40% at 20% 40%, rgba(200,162,92,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 70%, rgba(200,162,92,0.04) 0%, transparent 70%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── HERO SECTION ──────────────────────────────────────── */}
        <section
          id="hero"
          className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-500"
        >
          {/* Background glow effects */}
          <div
            className="absolute top-0 right-0 w-[50%] h-[80%] rounded-full opacity-[0.25] dark:opacity-[0.15] blur-[140px] pointer-events-none transition-opacity duration-500"
            style={{ background: 'radial-gradient(circle, #C8A25C, transparent)' }}
          />
          <div
            className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full opacity-[0.20] dark:opacity-[0.12] blur-[120px] pointer-events-none transition-opacity duration-500"
            style={{ background: 'radial-gradient(circle, #C8A25C, transparent)' }}
          />
          
          <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-32 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* Left Column: Hero Typography & CTA */}
            <div className="flex-1 w-full max-w-2xl text-center lg:text-left pt-12 lg:pt-0 fade-up" style={{ animationDelay: '0.1s' }}>
              
              {/* Eyebrow */}
              <span className="block text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[#9B7A3D] mb-4">
                Maison de Parfums Marocains
              </span>

              {/* Main heading */}
              <h1 className="font-display font-bold text-[#111111] dark:text-[#F2EDE2] mb-6 tracking-tight uppercase transition-colors duration-500" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.05 }}>
                <span className="text-[#C8A25C] block">Athar</span>
              </h1>

              {/* Subheadline */}
              <h2 className="text-[#6B6654] dark:text-[#A39981] font-light max-w-xl mx-auto lg:mx-0 mb-8 transition-colors duration-500" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: 1.6 }}>
                Essences rares d&apos;Orient, distillées par la tradition marocaine. Chaque parfum est sublimé par notre <strong className="text-[#C8A25C] font-normal">Premium Packaging</strong>.
              </h2>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
                <a
                  href="#collections"
                  className="inline-flex items-center justify-center gap-2 bg-[#C8A25C] text-[#111111] px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:bg-[#D4B373] hover:shadow-[0_0_20px_rgba(200,162,92,0.4)] hover:-translate-y-1 cursor-pointer"
                >
                  Découvrir la Collection
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                {[
                  { label: '100% Authentique' },
                  { label: 'COD — Aucune carte' },
                  { label: 'Livraison au Maroc' },
                ].map(({ label }) => (
                  <span
                    key={label}
                    className="text-[0.65rem] md:text-xs font-semibold text-[#6B6654] tracking-widest uppercase flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8A25C]/50 block" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Premium Packaging Visual Mockup */}
            <div className="hidden lg:flex flex-1 w-full justify-center lg:justify-end fade-up" style={{ animationDelay: '0.3s' }}>
              
              <div className="relative w-full max-w-[480px] aspect-square rounded-[2rem] border border-[#C8A25C]/10 dark:border-[#C8A25C]/20 bg-gradient-to-br from-[#FFFFFF] to-[#F1F1F1] dark:from-[#1C1C1C] dark:to-[#0A0A0A] shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden group flex items-center justify-center isolate transition-colors duration-500">
                
                {/* Elegant inner glow */}
                <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-[#C8A25C]/15 to-transparent opacity-60" />
                
                {/* Visual Image representing the Perfume Splash */}
                <div className="absolute inset-0 z-10 overflow-hidden rounded-[2rem]">
                  <Image 
                    src="/hero-perfume.jpg" 
                    alt="Athar Premium Fragrance" 
                    fill 
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                    priority 
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                  {/* Subtle blend overlay for dramatic light/dark effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
                
              </div>
            </div>

          </div>
        </section>

        {/* ── COLLECTIONS ──────────────────────────────────────── */}
        <CollectionSection />

        {/* ── FEATURED COLLECTION ───────────────────────────────── */}
        <section id="collection" className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="block text-xs font-semibold tracking-widest uppercase text-[#9B7A3D] mb-4 fade-up">Notre Collection</span>
            <h2 className="font-display font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-tight tracking-tight text-[#F2EDE2] mb-6 fade-up">Fragrances d&apos;Exception</h2>
            <div className="w-12 h-0.5 mx-auto fade-up" style={{ background: 'linear-gradient(90deg, transparent, #C8A25C, transparent)' }} />
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'rgba(200,162,92,0.04)',
                borderRadius: 20,
                border: '1px solid rgba(200,162,92,0.1)',
              }}
            >
              <p style={{ color: '#6B6654', fontSize: '0.875rem', margin: 0 }}>
                Produits indisponibles — veuillez relancer le serveur Laravel.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                gap: 24,
              }}
            >
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>


        {/* ── Customer Reviews ─── */}
        <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <CustomerReviews />
        </section>

        {/* ── Newsletter CTA ─── */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(200,162,92,0.08), rgba(155,122,61,0.12))',
          borderTop: '1px solid rgba(200,162,92,0.15)',
          borderBottom: '1px solid rgba(200,162,92,0.15)',
          padding: '64px 24px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8A25C', marginBottom: 12 }}>Restez informé</p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, margin: '0 0 12px' }}>Nouveautés &amp; offres exclusives</h2>
            <p style={{ maxWidth: 500, margin: '0 auto', fontSize: '0.9rem', color: '#9B7A3D', marginBottom: 32, lineHeight: 1.7 }}>Rejoignez notre cercle privé et soyez les premiers à découvrir nos nouvelles créations olfactives.</p>
            <NewsletterForm />
          </div>
        </section>
      </div>
    </main>
  );
}
