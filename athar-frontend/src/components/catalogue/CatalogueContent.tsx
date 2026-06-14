'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, X } from 'lucide-react';
import CatalogueProductCard from '@/components/catalogue/CatalogueProductCard';
import CatalogueFilters from '@/components/catalogue/CatalogueFilters';
import MobileFilterDrawer from '@/components/catalogue/MobileFilterDrawer';
import { Product } from '@/app/page';
import { CategoryDetail } from '@/types/catalog';

function getProductMinMaxPrice(product: Product) {
  const prices = product.variants.map((v) => parseFloat(v.price));
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export default function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categorySlug = searchParams.get('category') ?? '';
  const brandFromUrl = searchParams.get('brand') ?? '';
  const sizeFromUrl = searchParams.get('size') ?? '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDetail, setCategoryDetail] = useState<CategoryDetail | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBrand, setSelectedBrand] = useState(brandFromUrl);
  const [selectedSize, setSelectedSize] = useState(sizeFromUrl);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{ brands: string[]; sizes: string[] }>({
    brands: [],
    sizes: [],
  });
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(99999);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 99999 });
  const prevCategoryRef = useRef(categorySlug);

  function clearAllFilters() {
    setSelectedBrand('');
    setSelectedSize('');
    setPriceMin(priceRange.min);
    setPriceMax(priceRange.max);
    updateFiltersInUrl('', '');
  }

  function updateFiltersInUrl(brand: string, size: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) params.set('category', categorySlug);
    else params.delete('category');

    if (brand) params.set('brand', brand);
    else params.delete('brand');

    if (size) params.set('size', size);
    else params.delete('size');

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function handleBrandChange(brand: string) {
    setSelectedBrand(brand);
    updateFiltersInUrl(brand, selectedSize);
  }

  function handleSizeChange(size: string) {
    setSelectedSize(size);
    updateFiltersInUrl(selectedBrand, size);
  }

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
    onPriceChange: (min: number, max: number) => {
      setPriceMin(min);
      setPriceMax(max);
    },
    onClearAll: clearAllFilters,
  };

  useEffect(() => {
    if (!categorySlug) {
      setCategoryDetail(null);
      return;
    }
    fetch(`/api/collections/${encodeURIComponent(categorySlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCategoryDetail(data))
      .catch(() => setCategoryDetail(null));
  }, [categorySlug]);

  useEffect(() => {
    if (prevCategoryRef.current === categorySlug) return;
    prevCategoryRef.current = categorySlug;

    setSelectedBrand('');
    setSelectedSize('');

    const params = new URLSearchParams();
    if (categorySlug) params.set('category', categorySlug);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [categorySlug, pathname, router]);

  useEffect(() => {
    setSelectedBrand(brandFromUrl);
  }, [brandFromUrl]);

  useEffect(() => {
    setSelectedSize(sizeFromUrl);
  }, [sizeFromUrl]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (categorySlug) params.set('category', categorySlug);
    const qs = params.toString();
    fetch(`/api/products/filters${qs ? `?${qs}` : ''}`)
      .then((res) => res.json())
      .then((data) => setFilterOptions({ brands: data.brands ?? [], sizes: data.sizes ?? [] }))
      .catch(() => {});
  }, [categorySlug]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categorySlug) params.set('category', categorySlug);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedSize) params.set('size', selectedSize);
    const qs = params.toString();
    const url = qs ? `/api/products?${qs}` : '/api/products';

    fetch(url)
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        if (data.length > 0) {
          const allPrices = data.flatMap((p) => p.variants.map((v) => parseFloat(v.price)));
          const min = Math.floor(Math.min(...allPrices));
          const max = Math.ceil(Math.max(...allPrices));
          setPriceRange({ min, max });
          setPriceMin(min);
          setPriceMax(max);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categorySlug, selectedBrand, selectedSize]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const { min, max } = getProductMinMaxPrice(p);
      return max >= priceMin && min <= priceMax;
    });

    switch (sortBy) {
      case 'alphabetical-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alphabetical-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort(
          (a, b) =>
            parseFloat(a.variants[0]?.price || '0') - parseFloat(b.variants[0]?.price || '0'),
        );
        break;
      case 'price-desc':
        result.sort(
          (a, b) =>
            parseFloat(b.variants[0]?.price || '0') - parseFloat(a.variants[0]?.price || '0'),
        );
        break;
      default:
        break;
    }
    return result;
  }, [products, sortBy, priceMin, priceMax]);

  const pageTitle = categoryDetail?.name ?? (categorySlug ? 'Produits' : 'Catalogue');

  const breadcrumbs = categoryDetail
    ? [
        { label: 'Catalogue', href: '/catalogue?category=parfums' },
        ...categoryDetail.ancestors.map((a) => ({
          label: a.name,
          href: `/catalogue?category=${a.slug}`,
        })),
        { label: categoryDetail.name, href: '' },
      ]
    : [{ label: 'Catalogue', href: '' }];

  const activeTags = [
    selectedBrand && { key: 'brand', label: selectedBrand, clear: () => handleBrandChange('') },
    selectedSize && { key: 'size', label: selectedSize, clear: () => handleSizeChange('') },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <div className="catalogue-page min-h-screen bg-[#FAFAF8] pb-20 text-neutral-900 dark:bg-dark-900 dark:text-cream sm:pb-24">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Fil d'Ariane"
          className="mb-6 flex flex-wrap items-center gap-2 pt-2 text-[10px] font-semibold tracking-[0.14em] text-neutral-400 uppercase sm:mb-8"
        >
          <Link href="/" className="text-gold transition-opacity hover:opacity-70">
            Athar
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-neutral-300 dark:text-white/20">/</span>
              {crumb.href ? (
                <Link href={crumb.href} className="text-gold transition-opacity hover:opacity-70">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-neutral-600 dark:text-cream-dim">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Hero title */}
        <header className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.28em] text-gold-dim uppercase">
            Maison de Parfums
          </p>
          <h1 className="font-display text-3xl font-medium tracking-[0.04em] text-neutral-900 uppercase dark:text-cream sm:text-4xl md:text-5xl">
            {pageTitle}
          </h1>
          <div className="mx-auto mt-5 h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-14">
          <CatalogueFilters {...filterProps} />

          <div className="min-w-0 flex-1">
            {/* Mobile filters */}
            <div className="mb-6 lg:hidden">
              <MobileFilterDrawer
                {...filterProps}
                isOpen={mobileFiltersOpen}
                onOpen={() => setMobileFiltersOpen(true)}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </div>

            {/* Toolbar */}
            <div className="mb-5 flex flex-col gap-3 border-b border-neutral-200/80 pb-4 dark:border-white/10 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-500 dark:text-cream-dim">
                <span className="font-medium text-neutral-900 dark:text-cream">{filteredProducts.length}</span>{' '}
                {filteredProducts.length === 1 ? 'produit' : 'produits'}
                {products.length !== filteredProducts.length && (
                  <span> sur {products.length}</span>
                )}
              </p>

              <div className="relative">
                <label htmlFor="catalogue-sort" className="sr-only">
                  Trier par
                </label>
                <select
                  id="catalogue-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="catalogue-sort appearance-none rounded-full border border-neutral-200 bg-white py-2.5 pr-10 pl-4 text-[13px] font-medium text-neutral-800 transition-colors hover:border-neutral-400 focus:border-neutral-900 focus:outline-none dark:border-white/10 dark:bg-dark-800 dark:text-cream dark:hover:border-gold/30 dark:focus:border-gold/50"
                >
                  <option value="newest">Nouveautés</option>
                  <option value="alphabetical-asc">Alphabétique, A–Z</option>
                  <option value="alphabetical-desc">Alphabétique, Z–A</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>

            {/* Active filter tags */}
            {activeTags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {activeTags.map((tag) => (
                  <button
                    key={tag.key}
                    type="button"
                    onClick={tag.clear}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-700 transition-colors hover:border-neutral-900 dark:border-white/10 dark:bg-dark-800 dark:text-cream-dim dark:hover:border-gold/40"
                  >
                    {tag.label}
                    <X size={12} />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[12px] font-medium text-neutral-400 underline-offset-2 hover:text-neutral-900 hover:underline"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 gap-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-neutral-200/60" />
                    <div className="mt-4 h-3 w-16 bg-neutral-200/60" />
                    <div className="mt-2 h-4 w-full bg-neutral-200/60" />
                    <div className="mt-3 h-4 w-20 bg-neutral-200/60" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200/80 bg-white py-20 text-center dark:border-white/10 dark:bg-dark-800 sm:py-24">
                <p className="font-display text-xl text-neutral-800 dark:text-cream sm:text-2xl">Aucun produit trouvé</p>
                <p className="mx-auto mt-3 max-w-sm text-sm text-neutral-500">
                  Essayez de modifier vos filtres ou explorez une autre catégorie.
                </p>
                <Link
                  href="/catalogue?category=parfums"
                  className="mt-8 inline-block border border-neutral-900 px-6 py-3 text-[11px] font-bold tracking-[0.14em] text-neutral-900 uppercase transition-colors hover:bg-neutral-900 hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-dark-900 sm:px-8"
                >
                  Voir tous les parfums
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-12">
                {filteredProducts.map((p) => (
                  <CatalogueProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
