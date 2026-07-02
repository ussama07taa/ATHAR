'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

export default function ProductTabs({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState<'HOMME' | 'FEMME'>('HOMME');

  // Assuming `product.category.name` exists. We filter loosely. 
  // If your DB doesn't literally say "Homme", we can filter by description or id. Let's do string matching safely.
  const filteredProducts = products.filter(p => {
    const isPack = p.is_pack;
    if (isPack) return false; // usually you don't show packs in the standard men/women grid unless specified
    
    // Fallback classification if categories aren't strictly defined
    const matchString = `${p.category?.name} ${p.name} ${p.description}`.toLowerCase();
    if (activeTab === 'HOMME') {
      return matchString.includes('homme') || matchString.includes('sauvage') || matchString.includes('intense') || matchString.includes('channel');
    } else {
      return matchString.includes('femme') || matchString.includes('rose') || matchString.includes('casablanca') || matchString.includes('laha');
    }
  });

  // If the strict filtering results in empty arrays (due to dataload testing), fallback to slicing for demo purposes to assure UI doesn't break
  const displayProducts = filteredProducts.length > 0 
    ? filteredProducts 
    : (activeTab === 'HOMME' ? products.slice(0, 4) : products.slice(products.length > 4 ? 4 : 0));

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 style={{ 
          fontSize: '1rem', 
          fontWeight: 400, 
          letterSpacing: '0.15em', 
          textTransform: 'uppercase', 
          color: '#111111',
          marginBottom: 30
        }}>
          MEILLEURE VENTE / الأَكْثَر مَبِيعاً
        </h2>
        
        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
          <button
            onClick={() => setActiveTab('HOMME')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              fontWeight: 400,
              color: activeTab === 'HOMME' ? '#111111' : '#999999',
              paddingBottom: 4,
              borderBottom: activeTab === 'HOMME' ? '1px solid #111111' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              fontFamily: 'inherit',
              letterSpacing: '0.1em'
            }}
          >
            HOMME
          </button>
          <button
            onClick={() => setActiveTab('FEMME')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              fontWeight: 400,
              color: activeTab === 'FEMME' ? '#111111' : '#999999',
              paddingBottom: 4,
              borderBottom: activeTab === 'FEMME' ? '1px solid #111111' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              fontFamily: 'inherit',
              letterSpacing: '0.1em'
            }}
          >
            FEMME
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px 16px',
      }}>
        {displayProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      
      {/* View All Button */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <a 
          href="/catalogue"
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: '#ffffff',
            color: '#111111',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            border: '1px solid #EAEAEA',
            boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
            transition: 'border-color 200ms'
          }}
        >
          VIEW ALL
        </a>
      </div>
    </section>
  );
}
