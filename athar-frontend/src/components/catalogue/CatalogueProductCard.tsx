'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Check } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { Product, ProductVariant, PerfumeBottle, bottleColors } from '@/app/page';

interface CatalogueProductCardProps {
  product: Product;
}

function formatPrice(price: string | number) {
  return new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(Number(price));
}

function getPriceDisplay(variants: ProductVariant[]) {
  if (variants.length === 0) return '—';
  const prices = variants.map((v) => parseFloat(v.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `${formatPrice(min)} MAD`;
  return `${formatPrice(min)} – ${formatPrice(max)} MAD`;
}

export default function CatalogueProductCard({ product }: CatalogueProductCardProps) {
  const [selected] = useState<ProductVariant | undefined>(product.variants[0]);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const color = bottleColors[product.slug] ?? '#C8A25C';

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selected) return;
    addItem({
      variantId: selected.id,
      sku: selected.sku,
      productName: product.name,
      variantName: selected.size,
      price: parseFloat(selected.price),
      slug: product.slug,
      imageUrl: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="catalogue-card group flex h-full flex-col">
      {/* Image zone */}
      <Link
        href={`/products/${product.slug}`}
        className="catalogue-card__media relative block overflow-hidden"
        aria-label={`Voir ${product.name}`}
      >
        <button
          type="button"
          aria-label={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={wishlisted}
          className={`catalogue-card__wishlist absolute top-2.5 right-2.5 z-20 flex h-10 w-10 items-center justify-center rounded-full sm:top-3 sm:right-3 ${
            wishlisted ? 'is-active' : ''
          }`}
          onClick={(e) => {
            e.preventDefault();
            setWishlisted(!wishlisted);
          }}
        >
          <Heart size={17} strokeWidth={1.5} className={wishlisted ? 'fill-current' : ''} />
        </button>

        <div className="catalogue-card__image-wrap relative flex aspect-[4/5] items-center justify-center px-5 py-7 sm:px-7 sm:py-9">
          {!imageLoaded && product.image_url && (
            <div className="catalogue-card__skeleton absolute inset-0 animate-pulse" />
          )}

          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`relative z-10 max-h-full max-w-full object-contain transition-all duration-500 ease-out group-hover:scale-[1.05] ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <PerfumeBottle color={color} />
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="catalogue-card__body flex flex-1 flex-col px-3.5 pt-4 pb-3.5 sm:px-4 sm:pt-5 sm:pb-4">
        {product.brand && (
          <p className="mb-1.5 text-[10px] font-bold tracking-[0.18em] text-gold uppercase sm:text-[11px]">
            {product.brand}
          </p>
        )}

        <Link href={`/products/${product.slug}`} className="mb-2 block min-h-[2.5rem] sm:min-h-[2.75rem]">
          <h3 className="catalogue-card__title line-clamp-2 text-[12px] leading-snug font-semibold tracking-[0.04em] uppercase sm:text-[13px]">
            {product.name}
          </h3>
        </Link>

        <p className="catalogue-card__price mb-3 text-sm font-bold tracking-wide sm:mb-4 sm:text-[15px]">
          {getPriceDisplay(product.variants)}
        </p>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selected}
          className={`catalogue-card__cta mt-auto flex min-h-[48px] w-full items-center justify-center gap-2 text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-300 active:scale-[0.98] sm:min-h-[46px] ${
            added ? 'is-added' : ''
          }`}
        >
          {added ? (
            <>
              <Check size={15} strokeWidth={2.5} />
              Ajouté
            </>
          ) : (
            'Ajouter au panier'
          )}
        </button>
      </div>
    </article>
  );
}
