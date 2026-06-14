'use client';

import { useState } from 'react';
import { Product, ProductVariant, bottleColors, PerfumeBottle } from './page';
import CheckoutForm from './CheckoutForm';

/* ── Types ─────────────────────────────────────────────────── */
export interface CartItem {
  variant: ProductVariant;
  productName: string;
  quantity: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (variant: ProductVariant, productName: string) => void;
  cart: CartItem[];
}

/* ── ProductCard Component ───────────────────────────────────── */
function ProductCard({ product, onAddToCart, cart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const color = bottleColors[product.slug] ?? '#C8A25C';

  const isInCart = cart.some(item => item.variant.id === selectedVariant.id);

  return (
    <article className="glass-card fade-up" style={{ padding: '24px 28px', display: 'flex', gap: 24, alignItems: 'center' }}>
      {/* Bottle illustration */}
      <div style={{ flexShrink: 0 }}>
        <PerfumeBottle color={color} />
      </div>
      
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700, color: '#F2EDE2' }}>{product.name}</h2>
          <span style={{ fontSize: '0.7rem', color: '#C8A25C', fontWeight: 600, background: 'rgba(200,162,92,0.1)', padding: '2px 8px', borderRadius: 20 }}>
            {product.category?.name}
          </span>
        </div>
        
        <div className="gold-divider" />
        <p style={{ margin: '8px 0 12px', fontSize: '0.8rem', color: '#C8BEA8', lineHeight: 1.6 }}>{product.description}</p>
        
        {/* Variant Toggles */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              style={{
                padding: '4px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedVariant.id === v.id ? '#C8A25C' : 'rgba(200,162,92,0.2)',
                background: selectedVariant.id === v.id ? '#C8A25C' : 'transparent',
                color: selectedVariant.id === v.id ? '#1A1A1D' : '#C8BEA8',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
            >
              {v.size}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#C8A25C', transition: 'all 0.2s' }}>
              {selectedVariant.price}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#9B7A3D', fontWeight: 500 }}>MAD</span>
          </div>
          
          <button 
            onClick={() => onAddToCart(selectedVariant, product.name)}
            disabled={isInCart}
            className={isInCart ? "btn-secondary" : "btn-gold-sm"}
            style={{ padding: '8px 16px', fontSize: '0.75rem', height: 'auto' }}
          >
            {isInCart ? 'Dans le panier' : 'Ajouter +'}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ── Storefront Main Component ───────────────────────────────── */
export default function Storefront({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (variant: ProductVariant, productName: string) => {
    setCart(prev => {
      const exists = prev.find(item => item.variant.id === variant.id);
      if (exists) return prev;
      return [...prev, { variant, productName, quantity: 1 }];
    });
  };

  const updateQty = (variantId: number, qty: number) => {
    setCart(prev => {
      if (qty <= 0) return prev.filter(item => item.variant.id !== variantId);
      return prev.map(item => item.variant.id === variantId ? { ...item, quantity: qty } : item);
    });
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
      gap: 32,
      alignItems: 'start',
    }}>
      {/* ── LEFT — Cinematic product display ─────────── */}
      <section aria-label="Nos parfums">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {products.length === 0 && (
            <div className="glass-card fade-up" style={{ padding: 32, textAlign: 'center' }}>
              <p style={{ color: '#6B6654', fontSize: '0.875rem' }}>Produits indisponibles — veuillez relancer le serveur Laravel.</p>
            </div>
          )}
          {products.map((p) => (
            <ProductCard key={p.id} product={p} cart={cart} onAddToCart={handleAddToCart} />
          ))}
        </div>

        {/* Trust pillars */}
        <div className="fade-up" style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: 'M5 13l4 4L19 7', label: '100% Authentique' },
            { icon: 'M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9', label: 'Livraison au Maroc' },
            { icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z', label: 'Paiement COD' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ textAlign: 'center', padding: '14px 8px', borderRadius: 12, background: 'rgba(200,162,92,0.04)', border: '1px solid rgba(200,162,92,0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8A25C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 6px' }}>
                <path d={icon} />
              </svg>
              <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 600, color: '#C8BEA8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RIGHT — Checkout form ─────────────────────── */}
      <section aria-label="Passer votre commande">
        <div className="glass-card fade-up" style={{ padding: '32px 28px', animationDelay: '0.15s' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 700, color: '#F2EDE2' }}>Passer votre commande</h2>
            <div className="gold-divider" />
            <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#C8BEA8', lineHeight: 1.6 }}>
              Sélectionnez vos parfums, renseignez vos coordonnées et confirmez. Paiement à la livraison.
            </p>
          </div>
          <CheckoutForm cart={cart} updateQty={updateQty} onOrderSuccess={() => setCart([])} />
        </div>
      </section>
    </div>
  );
}
