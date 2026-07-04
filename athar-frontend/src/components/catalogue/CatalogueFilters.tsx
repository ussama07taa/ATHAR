'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PriceRangeSlider from '@/components/catalogue/PriceRangeSlider';
import { useTheme } from 'next-themes';

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  activeCount?: number;
  isNiche?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = false, activeCount = 0, isNiche = false, children }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== 'dark';

  return (
    <div style={{ borderBottom: `1px solid ${isLight ? '#f5f5f5' : 'rgba(255,255,255,0.05)'}` }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: isLight ? '#1C1917' : '#F2EDE2'
          }}>
            {title}
          </span>
          {activeCount > 0 && (
            <span style={{
              display: 'flex',
              height: '16px',
              minWidth: '16px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: isNiche ? '#D4AF37' : '#CA8A04',
              padding: '0 4px',
              fontSize: '0.6rem',
              fontWeight: 700,
              color: isNiche ? '#000' : '#fff'
            }}>
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: '#ccc',
            transition: 'transform 300ms ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0)'
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? '1000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 300ms ease-in-out',
          opacity: open ? 1 : 0
        }}
      >
        <div style={{ paddingBottom: '20px' }}>{children}</div>
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
  isNiche?: boolean;
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
  isNiche = false,
}: CatalogueFiltersProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== 'dark';

  const hasActiveFilters =
    !!selectedBrand ||
    !!selectedSize ||
    priceMin > priceRange.min ||
    priceMax < priceRange.max;

  const btnStyle = (active: boolean) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    padding: '10px 0',
    fontSize: '0.8rem',
    color: active ? (isNiche ? '#D4AF37' : '#CA8A04') : (isLight ? '#57534E' : '#A8A29E'),
    fontWeight: active ? 600 : 400,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 250ms ease'
  });

  const pillStyle = (active: boolean) => ({
    padding: '8px 16px',
    fontSize: '0.75rem',
    borderRadius: '10px',
    border: active 
      ? `1.5px solid ${isNiche ? '#D4AF37' : '#CA8A04'}` 
      : `1px solid ${isLight ? '#E7E5E4' : 'rgba(255,255,255,0.1)'}`,
    background: active ? (isNiche ? '#D4AF37' : '#CA8A04') : (isLight ? '#FFFFFF' : '#1C1917'),
    color: active ? '#FFFFFF' : (isLight ? '#44403C' : '#F2EDE2'),
    cursor: 'pointer',
    fontWeight: active ? 600 : 500,
    transition: 'all 250ms ease'
  });

  return (
    <>
      {showHeader && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: `1px solid ${isLight ? '#1C1917' : 'rgba(255,255,255,0.1)'}` 
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0, color: isLight ? '#1C1917' : '#F2EDE2' }}>
            FILTRES
          </p>
          {hasActiveFilters && onClearAll && (
            <button
              onClick={onClearAll}
              style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: '#999',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Effacer
            </button>
          )}
        </div>
      )}

      <FilterSection title="Marques" activeCount={selectedBrand ? 1 : 0} defaultOpen isNiche={isNiche}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button onClick={() => onBrandChange('')} style={btnStyle(!selectedBrand)}>Toutes les marques</button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onBrandChange(brand)}
              style={btnStyle(selectedBrand === brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Contenance" activeCount={selectedSize ? 1 : 0} defaultOpen isNiche={isNiche}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button onClick={() => onSizeChange('')} style={pillStyle(!selectedSize)}>Toutes</button>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              style={pillStyle(selectedSize === size)}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {priceRange.max > 0 && (
        <FilterSection
          title="Prix"
          defaultOpen
          activeCount={priceMin > priceRange.min || priceMax < priceRange.max ? 1 : 0}
          isNiche={isNiche}
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
    <div style={{ paddingRight: '10px' }}>
      <FilterPanel {...props} />
    </div>
  );
}
