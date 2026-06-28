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
        <div style={{ padding: '4px 2px', textAlign: 'center' }}>
          {product.is_pack && (
            <span style={{ 
              fontSize: '0.6rem', 
              fontWeight: 800, 
              color: '#CA8A04', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: 4
            }}>
              PACK DECANTE
            </span>
          )}
          <h3 style={{
            margin: '0 0 8px',
            fontSize: '1.05rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: '#0C0A09',
            textTransform: isNiche ? 'uppercase' : 'capitalize',
            letterSpacing: isNiche ? '0.08em' : '0.01em',
          }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: isNiche ? '#D4AF37' : '#6B6654',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              {selected ? `${parseFloat(selected.price).toFixed(2)} MAD` : ''}
            </p>
            {product.is_pack && (
              <span style={{ fontSize: '0.7rem', color: '#111', fontWeight: 700, borderBottom: '1px solid #111' }}>PERSONNALISER</span>
            )}
          </div>
        </div>
      </Link>
      
      <style>{`
        .hover-zoom:hover {
          transform: scale(1.05);
        }
      `}</style>
    </article>
  );
}
