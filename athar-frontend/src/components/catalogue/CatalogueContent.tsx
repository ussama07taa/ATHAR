'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CatalogueProductCard from '@/components/catalogue/CatalogueProductCard';
import CatalogueFilters from '@/components/catalogue/CatalogueFilters';
import MobileFilterDrawer from '@/components/catalogue/MobileFilterDrawer';
import { Product } from '@/types/product';
import { LayoutGrid, Grid3X3, List, ChevronDown } from 'lucide-react';

import { useTheme } from 'next-themes';

interface CatalogueContentProps {
  initialProducts?: Product[];
  initialFilters?: { brands: string[]; sizes: string[] };
  isNiche?: boolean;
  isPack?: boolean;
  isArabic?: boolean;
  isDecant?: boolean;
}

export default function CatalogueContent({ 
  initialProducts = [], 
  initialFilters = { brands: [], sizes: [] },
  isNiche = false,
  isPack = false,
  isArabic = false,
  isDecant = false
}: CatalogueContentProps) {
  const { resolvedTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);
  useEffect(() => { setThemeMounted(true); }, []);
  const isLight = !themeMounted || resolvedTheme === 'light';
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const categorySlug = searchParams.get('category') ?? '';
  const brandFromUrl = searchParams.get('brand') ?? '';
  const sizeFromUrl = searchParams.get('size') ?? '';

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [viewMode, setViewMode] = useState<'grid4' | 'grid2'>('grid4');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [packViewType, setPackViewType] = useState<'custom' | 'fixed'>('custom');

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState(brandFromUrl);
  const [selectedSize, setSelectedSize] = useState(sizeFromUrl);
  const [filterOptions, setFilterOptions] = useState<{ brands: string[]; sizes: string[] }>(initialFilters);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(99999);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 99999 });

  const prevCategoryRef = useRef(categorySlug);

  // Sync state with URL params
  useEffect(() => {
    setSelectedBrand(brandFromUrl);
    setSelectedSize(sizeFromUrl);
  }, [brandFromUrl, sizeFromUrl]);

  // Fetch filter options (Global - always show all brands/sizes)
  useEffect(() => {
    if (initialFilters.brands.length > 0 && prevCategoryRef.current === categorySlug) return;
    
    fetch('/api/products/filters')
      .then((res) => res.json())
      .then((data) => setFilterOptions({ brands: data.brands ?? [], sizes: data.sizes ?? [] }))
      .catch(() => {});
  }, [categorySlug]);


  // Fetch products (only if filters change or initialProducts is empty)
  useEffect(() => {
    // Skip first fetch if we have initialData and params haven't changed since server render
    const isInitialMount = products === initialProducts;
    const hasFilters = selectedBrand || selectedSize;
    
    if (isInitialMount && !hasFilters && initialProducts.length > 0 && prevCategoryRef.current === categorySlug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    if (categorySlug) params.set('category', categorySlug);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedSize) params.set('size', selectedSize);
    if (isNiche) params.set('is_niche', '1');
    if (isPack) params.set('is_pack', '1');
    if (isArabic) params.set('is_arabic', '1');
    if (isDecant) params.set('is_decant', '1');
    
    const genderParam = searchParams.get('gender');
    if (genderParam && genderParam !== 'all') {
      params.set('gender', genderParam);
    }
    
    const url = `/api/products?${params.toString()}`;
    
    fetch(url)
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        if (data.length > 0) {
          const allPrices = data.flatMap((p) => p.variants.map((v) => parseFloat(v.price)));
          const min = Math.floor(Math.min(...allPrices));
          const max = Math.ceil(Math.max(...allPrices));
          setPriceRange({ min, max });
          if (prevCategoryRef.current !== categorySlug) {
            setPriceMin(min);
            setPriceMax(max);
          }
        }
        setLoading(false);
        prevCategoryRef.current = categorySlug;
      })
      .catch(() => setLoading(false));
  }, [categorySlug, selectedBrand, selectedSize, isNiche, isPack]); // REMOVED searchParams so gender tabs are instant client-side.

  function updateUrl(brand: string, size: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (brand) params.set('brand', brand); else params.delete('brand');
    if (size) params.set('size', size); else params.delete('size');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const handleBrandChange = (b: string) => { setSelectedBrand(b); updateUrl(b, selectedSize); };
  const handleSizeChange = (s: string) => { setSelectedSize(s); updateUrl(selectedBrand, s); };
  const clearAllFilters = () => {
    setSelectedBrand('');
    setSelectedSize('');
    setPriceMin(priceRange.min);
    setPriceMax(priceRange.max);
    router.replace(categorySlug ? `${pathname}?category=${categorySlug}` : pathname, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    const genderFilter = searchParams.get('gender') || 'all';

    let result = products.filter((p) => {
      // Price Filter
      const prices = p.variants.map(v => parseFloat(v.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const inPriceRange = maxPrice >= priceMin && minPrice <= priceMax;
      
      // Gender Filter
      const matchesGender = genderFilter === 'all' || p.gender === genderFilter || p.gender === 'unisex';

      return inPriceRange && matchesGender;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => parseFloat(a.variants[0]?.price || '0') - parseFloat(b.variants[0]?.price || '0'));
    if (sortBy === 'price-desc') result.sort((a, b) => parseFloat(b.variants[0]?.price || '0') - parseFloat(a.variants[0]?.price || '0'));
    if (sortBy === 'alpha') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, priceMin, priceMax, sortBy, searchParams]);

  const filterProps = {
    brands: filterOptions.brands,
    sizes: filterOptions.sizes,
    selectedBrand,
    selectedSize,
    priceMin,
    priceMax,
    priceRange,
    onBrandChange: handleBrandChange,
    onSizeChange: handleSizeChange,
    onPriceChange: (min: number, max: number) => { setPriceMin(min); setPriceMax(max); },
    onClearAll: clearAllFilters,
    isNiche,
  };

  return (
    <div style={{ 
      background: isLight ? (isNiche ? '#FCFBFA' : '#fff') : '#0D0D0F', 
      minHeight: '100vh', 
      paddingTop: '20px',
      color: isLight ? '#1C1917' : '#F2EDE2',
      transition: 'background 500ms ease'
    }}>
      
      <style>{`
        .cat-container { display: flex; gap: 40px; max-width: 1400px; margin: 0 auto; padding: 0 16px; }
        @media (min-width: 768px) { .cat-container { padding: 0 24px; } }
        @media (min-width: 1024px) { .cat-container { padding: 0 40px; } }
        .cat-sidebar { width: 240px; flex-shrink: 0; display: none; }
        @media (min-width: 1024px) { .cat-sidebar { display: block; } }
        
        .cat-main { flex: 1; min-width: 0; }
        .cat-grid { display: grid; gap: 12px 8px; padding-bottom: 60px; }
        .grid-4 { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 640px) { .cat-grid { gap: 16px 12px; } }
        @media (min-width: 768px) { .grid-4 { grid-template-columns: repeat(3, 1fr); } .cat-grid { gap: 24px 16px; } }
        @media (min-width: 1024px) { .grid-4 { grid-template-columns: repeat(4, 1fr); } .cat-grid { gap: 40px 25px; } }
        
        .skeleton-item { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

        /* Niche Variations */
        .niche-text { color: #D4AF37 !important; }
        .niche-border { border-color: rgba(212, 175, 55, 0.2) !important; }

        /* Custom Sort Dropdown Style */
        .sort-select {
          appearance: none;
          background: none;
          border: none;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${isLight ? '#1C1917' : '#F2EDE2'};
          cursor: pointer;
          padding-right: 20px;
        }
        .sort-select option {
          background: ${isLight ? '#FFFFFF' : '#1C1917'};
          color: ${isLight ? '#1C1917' : '#F2EDE2'};
        }
      `}</style>

      <div className="cat-container">
        {/* Sidebar */}
        <aside className="cat-sidebar">
          <CatalogueFilters {...filterProps} showHeader={true} />
        </aside>

        {/* Main Content */}
        <div className="cat-main">
          
          {/* Top Control Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: `1px solid ${isLight ? (isNiche ? 'rgba(202,138,4,0.1)' : '#f0f0f0') : 'rgba(255,255,255,0.05)'}`,
            marginBottom: '10px',
            position: 'relative'
          }}>
            {/* Left: View Switches & Mobile Filter Toggle */}
            <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 10, color: isLight ? '#ccc' : '#444' }} className="desktop-only">
                <LayoutGrid 
                  size={18} 
                  style={{ cursor: 'pointer', color: viewMode === 'grid4' ? (isLight ? '#111' : '#fff') : (isLight ? '#ccc' : '#444') }} 
                  onClick={() => setViewMode('grid4')}
                />
                <Grid3X3 
                  size={18} 
                  style={{ cursor: 'pointer', color: viewMode === 'grid2' ? (isLight ? '#111' : '#fff') : (isLight ? '#ccc' : '#444') }} 
                  onClick={() => setViewMode('grid2')}
                />
              </div>
              
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                style={{ 
                  background: 'none', border: 'none', fontSize: '0.65rem', fontWeight: 700, 
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6
                }}
                className="lg:hidden"
              >
                 Filtres
              </button>
            </div>

            {/* Center: Count — hidden on mobile to avoid overlap */}
            <div style={{ 
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#999',
              display: 'flex',
              alignItems: 'center',
            }} className="desktop-only">
              {filteredProducts.length} PRODUITS
            </div>

            {/* Right: Sort */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select 
                className="sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Nouveautés</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="alpha">A-Z</option>
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Gender Filter Tabs */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 20, 
            marginBottom: 20,
            borderBottom: `1px solid ${isLight ? '#f0f0f0' : 'rgba(255,255,255,0.05)'}`,
            paddingBottom: 15
          }}>
            {[
              { id: 'all', label: 'TOUT' },
              { id: 'homme', label: 'HOMME' },
              { id: 'femme', label: 'FEMME' }
            ].map((tab) => {
              const isActive = (searchParams.get('gender') || 'all') === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (tab.id === 'all') params.delete('gender');
                    else params.set('gender', tab.id);
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: isActive ? (isLight ? '#111' : '#F2EDE2') : (isLight ? '#999' : '#78716C'),
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '0 5px 10px',
                    transition: 'color 300ms ease'
                  }}
                >
                  {tab.label}
                  {isActive && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      height: 2, 
                      background: isLight ? '#111' : '#F2EDE2' 
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Grid or Grouped Pack Sections */}
          {isPack ? (
            <div>
              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ color: '#999', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Aucun pack disponible dans cet univers pour le moment.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 30, paddingBottom: 15, borderBottom: '2px solid #111', display: 'inline-block' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Packs Decante Prêts-à-offrir
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>
                      Une sélection experte de nos fragrances les plus appréciées.
                    </p>
                  </div>

                  <div className={`cat-grid ${viewMode === 'grid4' ? 'grid-4' : 'grid-2'}`}>
                    {filteredProducts.map((p, idx) => (
                      <CatalogueProductCard key={p.id} product={p} priority={idx < 4} isNiche={isNiche} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={`cat-grid ${viewMode === 'grid4' ? 'grid-4' : 'grid-2'}`}>
              {loading ? (
                [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="skeleton-item" style={{ aspectRatio: '1/1', background: '#f5f5f5', borderRadius: 4 }} />
                ))
              ) : (
                filteredProducts.map((p, idx) => (
                  <CatalogueProductCard key={p.id} product={p} priority={idx < 4} isNiche={isNiche} />
                ))
              )}
            </div>
          )}
          
          {!loading && filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <p style={{ fontSize: '0.9rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Aucun produit ne correspond à vos filtres
              </p>
              <button 
                onClick={clearAllFilters}
                style={{ 
                  marginTop: 20, background: 'none', border: 'none', 
                  borderBottom: '1px solid #111', fontSize: '0.7rem', 
                  fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' 
                }}
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>
      </div>

      <MobileFilterDrawer
        {...filterProps}
        isOpen={mobileFiltersOpen}
        onOpen={() => setMobileFiltersOpen(true)}
        onClose={() => setMobileFiltersOpen(false)}
      />
    </div>
  );
}
