'use client';

import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import { Product, ProductVariant } from '@/types/product';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import Image from 'next/image';

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';

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
    <article
      onClick={() => router.push(`/products/${product.slug}`)}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', background: 'transparent' }}
    >
      {/* Product Image Container */}
      <div className="theme-bg-card theme-border" style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        border: '1px solid',
        borderRadius: '8px'
      }}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ 
              objectFit: 'cover',
              transition: 'transform 500ms ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div className="theme-bg-card" style={{ width: '100%', height: '100%' }} />
        )}
        
        {/* Quick Add Button */}
        <button
          onClick={handleAdd}
          className="theme-border"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            background: isLight ? '#FFFFFF' : '#0C0A09',
            border: '1px solid',
            fontSize: '1.2rem',
            fontWeight: 300,
            color: isLight ? '#111827' : '#F2EDE2',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            zIndex: 2
          }}
        >
          +
        </button>
      </div>

      {/* Product Info */}
      <div style={{ padding: '12px 4px', textAlign: 'center' }}>
        <h3 className="theme-title" style={{
          margin: '0 0 4px',
          fontSize: '0.85rem',
          fontWeight: 400,
          textTransform: 'capitalize',
          letterSpacing: '0.02em',
        }}>
          {product.name}
        </h3>
        <p className="theme-text" style={{
          margin: 0,
          fontSize: '0.82rem',
          fontWeight: 600,
        }}>
          {selected ? `${parseFloat(selected.price).toFixed(2)} dh` : ''}
        </p>
      </div>
    </article>
  );
}

