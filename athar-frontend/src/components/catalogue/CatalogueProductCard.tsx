'use client';

import { useState } from 'react';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { Product, ProductVariant } from '@/types/product';
import Image from 'next/image';

interface CatalogueProductCardProps {
  product: Product;
  priority?: boolean;
  isNiche?: boolean;
}

export default function CatalogueProductCard({ product, priority = false, isNiche = false }: CatalogueProductCardProps) {
  const [selected] = useState<ProductVariant | undefined>(product.variants[0]);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

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
          background: isNiche ? '#FDFBF7' : '#F9F8F6',
          overflow: 'hidden',
          marginBottom: '20px',
          borderRadius: '16px',
          border: isNiche ? '1px solid rgba(202, 138, 4, 0.2)' : 'none',
          boxShadow: isNiche ? '0 10px 40px -10px rgba(202, 138, 4, 0.1)' : 'none'
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
              }}
              className="hover-zoom"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f5f5f5' }} />
          )}

          {/* Dynamic Promo Badge */}
          {product.badge_label && (
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
              textTransform: 'uppercase'
            }}>
              {product.badge_label}
            </div>
          )}
          
          {/* Quick Add Button */}
          <button
            onClick={handleAdd}
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: isNiche ? 'linear-gradient(135deg, #EAB308 0%, #A16207 100%)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: isNiche ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid rgba(202, 138, 4, 0.2)',
              fontSize: '1.4rem',
              fontWeight: isNiche ? 300 : 300,
              color: isNiche ? '#FFF' : '#CA8A04',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isNiche ? '0 6px 20px rgba(202, 138, 4, 0.35)' : '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 2,
              transition: 'all 300ms ease'
            }}
            className="quick-add-btn"
          >
            +
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '6px 2px 2px', textAlign: 'center' }}>
          {product.is_pack && (
            <span className="prod-pack-badge">
              PACK DECANTE
            </span>
          )}
          <h3 className="prod-title">
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <p className="prod-price">
              {selected ? `${parseFloat(selected.price).toFixed(2)} MAD` : ''}
            </p>
            {product.is_pack && (
              <span className="prod-pack-label">DÉCOUVRIR</span>
            )}
          </div>
        </div>
      </Link>
      
      <style>{`
        .hover-zoom:hover {
          transform: scale(1.05);
        }
        .prod-title {
          margin: 0 0 6px;
          font-size: 0.85rem;
          font-family: var(--font-display);
          font-weight: 600;
          color: #0C0A09;
          text-transform: ${isNiche ? 'uppercase' : 'capitalize'};
          letter-spacing: ${isNiche ? '0.08em' : '0.01em'};
          line-height: 1.2;
        }
        .prod-price {
          margin: 0;
          font-size: 0.8rem;
          font-family: ui-sans-serif, system-ui, sans-serif;
          color: ${isNiche ? '#D4AF37' : '#6B6654'};
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .prod-pack-label {
          font-size: 0.6rem;
          color: #111;
          font-weight: 700;
          border-bottom: 1px solid #111;
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
          .prod-title {
            font-size: 1.05rem;
            margin: 0 0 8px;
          }
          .prod-price {
            font-size: 0.9rem;
          }
          .prod-pack-label {
            font-size: 0.7rem;
          }
          .prod-pack-badge {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </article>
  );
}
