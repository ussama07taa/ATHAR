'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import useCartStore from '@/store/cartStore';

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === 'light';

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => { setMounted(true); }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
            }}
          />

          {/* Drawer Panel */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: 420,
              zIndex: 101,
              background: isLight
                ? 'linear-gradient(160deg, rgba(255,255,255,0.99) 0%, rgba(245,242,236,0.99) 100%)'
                : 'linear-gradient(160deg, rgba(26,26,29,0.98) 0%, rgba(13,13,15,0.99) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderLeft: `1px solid ${isLight ? 'rgba(200,162,92,0.3)' : 'rgba(200,162,92,0.2)'}`,
              display: 'flex',
              flexDirection: 'column',
              transition: 'background 300ms ease',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 24px 20px',
                borderBottom: '1px solid rgba(200,162,92,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: isLight ? '#111827' : '#F2EDE2',
                    letterSpacing: '0.05em',
                    transition: 'color 300ms ease',
                  }}
                >
                  Votre Panier
                </h2>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#9B7A3D', marginTop: 2 }}>
                  {totalItems} article{totalItems !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={closeCart}
                aria-label="Fermer le panier"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'transparent',
                  border: '1px solid rgba(200,162,92,0.2)',
                  color: '#C8BEA8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200,162,92,0.5)';
                  e.currentTarget.style.color = '#C8A25C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200,162,92,0.2)';
                  e.currentTarget.style.color = '#C8BEA8';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.length === 0 ? (
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    color: '#6B6654',
                    padding: '48px 0',
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(200,162,92,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>Votre panier est vide</p>
                  <button
                    onClick={closeCart}
                    style={{
                      fontSize: '0.75rem',
                      color: '#C8A25C',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Découvrir la collection →
                  </button>
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.div
                    key={item.variantId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: isLight ? 'rgba(200,162,92,0.06)' : 'rgba(200,162,92,0.05)',
                      border: `1px solid ${isLight ? 'rgba(200,162,92,0.2)' : 'rgba(200,162,92,0.15)'}`,
                      borderRadius: 14,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'background 300ms ease',
                    }}
                  >
                    {/* Product Image / Bottle indicator */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'rgba(200,162,92,0.1)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '1px solid rgba(200,162,92,0.2)',
                      }}
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 54 90" fill="none">
                          <rect x="18" y="0" width="18" height="10" rx="3" fill="#C8A25C" opacity={0.7} />
                          <rect x="22" y="10" width="10" height="8" fill="#C8A25C" opacity={0.5} />
                          <rect x="8" y="18" width="38" height="60" rx="10" stroke="#C8A25C" strokeWidth="4" />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: isLight ? '#111827' : '#F2EDE2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 300ms ease' }}>
                        {item.productName}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#9B7A3D', marginTop: 2 }}>
                        {item.variantName} — {item.price.toFixed(2)} MAD
                      </p>
                    </div>

                    {/* Qty Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: '1px solid rgba(200,162,92,0.3)',
                          background: 'transparent',
                          color: '#C8A25C',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 200ms',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,162,92,0.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        −
                      </button>
                      <span style={{ minWidth: 20, textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: isLight ? '#111827' : '#F2EDE2' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: '1px solid rgba(200,162,92,0.3)',
                          background: 'transparent',
                          color: '#C8A25C',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 200ms',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,162,92,0.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        aria-label="Supprimer"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: 'transparent',
                          border: '1px solid rgba(229,115,115,0.25)',
                          color: '#E57373',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 200ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(229,115,115,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Actions */}
            {items.length > 0 && (
              <div
                style={{
                  padding: '20px 24px 28px',
                  borderTop: '1px solid rgba(200,162,92,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Total */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(200,162,92,0.07)',
                    border: '1px solid rgba(200,162,92,0.15)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#C8BEA8' }}>Total</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#C8A25C' }}>
                    {totalPrice.toFixed(2)} MAD
                  </span>
                </div>

                {/* COD Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B7A3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />
                  </svg>
                  <span style={{ fontSize: '0.65rem', color: '#9B7A3D', letterSpacing: '0.05em' }}>
                    Paiement à la livraison — aucune carte requise
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link href="/checkout" onClick={closeCart} style={{ textDecoration: 'none' }}>
                  <button className="btn-gold" style={{ width: '100%' }}>
                    Commander maintenant
                  </button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