export default function StorefrontV2({ products, banners = [] }: { products: Product[], banners?: any[] }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'homme' | 'femme'>('homme');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';

  const hommeProducts = products.filter(p =>
    p.gender === 'homme' || p.gender === 'unisex' ||
    p.category?.slug?.toLowerCase().includes('homme') ||
    p.category?.name?.toLowerCase().includes('homme')
  );
  const femmeProducts = products.filter(p =>
    p.gender === 'femme' || p.gender === 'unisex' ||
    p.category?.slug?.toLowerCase().includes('femme') ||
    p.category?.name?.toLowerCase().includes('femme')
  );

  const displayedProducts = activeTab === 'homme'
    ? (hommeProducts.length > 0 ? hommeProducts : products)
    : (femmeProducts.length > 0 ? femmeProducts : products);

  const activeBanner = banners.length > 0 ? banners[0] : null;

  return (
    <div style={{ background: isLight ? '#FAFAFA' : '#0D0D0F', minHeight: '100vh', transition: 'background 300ms ease' }}>
      
      {/* Global CSS for responsive grid */}
      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px 15px;
          padding: 0 15px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 40px 25px;
            padding: 0 40px 60px;
          }
        }
        .hero-banner {
          height: 60vh;
          min-height: 400px;
        }
        @media (min-width: 1024px) {
          .hero-banner {
            height: 85vh;
          }
        }
      `}</style>

      {/* Cinematic Hero Banner - Always Dark for contrast */}
      <div className="hero-banner" style={{ 
        width: '100%', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#000',
        overflow: 'hidden'
      }}>
        {/* Main Hero Image */}
        <Image 
          src={activeBanner?.image_url || "/images/hero_premium.png"} 
          alt={activeBanner?.title || "Athar Premium Collection"} 
          fill
          priority
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)' }} 
        />

        {/* Ambient Dark Overlay */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)' 
        }} />

        {/* Liquid Glass Overlay Content */}
        <div style={{ 
          position: 'absolute', 
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          zIndex: 10
        }}>
          {/* Top Label */}
          <p style={{
            color: '#CA8A04',
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
            fontWeight: 600,
            animation: 'fadeInDown 0.8s ease-out'
          }}>{activeBanner?.top_label || 'MAISON DE PARFUMS'}</p>

          {/* Central Glass Content */}
          <div style={{ 
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '40px 60px',
            borderRadius: '1px',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <h1 style={{ 
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)', 
              fontWeight: 400, 
              margin: '0 0 10px', 
              letterSpacing: '0.15em',
              color: '#fff',
              fontFamily: 'var(--font-display, serif)',
              textTransform: 'uppercase'
            }}>{activeBanner?.title || 'Athar Parfums'}</h1>
            
            {(activeBanner?.subtitle || 'Collection Privée') && (
              <h2 style={{ 
                fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', 
                fontWeight: 300, 
                margin: '0 0 24px', 
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-display, serif)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>{activeBanner?.subtitle || 'Collection Privée'}</h2>
            )}

            <div style={{ 
              width: '60px', 
              height: '1px', 
              background: '#CA8A04', 
              margin: '0 auto 24px' 
            }} />

            <a href={activeBanner?.button_link || '/catalogue'} style={{ 
              color: '#fff', 
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 32px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 300ms ease',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#000';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#fff';
            }}
            >{activeBanner?.button_text || 'Découvrir la collection'}</a>
          </div>

        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="theme-bg-card" style={{ 
        maxWidth: 1400, 
        margin: '20px auto 40px', 
        display: 'flex', 
        justifyContent: 'space-around', 
        flexWrap: 'wrap', 
        gap: '20px', 
        padding: '20px',
        borderRadius: '8px',
        border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
        boxShadow: isLight ? '0 4px 15px rgba(0,0,0,0.02)' : '0 4px 15px rgba(0,0,0,0.2)'
      }}>
         <div style={{display:'flex', alignItems:'center', gap: 10}}>
            <span style={{fontSize:'1.8rem', color: '#CA8A04'}}>🚚</span>
            <div>
              <p className="theme-title" style={{margin:0, fontSize:'0.85rem', fontWeight:600}}>Livraison Rapide</p>
              <p className="theme-text" style={{margin:0, fontSize:'0.75rem', opacity:0.7}}>Partout au Maroc</p>
            </div>
         </div>
         <div style={{display:'flex', alignItems:'center', gap: 10}}>
            <span style={{fontSize:'1.8rem', color: '#CA8A04'}}>💵</span>
            <div>
              <p className="theme-title" style={{margin:0, fontSize:'0.85rem', fontWeight:600}}>Paiement Cash</p>
              <p className="theme-text" style={{margin:0, fontSize:'0.75rem', opacity:0.7}}>À la livraison (COD)</p>
            </div>
         </div>
         <div style={{display:'flex', alignItems:'center', gap: 10}}>
            <span style={{fontSize:'1.8rem', color: '#CA8A04'}}>⭐</span>
            <div>
              <p className="theme-title" style={{margin:0, fontSize:'0.85rem', fontWeight:600}}>Qualité Supérieure</p>
              <p className="theme-text" style={{margin:0, fontSize:'0.75rem', opacity:0.7}}>Essences premium</p>
            </div>
         </div>
         <div style={{display:'flex', alignItems:'center', gap: 10}}>
            <span style={{fontSize:'1.8rem', color: '#CA8A04'}}>💬</span>
            <div>
              <p className="theme-title" style={{margin:0, fontSize:'0.85rem', fontWeight:600}}>Support Client</p>
              <p className="theme-text" style={{margin:0, fontSize:'0.75rem', opacity:0.7}}>Assistance VIP</p>
            </div>
         </div>
      </div>

      {/* Section Header */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <p className="theme-text" style={{
          margin: '0 0 15px',
          fontSize: '0.6rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>Meilleure Vente</p>

        {/* Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
          {(['homme', 'femme'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 0',
                fontSize: '1.8rem',
                fontWeight: activeTab === tab ? 500 : 300,
                fontFamily: 'var(--font-display, serif)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeTab === tab ? (isLight ? '#111827' : '#F2EDE2') : (isLight ? '#44403C' : '#A8A29E'),
                opacity: activeTab === tab ? 1 : 0.4,
                position: 'relative',
                transition: 'all 300ms ease',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: isLight ? '#111827' : '#F2EDE2',
                }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - Dual Grid for Instant Switching */}
      <div style={{ position: 'relative', maxWidth: 1400, margin: '0 auto' }}>
        {/* Homme Grid */}
        <div 
          className="product-grid" 
          style={{ 
            display: activeTab === 'homme' ? 'grid' : 'none',
            opacity: activeTab === 'homme' ? 1 : 0,
            transition: 'opacity 300ms ease'
          }}
        >
          {hommeProducts.slice(0, 4).map((p) => (
            <ProductCard key={`${p.id}-homme`} product={p} />
          ))}
        </div>

        {/* Femme Grid */}
        <div 
          className="product-grid" 
          style={{ 
            display: activeTab === 'femme' ? 'grid' : 'none',
            opacity: activeTab === 'femme' ? 1 : 0,
            transition: 'opacity 300ms ease'
          }}
        >
          {femmeProducts.slice(0, 4).map((p) => (
            <ProductCard key={`${p.id}-femme`} product={p} />
          ))}
        </div>
      </div>

      {/* VIEW ALL Button */}
      {displayedProducts.length > 4 && (
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <a
            href={`/catalogue?category=${activeTab === 'homme' ? 'hommes' : 'femmes'}`}
            style={{
              display: 'inline-block',
              background: 'transparent',
              border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
              color: isLight ? '#111827' : '#F2EDE2',
              padding: '14px 40px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 300ms ease',
              borderRadius: '2px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = isLight ? '#111827' : '#F2EDE2';
              e.currentTarget.style.color = isLight ? '#FFFFFF' : '#000000';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = isLight ? '#111827' : '#F2EDE2';
            }}
          >
            VIEW ALL
          </a>
        </div>
      )}

      {/* CTA Footer */}
      <div style={{ textAlign: 'center', padding: '60px 24px 100px', borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
        <a
          href="/catalogue"
          style={{
            display: 'inline-block',
            borderBottom: `1px solid ${isLight ? '#111827' : '#F2EDE2'}`,
            color: isLight ? '#111827' : '#F2EDE2',
            padding: '4px 0',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'opacity 200ms ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.6')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Découvrir toute la collection
        </a>
      </div>
    </div>
  );
}
