import { Suspense } from 'react';
import CatalogueContent from '@/components/catalogue/CatalogueContent';
import { API_URL } from '@/lib/api';
import { Product } from '@/types/product';

function PacksFallback() {
  return (
    <div className="min-h-screen bg-white pt-6 pb-20">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-12 h-10 animate-pulse bg-neutral-100" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse bg-neutral-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PacksPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();
  
  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    }
  });

  params.set('is_pack', '1');
  const query = params.toString();
  
  const [productsRes, filtersRes] = await Promise.all([
    fetch(`${API_URL}/api/products?${query}`, { next: { revalidate: 3600 } }),
    fetch(`${API_URL}/api/products/filters?is_pack=1`, { next: { revalidate: 3600 } })
  ]);

  let initialProducts: Product[] = [];
  let initialFilters = { brands: [], sizes: [] };

  if (productsRes.ok) initialProducts = await productsRes.json();
  if (filtersRes.ok) {
    const data = await filtersRes.json();
    initialFilters = { brands: data.brands ?? [], sizes: data.sizes ?? [] };
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Premium Collection Header - Reduced height to keep packs above the fold */}
      <div style={{ 
        padding: '30px 24px 20px', 
        textAlign: 'center', 
        background: 'linear-gradient(to bottom, #F9F8F6 0%, #FFFFFF 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.03)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            color: '#CA8A04', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 8
          }}>
            L&apos;Art de la Découverte
          </span>
          <h1 style={{ 
            fontSize: '2rem', 
            fontFamily: 'var(--font-display)', 
            fontWeight: 700,
            color: '#111',
            marginBottom: 10
          }}>
            Packs Decante
          </h1>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#666', 
            lineHeight: 1.5,
            maxWidth: 600,
            margin: '0 auto'
          }}>
            Découvrez notre sélection de packs decante. Choisissez votre univers et composez votre coffret selon vos envies.
          </p>
        </div>
      </div>

      <Suspense fallback={<PacksFallback />}>
        <CatalogueContent 
          initialProducts={initialProducts} 
          initialFilters={initialFilters} 
          isPack={true}
        />
      </Suspense>
    </div>
  );
}
