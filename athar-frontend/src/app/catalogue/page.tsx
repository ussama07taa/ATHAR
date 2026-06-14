import { Suspense } from 'react';
import CatalogueContent from '@/components/catalogue/CatalogueContent';

function CatalogueFallback() {
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

export default function CataloguePage() {
  return (
    <Suspense fallback={<CatalogueFallback />}>
      <CatalogueContent />
    </Suspense>
  );
}
