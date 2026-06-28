'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product';
import Image from 'next/image';
import useCartStore from '@/store/cartStore';
import { Plus, Check, ShoppingBag, Info, X } from 'lucide-react';

interface BoxBuilderProps {
  product: Product;
}

export default function BoxBuilder({ product }: BoxBuilderProps) {
  const [selectedItems, setSelectedItems] = useState<Product[]>(
    !product.is_custom_pack ? (product.bundle_products || []) : []
  );
  const [quantity, setQuantity] = useState(1);
  
  // Use admin-configured pack_slots for custom packs, or fallback to 3. For fixed, use items length.
  const slotCount = !product.is_custom_pack ? selectedItems.length : (product.pack_slots || 3);
  
  const addItem = useCartStore((s) => s.addItem);
  
  const isFull = selectedItems.length >= slotCount;

  const handleToggleProduct = (p: Product) => {
    if (!product.is_custom_pack) return;
    if (selectedItems.find((item) => item.id === p.id)) {
      setSelectedItems(selectedItems.filter((item) => item.id !== p.id));
    } else if (!isFull) {
      setSelectedItems([...selectedItems, p]);
    }
  };

  const handleAddToCart = () => {
    if (!isFull) return;
    addItem({
      variantId: product.variants[0].id,
      sku: product.variants[0].sku,
      productName: product.name,
      variantName: product.variants[0].size,
      price: parseFloat(product.variants[0].price),
      slug: product.slug,
      imageUrl: product.image_url,
      quantity,
      bundleContents: selectedItems.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand
      }))
    } as any);
  };

  const handleBuyNow = () => {
    if (!isFull) return;
    addItem({
      variantId: product.variants[0].id,
      sku: product.variants[0].sku,
      productName: product.name,
      variantName: product.variants[0].size,
      price: parseFloat(product.variants[0].price),
      slug: product.slug,
      imageUrl: product.image_url,
      quantity,
      bundleContents: selectedItems.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand
      }))
    } as any);
    window.location.href = '/checkout';
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
      <style>{`
        .bb-layout {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        @media (min-width: 900px) {
          .bb-layout {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 60px;
            align-items: start;
          }
        }
        .bb-sticky {
          position: static;
        }
        @media (min-width: 900px) {
          .bb-sticky {
            position: sticky;
            top: 120px;
          }
        }
        .bb-slot-grid {
          display: grid;
          gap: 12px;
        }
        .bb-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px) {
          .bb-product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .hover-zoom:hover { transform: scale(1.05); }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>
          {product.name}
        </h1>
        {product.is_custom_pack ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
            {[
              { n: 1, label: 'Choisir', active: selectedItems.length === 0 },
              { n: 2, label: 'Remplir', active: selectedItems.length > 0 && !isFull },
              { n: 3, label: 'Commander', active: isFull },
            ].map((step, i, arr) => (
              <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: step.active ? 1 : 0.4 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: step.active ? '#CA8A04' : '#DDD', color: '#FFF', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{step.n}</div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{step.label}</span>
                </div>
                {i < arr.length - 1 && <div style={{ width: 30, height: 1, background: '#DDD' }} />}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', fontSize: '1rem', marginTop: 12 }}>
            Un pack exclusif pré-rempli par nos experts parfumeurs.
          </p>
        )}
      </div>

      <div className="bb-layout">
        {/* LEFT: VISUAL BOX */}
        <div className="bb-sticky">
          <div style={{ background: '#F9F8F6', borderRadius: 24, padding: 'clamp(20px, 4vw, 40px)', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666' }}>
                {product.is_custom_pack ? `Ma Sélection (${selectedItems.length}/${slotCount})` : 'Contenu du Pack Decante'}
              </span>
              {isFull && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 700 }}>
                  {product.is_custom_pack ? 'VOTRE PACK EST PRÊT ✨' : 'PRÊT À L\'EXPÉDITION 🚚'}
                </motion.span>
              )}
            </div>

            {/* Slots */}
            <div className="bb-slot-grid" style={{ gridTemplateColumns: `repeat(${Math.min(slotCount, 4)}, 1fr)` }}>
              {[...Array(slotCount)].map((_, i) => {
                const item = selectedItems[i];
                return (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: 16,
                      border: item ? '2px solid #CA8A04' : '2px dashed #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      background: item ? '#FFF' : 'transparent',
                      transition: 'all 300ms ease'
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {item ? (
                        <motion.div
                          key={item.id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          style={{ width: '100%', height: '100%', position: 'relative' }}
                        >
                          <Image src={item.image_url} alt={item.name} fill style={{ objectFit: 'cover' }} />
                          {product.is_custom_pack && (
                            <button
                              onClick={() => handleToggleProduct(item)}
                              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.8)', color: '#FFF', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Retirer"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </motion.div>
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '1.2rem', color: '#D1D5DB', fontWeight: 700 }}>{i + 1}</span>
                          <span style={{ fontSize: '0.55rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600 }}>Vide</span>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Info box */}
            <div style={{ marginTop: 24, padding: '14px', background: 'rgba(202, 138, 4, 0.05)', borderRadius: 14, border: '1px solid rgba(202, 138, 4, 0.1)' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <Info size={14} style={{ color: '#CA8A04', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.7rem', color: '#854D0E', lineHeight: 1.5, margin: 0 }}>
                  {product.is_custom_pack
                    ? `Sélectionnez ${slotCount} parfums parmi la collection ci-dessous pour composer votre pack sur mesure.`
                    : 'Ce pack contient une sélection exclusive de nos meilleures fragrances, soigneusement choisies pour une expérience olfactive complète.'}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 14, border: '1px solid rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quantité</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', color: '#111', fontSize: '1.2rem' }}
                >
                  −
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', color: '#111', fontSize: '1.2rem' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={isFull ? { scale: 1.02 } : {}}
              whileTap={isFull ? { scale: 0.98 } : {}}
              onClick={handleAddToCart}
              disabled={!isFull}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '18px',
                borderRadius: 16,
                background: isFull ? '#111' : '#F3F4F6',
                color: isFull ? '#FFF' : '#9CA3AF',
                fontWeight: 700,
                border: 'none',
                cursor: isFull ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'all 300ms ease',
                fontSize: '0.85rem',
                letterSpacing: '0.05em'
              }}
            >
              <ShoppingBag size={18} />
              {product.is_custom_pack
                ? (isFull ? 'CONFIRMER ET AJOUTER' : `REMPLISSEZ LES SLOTS (${selectedItems.length}/${slotCount})`)
                : 'AJOUTER LE PACK AU PANIER'}
            </motion.button>

            {/* Quick Buy CTA */}
            <motion.button
              whileHover={isFull ? { scale: 1.02 } : {}}
              whileTap={isFull ? { scale: 0.98 } : {}}
              onClick={handleBuyNow}
              disabled={!isFull}
              style={{
                width: '100%',
                marginTop: 12,
                padding: '18px',
                borderRadius: 16,
                background: isFull ? 'linear-gradient(135deg, #CA8A04 0%, #A16207 100%)' : '#F3F4F6',
                color: isFull ? '#FFF' : '#9CA3AF',
                fontWeight: 700,
                border: 'none',
                cursor: isFull ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'all 300ms ease',
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                boxShadow: isFull ? '0 10px 30px rgba(202,138,4,0.25)' : 'none'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {product.is_custom_pack
                ? (isFull ? 'COMMANDER MAINTENANT' : 'COMMANDER MAINTENANT')
                : 'COMMANDER MAINTENANT'}
            </motion.button>
          </div>
        </div>

        {/* RIGHT: PRODUCT LIST */}
        <div>
          <div style={{ marginBottom: 24, paddingBottom: 14, borderBottom: '1px solid #EEE' }}>
            <h2 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 700 }}>
              {product.is_custom_pack ? 'Collection de Découverte' : 'Composition du Pack Decante'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: 4 }}>
              {product.is_custom_pack
                ? `Choisissez ${slotCount} fragrances pour composer votre pack.`
                : 'Découvrez le détail des parfums présents dans ce pack exclusif.'}
            </p>
          </div>

          <div className="bb-product-grid">
            {(product.is_custom_pack ? product.bundle_products : selectedItems)?.map((p) => {
              const isSelected = selectedItems.find(item => item.id === p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => product.is_custom_pack && handleToggleProduct(p)}
                  style={{
                    padding: 12,
                    borderRadius: 16,
                    border: `1px solid ${isSelected ? '#CA8A04' : 'rgba(0,0,0,0.07)'}`,
                    background: isSelected ? '#FFFBEB' : '#FFF',
                    cursor: product.is_custom_pack ? 'pointer' : 'default',
                    transition: 'all 300ms ease'
                  }}
                >
                  <div style={{ aspectRatio: '1/1', position: 'relative', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                    <Image src={p.image_url} alt={p.name} fill style={{ objectFit: 'cover' }} className="hover-zoom" />
                    {product.is_custom_pack && (
                      <div style={{ position: 'absolute', top: 6, right: 6 }}>
                        {isSelected ? (
                          <div style={{ background: '#CA8A04', padding: 4, borderRadius: '50%', color: '#FFF' }}><Check size={12} /></div>
                        ) : (
                          <div style={{ background: 'rgba(255,255,255,0.9)', padding: 4, borderRadius: '50%' }}><Plus size={12} /></div>
                        )}
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 2 }}>{p.name}</h3>
                  <p style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', margin: 0 }}>{p.brand}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
