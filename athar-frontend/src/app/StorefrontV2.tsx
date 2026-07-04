'use client';

import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import { Product, ProductVariant } from '@/types/product';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Truck, Wallet, Award, Headset } from 'lucide-react';

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

  // True if every variant has stock === 0
  const isOutOfStock = product.variants.length > 0 && product.variants.every(v => v.stock === 0);

  const handleAdd = (e: React.MouseEvent) => {
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
              opacity: isOutOfStock ? 0.45 : 1,
            }}
            onMouseOver={(e) => { if (!isOutOfStock) e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div className="theme-bg-card" style={{ width: '100%', height: '100%' }} />
        )}

        {/* Rupture de stock overlay */}
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
              fontSize: '0.5rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isLight ? '#1C1917' : '#F2EDE2',
              background: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(15,15,15,0.88)',
              border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}`,
              padding: '5px 12px',
              borderRadius: '20px',
            }}>
              RUPTURE DE STOCK
            </span>
          </div>
        )}

        {/* Quick Add Button — hidden when out of stock */}
        {!isOutOfStock && (
          <button
            onClick={handleAdd}
            className="theme-border"
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              width: '40px',
              height: '40px',
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
        )}
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
        {isOutOfStock ? (
          <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: isLight ? '#C0BFBD' : '#5C5C5C' }}>
            Épuisé
          </p>
        ) : (
          <p className="theme-text" style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600 }}>
            {selected ? `${parseFloat(selected.price).toFixed(2)} dh` : ''}
          </p>
        )}
      </div>
    </article>
  );
}

export default function StorefrontV2({ products, banners = [] }: { products: Product[], banners?: any[] }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'homme' | 'femme' | 'tout'>('tout');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';

  // Filters
  const nouveautes = products.filter(p => p.is_new_arrival).slice(0, 4);
  const fallbackNouveautes = products.slice(0, 4); // In case they haven't set any up yet
  const displayedNouveautes = nouveautes.length > 0 ? nouveautes : fallbackNouveautes;

  const orientalProducts = products.filter(p => p.is_arabic).slice(0, 4);
  const fallbackOriental = products.filter(p => 
    p.category?.slug?.toLowerCase().includes('arabic') || 
    p.name.toLowerCase().includes('oud') ||
    p.name.toLowerCase().includes('musc')
  ).slice(0, 4);
  const displayedOriental = orientalProducts.length > 0 ? orientalProducts : fallbackOriental;

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

  let displayedProducts = products.filter(p => p.is_best_seller);
  if (displayedProducts.length === 0) displayedProducts = products; // Fallback to all products if no best sellers defined

  if (activeTab === 'homme') displayedProducts = displayedProducts.filter(p => hommeProducts.includes(p));
  if (activeTab === 'femme') displayedProducts = displayedProducts.filter(p => femmeProducts.includes(p));
  
  // Limiting displayed to 8 for the grid to keep it clean, but showing more than 4
  const mainGridProducts = displayedProducts.slice(0, 8);

  const activeBanner = banners.length > 0 ? banners[0] : null;

  return (
    <div style={{ background: isLight ? '#FAFAFA' : '#0D0D0F', minHeight: '100vh', transition: 'background 300ms ease' }}>
      
      {/* Global CSS */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
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
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Cinematic Hero Banner */}
      <div className="hero-banner" style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden' }}>
        <Image 
          src={activeBanner?.image_url || "/images/hero_premium.png"} 
          alt={activeBanner?.title || "Athar Premium Collection"} 
          fill
          priority
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)', opacity: 0.8 }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)' }} />

        <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', zIndex: 10 }}>
          <p style={{ color: '#CA8A04', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', margin: '0 0 16px', fontWeight: 600, animation: 'fadeInDown 0.8s ease-out' }}>
            {activeBanner?.top_label || 'MAISON DE PARFUMS'}
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px 60px', borderRadius: '1px', textAlign: 'center', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 4.5rem)', fontWeight: 400, margin: '0 0 10px', letterSpacing: '0.15em', color: '#fff', fontFamily: 'var(--font-display, serif)', textTransform: 'uppercase' }}>
              {activeBanner?.title || 'Athar Parfums'}
            </h1>
            
            {(activeBanner?.subtitle || 'Collection Privée') && (
              <h2 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', fontWeight: 300, margin: '0 0 24px', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-display, serif)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {activeBanner?.subtitle || 'Collection Privée'}
              </h2>
            )}

            <div style={{ width: '60px', height: '1px', background: '#CA8A04', margin: '0 auto 24px' }} />

            <a href={activeBanner?.button_link || '/catalogue'} style={{ color: '#fff', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', padding: '12px 32px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 300ms ease', display: 'inline-block' }} onMouseOver={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}>
              {activeBanner?.button_text || 'Découvrir la collection'}
            </a>
          </div>
        </div>
      </div>

      {/* Trust Badges - Premium SVG */}
      <div className="theme-bg-card grid grid-cols-2 lg:grid-cols-4 gap-6" style={{ maxWidth: 1400, margin: '20px auto 40px', padding: '24px 20px', borderRadius: '8px', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, boxShadow: isLight ? '0 4px 15px rgba(0,0,0,0.02)' : '0 4px 15px rgba(0,0,0,0.2)' }}>
         <div style={{display:'flex', alignItems:'center', gap: 14}}>
            <Truck size={32} strokeWidth={1.5} color="#CA8A04" style={{ filter: 'drop-shadow(0 2px 4px rgba(202,138,4,0.2))', flexShrink: 0 }} />
            <div>
              <p className="theme-title" style={{margin:0, fontSize:'0.85rem', fontWeight:600}}>Livraison Rapide</p>
              <p className="theme-text" style={{margin:0, fontSize:'0.75rem', opacity:0.7}}>Partout au Maroc</p>
            </div>
         </div>
         <div style={{display:'flex', alignItems:'center', gap: 14}}>
            <Wallet size={32} strokeWidth={1.5} color="#CA8A04" style={{ filter: 'drop-shadow(0 2px 4px rgba(202,138,4,0.2))', flexShrink: 0 }} />
            <div>
              <p className="theme-title" style={{margin:0, fontSize:'0.85rem', fontWeight:600}}>Paiement Cash</p>
              <p className="theme-text" style={{margin:0, fontSize:'0.75rem', opacity:0.7}}>À la livraison</p>
            </div>
         </div>
         <div style={{display:'flex', alignItems:'center', gap: 14}}>
            <Award size={32} strokeWidth={1.5} color="#CA8A04" style={{ filter: 'drop-shadow(0 2px 4px rgba(202,138,4,0.2))', flexShrink: 0 }} />
            <div>
              <p className="theme-title" style={{margin:0, fontSize:'0.85rem', fontWeight:600}}>Qualité Supérieure</p>
              <p className="theme-text" style={{margin:0, fontSize:'0.75rem', opacity:0.7}}>Essences premium</p>
            </div>
         </div>
         <div style={{display:'flex', alignItems:'center', gap: 14}}>
            <Headset size={32} strokeWidth={1.5} color="#CA8A04" style={{ filter: 'drop-shadow(0 2px 4px rgba(202,138,4,0.2))', flexShrink: 0 }} />
            <div>
              <p className="theme-title" style={{margin:0, fontSize:'0.85rem', fontWeight:600}}>Support VIP</p>
              <p className="theme-text" style={{margin:0, fontSize:'0.75rem', opacity:0.7}}>À votre écoute</p>
            </div>
         </div>
      </div>

      {/* SECTION 1: NOUVEAUTÉS EXCLUSIVES */}
      {displayedNouveautes.length > 0 && (
        <div style={{ padding: '40px 0', borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#CA8A04', fontWeight: 700 }}>Découvrez nos derniers joyaux</p>
            <h2 className="theme-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, fontFamily: 'var(--font-display, serif)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nouveautés <strong style={{ fontWeight: 600 }}>Exclusives</strong></h2>
          </div>
          
          <div className="product-grid">
            {displayedNouveautes.map((p) => (
              <ProductCard key={`nouveau-${p.id}`} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: LA COLLECTION ORIENTALE (ARABIC) */}
      {displayedOriental.length > 0 && (
        <div style={{ 
          margin: '60px 0', 
          background: isLight ? 'linear-gradient(to right, #FDFBF7, #F6F2EB)' : 'linear-gradient(to right, #110E0B, #1A1612)', 
          padding: '60px 20px', 
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Oriental Elements */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(202,138,4,0.1) 0%, rgba(202,138,4,0) 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(202,138,4,0.05) 0%, rgba(202,138,4,0) 70%)' }} />

          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px', zIndex: 2 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="1" style={{ marginBottom: 16 }}>
                <path d="M12 2L15 10L23 11L17 16.5L19 24L12 20L5 24L7 16.5L1 11L9 10L12 2Z" fill="rgba(202,138,4,0.1)" />
              </svg>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, fontFamily: 'var(--font-display, serif)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.15em', color: isLight ? '#111827' : '#F2EDE2' }}>
                L'âme de <span style={{ color: '#CA8A04', fontStyle: 'italic' }}>l'Orient</span>
              </h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.8, color: isLight ? '#57534E' : '#A8A29E' }}>
                Plongez dans notre collection privée d'essences arabes. De l'Oud cambodgien majestueux au musc pur, des sillages intenses et envoûtants.
              </p>
            </div>

            <div className="product-grid" style={{ width: '100%', padding: 0 }}>
              {displayedOriental.map((p) => (
                <ProductCard key={`oriental-${p.id}`} product={p} />
              ))}
            </div>

            <a href="/parfums-arabic" className="w-[90%] sm:w-auto justify-center text-center" style={{ marginTop: '40px', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', background: 'transparent', border: '1px solid #CA8A04', color: '#CA8A04', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 300ms' }} onMouseOver={(e) => { e.currentTarget.style.background = '#CA8A04'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CA8A04'; }}>
              Voir toute la collection Orientale
            </a>
          </div>
        </div>
      )}

      {/* SECTION 3: BOUTIQUE CLASSIQUE (BEST SELLERS) */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <p className="theme-text" style={{ margin: '0 0 15px', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 600 }}>Découvrez nos</p>
        <h2 className="theme-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, fontFamily: 'var(--font-display, serif)', margin: '0 0 30px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best <strong style={{ fontWeight: 600 }}>Sellers</strong></h2>

        {/* Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
          {(['tout', 'homme', 'femme'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 15px',
                fontSize: '1.2rem',
                fontWeight: activeTab === tab ? 600 : 400,
                fontFamily: 'var(--font-display, serif)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeTab === tab ? '#CA8A04' : (isLight ? '#44403C' : '#A8A29E'),
                opacity: activeTab === tab ? 1 : 0.6,
                position: 'relative',
                transition: 'all 300ms ease',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div layoutId="underline" style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '2px', background: '#CA8A04' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', maxWidth: 1400, margin: '0 auto' }}>
        <div className="product-grid">
          {mainGridProducts.map((p) => (
            <ProductCard key={`main-${p.id}`} product={p} />
          ))}
        </div>
      </div>

      {/* VIEW ALL Button */}
      {displayedProducts.length > 8 && (
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <a
            href={`/catalogue${activeTab !== 'tout' ? `?category=${activeTab === 'homme' ? 'hommes' : 'femmes'}` : ''}`}
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
            onMouseOver={(e) => { e.currentTarget.style.background = isLight ? '#111827' : '#F2EDE2'; e.currentTarget.style.color = isLight ? '#FFFFFF' : '#000000'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isLight ? '#111827' : '#F2EDE2'; }}
          >
            VOIR TOUS LES PARFUMS
          </a>
        </div>
      )}

      {/* CTA Footer */}
      <div style={{ textAlign: 'center', padding: '60px 24px 100px', borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
        <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display, serif)', margin: '0 0 24px', color: isLight ? '#111827' : '#F2EDE2' }}>Trouvez votre signature olfactive.</h3>
        <a href="/catalogue" style={{ display: 'inline-block', borderBottom: `1px solid ${isLight ? '#111827' : '#F2EDE2'}`, color: isLight ? '#111827' : '#F2EDE2', padding: '4px 0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 200ms ease' }} onMouseOver={(e) => (e.currentTarget.style.opacity = '0.6')} onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}>
          Explorer le Catalogue
        </a>
      </div>
    </div>
  );
}
