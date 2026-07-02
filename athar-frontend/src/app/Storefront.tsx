'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/types/product';
import CheckoutForm from './CheckoutForm';

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

function StoreProductCard({ product, onAddToCart, cart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const isInCart = cart.some(item => item.variant.id === selectedVariant.id);
  const mainImage = product.image_url;

  return (
    <article style={{ 
      display: 'flex', 
      gap: 24, 
      alignItems: 'center', 
      padding: '24px', 
      background: '#FFFFFF',
      border: '1px solid #EAEAEA',
      marginBottom: 16
    }}>
      <div style={{ flexShrink: 0, width: 80, height: 100, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {mainImage ? (
           <img src={mainImage} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
        ) : (
           <div style={{ width: 40, height: 60, background: '#EAEAEA' }} />
        )}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 500, color: '#111111', textTransform: 'uppercase' }}>{product.name}</h2>
        <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#666666' }}>{product.category?.name}</p>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                border: '1px solid',
                borderColor: selectedVariant.id === v.id ? '#111111' : '#EAEAEA',
                background: selectedVariant.id === v.id ? '#111111' : '#FFFFFF',
                color: selectedVariant.id === v.id ? '#FFFFFF' : '#111111',
                cursor: 'pointer'
              }}
            >
              {v.size}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#111111' }}>
            {selectedVariant.price} <span style={{ fontSize: '0.75rem' }}>MAD</span>
          </div>
          
          <button 
            onClick={() => onAddToCart(selectedVariant, product.name)}
            disabled={isInCart}
            style={{ 
              padding: '10px 16px', 
              fontSize: '0.75rem', 
              background: isInCart ? '#F5F5F5' : '#111111',
              color: isInCart ? '#999999' : '#FFFFFF',
              border: 'none',
              cursor: isInCart ? 'default' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {isInCart ? 'Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </article>
  );
}

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
      maxWidth: 1200,
      margin: '0 auto',
      padding: '40px 24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
      gap: 40,
      alignItems: 'start',
      background: '#F8F8F8',
      minHeight: '100vh',
    }}>
      <section>
        {products.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', background: '#FFFFFF', border: '1px solid #EAEAEA' }}>
            <p style={{ color: '#666666', fontSize: '0.9rem' }}>Aucun produit disponible.</p>
          </div>
        )}
        {products.map((p) => (
          <StoreProductCard key={p.id} product={p} cart={cart} onAddToCart={handleAddToCart} />
        ))}
      </section>

      <section>
        <div style={{ padding: '32px', background: '#FFFFFF', border: '1px solid #EAEAEA' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '1.25rem', fontWeight: 500, color: '#111111', textTransform: 'uppercase' }}>
            Finaliser la commande
          </h2>
          <CheckoutForm cart={cart} updateQty={updateQty} onOrderSuccess={() => setCart([])} />
        </div>
      </section>
    </div>
  );
}
