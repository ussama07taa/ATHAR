'use client';

import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/types/product';
import useCartStore from '@/store/cartStore';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface RelatedProductsProps {
  products: Product[];
}

function MiniProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';
  
  useEffect(() => { setMounted(true); }, []);

  const [selected] = useState<ProductVariant>(product.variants[0]);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleAdd = (e: React.MouseEvent) => {
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
    <div 
      onClick={() => router.push(`/products/${product.slug}`)}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', background: 'transparent' }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        background: isLight ? '#F5F5F4' : '#1C1917',
        overflow: 'hidden',
        borderRadius: '8px',
        border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}`
      }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 500ms ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: isLight ? '#F5F5F4' : '#1C1917' }} />
        )}
        <button
          onClick={handleAdd}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: 4,
            background: isLight ? '#FFFFFF' : '#0D0D0F',
            border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
            fontSize: '1.2rem',
            fontWeight: 300,
            color: isLight ? '#111827' : '#F2EDE2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            zIndex: 1,
            cursor: 'pointer'
          }}
        >
          +
        </button>
      </div>

      <div style={{ padding: '12px 2px', textAlign: 'center' }}>
        <h3 style={{
          margin: '0 0 4px',
          fontSize: '0.8rem',
          fontWeight: 400,
          color: isLight ? '#111827' : '#F2EDE2',
          textTransform: 'capitalize',
          letterSpacing: '0.02em',
        }}>
          {product.name}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '0.8rem',
          color: isLight ? '#44403C' : '#A8A29E',
          fontWeight: 600,
        }}>
          {selected ? `${parseFloat(selected.price).toFixed(2)} dh` : ''}
        </p>
      </div>
    </div>
  );
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';
  
  useEffect(() => { setMounted(true); }, []);

  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: '80px 0', borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, background: isLight ? '#FAFAFA' : '#0D0D0F', transition: 'background 300ms ease' }}>
      
      <style>{`
        .related-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px 15px;
          padding: 0 15px;
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .related-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 40px 25px;
            padding: 0 40px;
          }
        }
      `}</style>

      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <p style={{ 
          fontSize: '0.6rem', 
          fontWeight: 700, 
          letterSpacing: '0.4em', 
          color: '#CA8A04', 
          textTransform: 'uppercase',
          marginBottom: 12
        }}>
          Recommandations
        </p>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 400, 
          color: isLight ? '#111827' : '#F2EDE2',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontFamily: 'var(--font-display, serif)'
        }}>
          Vous aimerez aussi
        </h2>
      </div>

      <div className="related-grid">
        {products.slice(0, 4).map((product) => (
          <MiniProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
