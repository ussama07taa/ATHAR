'use client';

import { useState, useEffect, useRef } from 'react';
import useCartStore from '@/store/cartStore';
import { Product, ProductVariant } from '@/types/product';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface Props {
  product: Product;
}

export default function ProductDetail({ product }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);
  
  const isLight = !mounted || resolvedTheme === 'light';

  const [selected, setSelected] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // Show sticky bar when user scrolls past the main CTA buttons
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px -80px 0px' }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  const mainImage = product.image_url;
  const outOfStock = selected.stock <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem({
      variantId: selected.id,
      sku: selected.sku,
      productName: product.name,
      variantName: selected.size,
      price: parseFloat(selected.price),
      slug: product.slug,
      imageUrl: product.image_url,
      quantity: quantity,
    } as any);
    openCart();
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addItem({
      variantId: selected.id,
      sku: selected.sku,
      productName: product.name,
      variantName: selected.size,
      price: parseFloat(selected.price),
      slug: product.slug,
      imageUrl: product.image_url,
      quantity: quantity,
    } as any);
    window.location.href = '/checkout';
  };

  const ctaButtons = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        style={{
          background: outOfStock ? (isLight ? '#F5F5F4' : '#1C1917') : (isLight ? '#111827' : '#F2EDE2'),
          color: outOfStock ? (isLight ? '#44403C' : '#A8A29E') : (isLight ? '#FFFFFF' : '#0D0D0F'),
          border: 'none',
          padding: '18px 24px',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          cursor: outOfStock ? 'not-allowed' : 'pointer',
          width: '100%',
          borderRadius: 14,
          transition: 'all 300ms cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        {outOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
      </button>
      <button
        onClick={handleBuyNow}
        disabled={outOfStock}
        style={{
          background: outOfStock ? (isLight ? '#F5F5F4' : '#1C1917') : 'linear-gradient(135deg, #CA8A04 0%, #A16207 100%)',
          color: outOfStock ? (isLight ? '#44403C' : '#A8A29E') : '#ffffff',
          border: 'none',
          padding: '18px 24px',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          cursor: outOfStock ? 'not-allowed' : 'pointer',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          borderRadius: 14,
          boxShadow: outOfStock ? 'none' : '0 10px 30px rgba(202,138,4,0.25)',
          transition: 'all 300ms cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        Commander maintenant
      </button>
    </div>
  );

  const variantAndQty = (
    <>
        <div style={{ marginBottom: 32 }}>
          <p style={{ 
            fontSize: '0.65rem', 
            color: '#A16207', 
            fontWeight: 700, 
            letterSpacing: '0.2em', 
            margin: '0 0 14px', 
            textTransform: 'uppercase' 
          }}>
            Sélectionner Contenance
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => { setSelected(v); setQuantity(1); }}
                disabled={v.stock <= 0}
                style={{
                  padding: '12px 24px',
                  background: selected.id === v.id ? (isLight ? '#111827' : '#F2EDE2') : (isLight ? '#FFFFFF' : '#0D0D0F'),
                  color: selected.id === v.id ? (isLight ? '#FFFFFF' : '#0D0D0F') : (isLight ? '#111827' : '#F2EDE2'),
                  border: `1.5px solid ${selected.id === v.id ? (isLight ? '#111827' : '#F2EDE2') : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)')}`,
                  borderRadius: 12,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: v.stock <= 0 ? 'not-allowed' : 'pointer',
                  opacity: v.stock <= 0 ? 0.45 : 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  transition: 'all 200ms ease'
                }}
              >
                {v.size}{v.stock <= 0 && ' — Épuisé'}
              </button>
            ))}
          </div>
        </div>

      <div style={{ marginBottom: 36 }}>
        <div style={{ 
          display: 'inline-flex', 
          background: isLight ? '#F5F5F4' : '#1C1917',
          borderRadius: 14,
          padding: 4,
          border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` 
        }}>
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))} 
            style={{ width: 44, height: 44, border: 'none', background: 'transparent', color: isLight ? '#111827' : '#F2EDE2', fontSize: '1.4rem', cursor: 'pointer', borderRadius: 10 }}
          >
            −
          </button>
          <div style={{ width: 52, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: isLight ? '#111827' : '#F2EDE2', fontWeight: 700 }}>{quantity}</div>
          <button 
            onClick={() => setQuantity(quantity + 1)} 
            style={{ width: 44, height: 44, border: 'none', background: 'transparent', color: isLight ? '#111827' : '#F2EDE2', fontSize: '1.4rem', cursor: 'pointer', borderRadius: 10 }}
          >
            +
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <style>{`
        .pd-mobile-img { display: block; }
        .pd-desktop-layout { display: none; }
        @media (min-width: 768px) {
          .pd-mobile-img { display: none !important; }
          .pd-desktop-layout { display: grid !important; }
        }
      `}</style>

      {/* ── MOBILE: Image Section ── */}
      <div className="pd-mobile-img" style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        marginLeft: '-50vw',
        marginTop: '0',
        paddingTop: '0',
        background: isLight ? '#F5F5F4' : '#1C1917',
        overflow: 'hidden',
      }}>
        {product.badge_label && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            background: product.badge_color || 'linear-gradient(135deg, #C8A25C, #9B7A3D)',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '0 0 12px 12px',
            letterSpacing: '0.05em',
            zIndex: 10,
            boxShadow: `0 4px 12px ${product.badge_color || '#C8A25C'}4D`,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderTop: 'none',
          }}>
            {product.badge_label}
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <span className="theme-text" style={{
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            {product.name}
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '70vw',
          minHeight: 340,
          maxHeight: 560,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              priority
              style={{
                objectFit: 'cover',
                objectPosition: 'center center',
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: isLight ? '#E7E5E4' : '#292524' }} />
          )}

          <div style={{
            position: 'absolute', top: 16, right: 16,
            width: 36, height: 36, borderRadius: '50%',
            background: isLight ? '#FFFFFF' : '#0D0D0F', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 5,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── MOBILE: Info section ── */}
      <div className="pd-mobile-img" style={{ padding: '28px 20px 140px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: '0.68rem', color: '#CA8A04', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 8px', fontWeight: 700 }}>
            {product.category?.name || 'EAU DE PARFUM'}
          </p>
          <h1 className="theme-title" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 300, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-display)', lineHeight: 1.05 }}>
            {product.name}
          </h1>
          <div style={{ fontSize: '1.35rem', color: '#CA8A04', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
            {parseFloat(selected.price).toFixed(2)}{' '}
            <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>dh</span>
          </div>
        </div>
        <div style={{ width: '100%', height: '1px', background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', marginBottom: 24 }} />
        {variantAndQty}
        <div ref={ctaRef}>
          {ctaButtons}
        </div>
        {product.description && (
          <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
            <h3 style={{ fontSize: '0.82rem', color: isLight ? '#111827' : '#F2EDE2', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px', fontWeight: 600 }}>
              Notes & Caractère
            </h3>
            <p style={{ fontSize: '0.85rem', color: isLight ? '#44403C' : '#A8A29E', lineHeight: 1.7, margin: 0 }}>{product.description}</p>
          </div>
        )}
      </div>

      {/* ── DESKTOP: Side-by-side layout ── */}
      <div
        className="pd-desktop-layout"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 40px 140px',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: '80px',
          alignItems: 'start',
        }}
      >
        {/* Left: Image Container */}
        <div style={{
          background: isLight ? '#F5F5F4' : '#1C1917',
          aspectRatio: '4/5',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 8,
          border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`
        }}>
          {product.badge_label && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              background: product.badge_color || 'linear-gradient(135deg, #C8A25C, #9B7A3D)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '6px 20px',
              borderRadius: '0 0 14px 14px',
              letterSpacing: '0.05em',
              zIndex: 10,
              boxShadow: `0 4px 12px ${product.badge_color || '#C8A25C'}4D`,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderTop: 'none',
            }}>
              {product.badge_label}
            </div>
          )}
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: isLight ? '#F5F5F4' : '#1C1917' }} />
          )}
          <div style={{
            position: 'absolute', top: 20, right: 20,
            width: 40, height: 40, borderRadius: '50%',
            background: isLight ? '#FFFFFF' : '#0D0D0F', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Right: Info Area */}
        <div style={{ paddingTop: 20 }}>
          <p style={{ fontSize: '0.68rem', color: '#CA8A04', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 10px', fontWeight: 700 }}>
            {product.category?.name || 'EAU DE PARFUM'}
          </p>
          <h1 className="theme-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 300, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-display)', lineHeight: 1.05 }}>
            {product.name}
          </h1>
          <div style={{ fontSize: '1.8rem', color: '#CA8A04', fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 32 }}>
            {parseFloat(selected.price).toFixed(2)}{' '}
            <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>dh</span>
          </div>
          <div style={{ width: '100%', height: '1px', background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', marginBottom: 32 }} />
          {variantAndQty}
          {ctaButtons}
          {product.description && (
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
              <h3 style={{ fontSize: '0.85rem', color: isLight ? '#111827' : '#F2EDE2', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 16px', fontWeight: 700 }}>
                Notes & Caractère
              </h3>
              <p style={{ fontSize: '0.9rem', color: isLight ? '#44403C' : '#A8A29E', lineHeight: 1.8, margin: 0 }}>{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR (mobile only) ── */}
      <style>{`
        .sticky-cta {
          display: none;
        }
        @media (max-width: 767px) {
          .sticky-cta {
            display: flex;
          }
          ${showStickyBar ? '#whatsapp-widget { bottom: 96px !important; }' : ''}
        }
      `}</style>
      <div
        className="sticky-cta"
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 999,
          background: 'linear-gradient(135deg, #CA8A04 0%, #A16207 100%)',
          padding: '20px 24px',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          borderRadius: 20,
          transform: showStickyBar ? 'translateY(0)' : 'translateY(200%)',
          transition: 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1)',
          boxShadow: '0 20px 50px rgba(202,138,4,0.4)',
        }}
        onClick={handleBuyNow}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <span style={{
          color: '#ffffff',
          fontSize: '0.9rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}>
          Commander maintenant
        </span>
      </div>
    </div>
  );
}
