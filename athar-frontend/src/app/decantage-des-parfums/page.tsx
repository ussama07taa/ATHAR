import { Suspense } from 'react';
import CatalogueContent from '@/components/catalogue/CatalogueContent';
import { API_URL } from '@/lib/api';
import { Product } from '@/types/product';

function DecantageFallback() {
  return (
    <div className="min-h-screen bg-[#FCFBFA] pt-6 pb-20">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-12 h-10 animate-pulse bg-neutral-200" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[3/4] animate-pulse bg-neutral-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DecantagePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();

  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (key === 'gender') return;
    if (typeof value === 'string') {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    }
  });

  // Force the decant filter — only fetch decant products
  params.set('is_decant', '1');

  const query = params.toString();

  const [productsRes, filtersRes] = await Promise.all([
    fetch(`${API_URL}/api/products?${query}`, { next: { revalidate: 60 } }),
    fetch(`${API_URL}/api/products/filters?is_decant=1`, { next: { revalidate: 3600 } }),
  ]);

  let initialProducts: Product[] = [];
  let initialFilters: { brands: string[]; sizes: string[] } = { brands: [], sizes: [] };

  if (productsRes.ok) initialProducts = await productsRes.json();
  if (filtersRes.ok) {
    const data = await filtersRes.json();
    initialFilters = { brands: data.brands ?? [], sizes: data.sizes ?? [] };
  }

  return (
    <Suspense fallback={<DecantageFallback />}>
      <CatalogueContent
        initialProducts={initialProducts}
        initialFilters={initialFilters}
        isNiche={false}
        isPack={false}
        isArabic={false}
        isDecant={true}
      />
    </Suspense>
  );
}
