'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { Product, ProductVariant } from '@/types/product';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface CatalogueProductCardProps {
  product: Product;
  priority?: boolean;
  isNiche?: boolean;
}

export default function CatalogueProductCard({ product, priority = false, isNiche = false }: CatalogueProductCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isLight = !mounted || resolvedTheme === 'light';

  const [selected] = useState<ProductVariant | undefined>(product.variants[0]);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // True if every variant has stock === 0
  const isOutOfStock = product.variants.length > 0 && product.variants.every(v => v.stock === 0);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selected || isOutOfStock) return;
    addItem({
      variantId: selected.id,
      sku: selected.sku,
      productName: product.name,
      variantName: selected.size,
      price: parseFloat(selected.price),
      slug: product.slug,
      imageUrl: product.image_url,
      quantity: 1,
    } as any);
    openCart();
  };

  return (
    <article style={{ display: 'flex', flexDirection: 'column', background: 'transparent' }}>
      <Link
        href={`/products/${product.slug}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {/* Image Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          background: isLight ? (isNiche ? '#FDFBF7' : '#F9F8F6') : '#1C1917',
          overflow: 'hidden',
          marginBottom: '14px',
          borderRadius: '14px',
          border: isNiche
            ? `1px solid ${isLight ? 'rgba(202, 138, 4, 0.2)' : 'rgba(202, 138, 4, 0.4)'}`
            : `1px solid ${isLight ? 'transparent' : 'rgba(255,255,255,0.05)'}`,
          boxShadow: isNiche ? '0 10px 40px -10px rgba(202, 138, 4, 0.1)' : 'none',
        }}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, 25vw"
              style={{
                objectFit: 'cover',
                transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: isOutOfStock ? 0.45 : 1,
              }}
              className="hover-zoom"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: isLight ? '#f5f5f5' : '#1C1917' }} />
          )}

          {/* ── Rupture de stock overlay ── */}
          {isOutOfStock && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isLight ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)',
              backdropFilter: 'blur(3px)',
              zIndex: 5,
            }}>
              <span style={{
                fontSize: '0.52rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: isLight ? '#1C1917' : '#F2EDE2',
                background: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(15,15,15,0.88)',
                border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}`,
                padding: '5px 13px',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                RUPTURE DE STOCK
              </span>
            </div>
          )}

          {/* ── Dynamic Promo Badge (hidden when out of stock) ── */}
          {product.badge_label && !isOutOfStock && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              background: product.badge_color || 'linear-gradient(135deg, #C8A25C, #9B7A3D)',
              color: '#ffffff',
              fontSize: '0.6rem',
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: '0 0 12px 12px',
              letterSpacing: '0.08em',
              zIndex: 10,
              boxShadow: `0 4px 12px ${product.badge_color || '#C8A25C'}4D`,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderTop: 'none',
              textTransform: 'uppercase',
            }}>
              {product.badge_label}
            </div>
          )}

          {/* ── Quick Add Button (hidden when out of stock) ── */}
          {!isOutOfStock && (
            <button
              onClick={handleAdd}
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isNiche
                  ? 'linear-gradient(135deg, #EAB308 0%, #A16207 100%)'
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                border: isNiche
                  ? '1px solid rgba(255, 215, 0, 0.4)'
                  : '1px solid rgba(202, 138, 4, 0.2)',
                fontSize: '1.4rem',
                fontWeight: 300,
                color: isNiche ? '#FFF' : '#CA8A04',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isNiche
                  ? '0 6px 20px rgba(202, 138, 4, 0.35)'
                  : '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 2,
                transition: 'all 300ms ease',
              }}
              className="quick-add-btn"
            >
              +
            </button>
          )}
        </div>

        {/* ── Product Info ── */}
        <div style={{ padding: '4px 4px 2px', textAlign: 'center' }}>
          {product.is_pack && (
            <span className="prod-pack-badge">PACK DECANTE</span>
          )}
          <h3 className="prod-title">{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {isOutOfStock ? (
              <p className="prod-sold-out">Épuisé</p>
            ) : (
              <p className="prod-price">
                {selected ? `${parseFloat(selected.price).toFixed(2)} MAD` : ''}
              </p>
            )}
            {product.is_pack && !isOutOfStock && (
              <span className="prod-pack-label">DÉCOUVRIR</span>
            )}
          </div>
        </div>
      </Link>

      <style>{`
        .hover-zoom:hover { transform: scale(1.05); }

        .prod-title {
          margin: 0 0 5px;
          font-size: 0.78rem;
          font-family: var(--font-display);
          font-weight: 600;
          color: ${isLight ? '#0C0A09' : '#F2EDE2'};
          text-transform: ${isNiche ? 'uppercase' : 'capitalize'};
          letter-spacing: ${isNiche ? '0.08em' : '0.01em'};
          line-height: 1.25;
        }
        .prod-price {
          margin: 0;
          font-size: 0.75rem;
          font-family: ui-sans-serif, system-ui, sans-serif;
          color: ${isLight ? (isNiche ? '#D4AF37' : '#6B6654') : (isNiche ? '#EAB308' : '#A8A29E')};
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .prod-sold-out {
          margin: 0;
          font-size: 0.68rem;
          font-family: ui-sans-serif, system-ui, sans-serif;
          color: ${isLight ? '#C0BFBD' : '#5C5C5C'};
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .prod-pack-label {
          font-size: 0.6rem;
          color: ${isLight ? '#111' : '#DDD'};
          font-weight: 700;
          border-bottom: 1px solid ${isLight ? '#111' : '#DDD'};
        }
        .prod-pack-badge {
          font-size: 0.55rem;
          font-weight: 800;
          color: #CA8A04;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }
        @media (min-width: 640px) {
          .prod-title  { font-size: 1rem;   margin: 0 0 7px; }
          .prod-price  { font-size: 0.88rem; }
          .prod-sold-out { font-size: 0.72rem; }
          .prod-pack-label  { font-size: 0.7rem; }
          .prod-pack-badge  { font-size: 0.6rem; }
        }
      `}</style>
    </article>
  );
}
