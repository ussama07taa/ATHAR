'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PriceRangeSlider from '@/components/catalogue/PriceRangeSlider';

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  activeCount?: number;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = false, activeCount = 0, children }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200/80 last:border-b-0 dark:border-white/10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-neutral-600 dark:hover:text-cream-dim"
      >
        <span className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-[0.18em] text-neutral-900 uppercase dark:text-cream">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-bold text-white dark:bg-gold dark:text-dark-900">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          size={15}
          strokeWidth={1.5}
          className={`text-neutral-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export interface CatalogueFiltersProps {
  brands: string[];
  sizes: string[];
  selectedBrand: string;
  selectedSize: string;
  priceMin: number;
  priceMax: number;
  priceRange: { min: number; max: number };
  onBrandChange: (brand: string) => void;
  onSizeChange: (size: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onClearAll?: () => void;
  showHeader?: boolean;
}

export function FilterPanel({
  brands,
  sizes,
  selectedBrand,
  selectedSize,
  priceMin,
  priceMax,
  priceRange,
  onBrandChange,
  onSizeChange,
  onPriceChange,
  onClearAll,
  showHeader = true,
}: CatalogueFiltersProps) {
  const hasActiveFilters =
    !!selectedBrand ||
    !!selectedSize ||
    priceMin > priceRange.min ||
    priceMax < priceRange.max;

  const filterPill = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-left text-[13px] transition-all duration-200 ${
      active
        ? 'border-neutral-900 bg-neutral-900 font-semibold text-white shadow-sm dark:border-gold dark:bg-gold dark:text-dark-900'
        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-dark-700 dark:text-cream-dim dark:hover:border-gold/30 dark:hover:text-cream'
    }`;

  const filterListBtn = (active: boolean) =>
    `block w-full rounded-md px-2 py-2.5 text-left text-[13px] transition-all duration-200 ${
      active
        ? 'bg-neutral-100 font-semibold text-neutral-900 dark:bg-dark-600 dark:text-cream'
        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 dark:text-cream-dim dark:hover:bg-dark-700 dark:hover:text-cream'
    }`;

  return (
    <>
      {showHeader && (
        <div className="mb-6 flex items-center justify-between border-b border-neutral-200/80 pb-4 dark:border-white/10">
          <p className="text-[11px] font-bold tracking-[0.18em] text-neutral-900 uppercase dark:text-cream">
            Filtrer
          </p>
          {hasActiveFilters && onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase transition-colors hover:text-neutral-900 dark:text-cream-dim dark:hover:text-gold"
            >
              Effacer
            </button>
          )}
        </div>
      )}

      <FilterSection title="Marques" activeCount={selectedBrand ? 1 : 0} defaultOpen>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onBrandChange('')} className={filterPill(!selectedBrand)}>
            Toutes
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => onBrandChange(brand)}
              className={filterPill(selectedBrand === brand)}
            >
              {brand}
            </button>
          ))}
        </div>
        {brands.length === 0 && (
          <p className="mt-2 text-sm text-neutral-400">Aucune marque disponible</p>
        )}
      </FilterSection>

      <FilterSection title="Contenance" activeCount={selectedSize ? 1 : 0}>
        {sizes.length === 0 ? (
          <p className="text-sm text-neutral-400">Aucune contenance disponible</p>
        ) : (
          <div className="space-y-0.5">
            <button type="button" onClick={() => onSizeChange('')} className={filterListBtn(!selectedSize)}>
              Toutes
            </button>
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeChange(size)}
                className={filterListBtn(selectedSize === size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </FilterSection>

      {priceRange.max > 0 && (
        <FilterSection
          title="Prix"
          defaultOpen
          activeCount={priceMin > priceRange.min || priceMax < priceRange.max ? 1 : 0}
        >
          <PriceRangeSlider
            min={priceRange.min}
            max={priceRange.max}
            valueMin={priceMin}
            valueMax={priceMax}
            onChange={onPriceChange}
          />
        </FilterSection>
      )}
    </>
  );
}

export default function CatalogueFilters(props: CatalogueFiltersProps) {
  return (
    <aside className="hidden w-[260px] shrink-0 lg:block">
      <div className="sticky top-36 rounded-xl border border-neutral-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-dark-800 dark:shadow-none">
        <FilterPanel {...props} />
      </div>
    </aside>
  );
}
