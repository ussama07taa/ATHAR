'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { FilterPanel, CatalogueFiltersProps } from '@/components/catalogue/CatalogueFilters';

interface MobileFilterDrawerProps extends CatalogueFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  onOpen,
  ...filterProps
}: MobileFilterDrawerProps) {
  const activeCount =
    (filterProps.selectedBrand ? 1 : 0) +
    (filterProps.selectedSize ? 1 : 0) +
    (filterProps.priceMin > filterProps.priceRange.min ||
    filterProps.priceMax < filterProps.priceRange.max
      ? 1
      : 0);

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-[11px] font-bold tracking-[0.16em] text-neutral-900 uppercase transition-all hover:border-neutral-900 dark:border-white/15 dark:bg-dark-800 dark:text-cream dark:hover:border-gold/40 lg:hidden"
      >
        <SlidersHorizontal size={15} strokeWidth={1.5} />
        Filtres
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-[10px] text-white">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <button
            type="button"
            aria-label="Fermer les filtres"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <div className="absolute right-0 bottom-0 left-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white px-6 pt-4 pb-8 shadow-2xl dark:bg-dark-800">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase dark:text-cream">Filtres</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-cream-dim dark:hover:bg-dark-700 dark:hover:text-cream"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
            <FilterPanel {...filterProps} />
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full bg-neutral-900 py-4 text-[11px] font-bold tracking-[0.16em] text-white uppercase dark:bg-gold dark:text-dark-900"
            >
              Voir les résultats
            </button>
          </div>
        </div>
      )}
    </>
  );
}
