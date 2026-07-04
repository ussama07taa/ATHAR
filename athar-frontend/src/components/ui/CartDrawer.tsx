'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import useCartStore from '@/store/cartStore';
import Image from 'next/image';

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

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
              background: isLight ? '#FFFFFF' : '#0D0D0F',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderLeft: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 300ms ease',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 24px 20px',
                borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
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
                  }}
                >
                  Votre Panier
                </h2>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#CA8A04', marginTop: 2, fontWeight: 600 }}>
                  {totalItems} article{totalItems !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={closeCart}
                aria-label="Fermer le panier"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'transparent',
                  border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
                  color: isLight ? '#44403C' : '#A8A29E',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CA8A04';
                  e.currentTarget.style.color = '#CA8A04';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = isLight ? '#44403C' : '#A8A29E';
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
                    color: isLight ? '#44403C' : '#A8A29E',
                    padding: '48px 0',
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(202,138,4,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>Votre panier est vide</p>
                  <button
                    onClick={closeCart}
                    style={{
                      fontSize: '0.75rem',
                      color: '#CA8A04',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Découvrir la collection →
                  </button>
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.div
                    key={item.cartId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: isLight ? '#FAFAFA' : '#1C1917',
                      border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 16,
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      transition: 'all 300ms ease',
                    }}
                  >
                    {/* Top Row: Image + Name + Delete */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      {/* Product Image */}
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 10,
                          background: isLight ? '#FFFFFF' : '#0D0D0F',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                          position: 'relative'
                        }}
                      >
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.productName} fill sizes="60px" style={{ objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: isLight ? '#F5F5F4' : '#1C1917' }} />
                        )}
                      </div>

                      {/* Name + Size */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: 0,
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: isLight ? '#111827' : '#F2EDE2',
                          lineHeight: 1.3,
                          letterSpacing: '0.01em',
                          wordBreak: 'break-word',
                        }}>
                          {item.productName}
                        </p>
                        <p style={{ margin: '5px 0 0', fontSize: '0.72rem', color: '#CA8A04', fontWeight: 600 }}>
                          {item.variantName}
                        </p>

                        {/* Bundle Contents */}
                        {item.bundleContents && item.bundleContents.length > 0 && (
                          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {item.bundleContents.map((p, idx) => (
                              <div key={idx} style={{ fontSize: '0.65rem', color: isLight ? '#666' : '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ color: '#CA8A04' }}>•</span> {p.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => removeItem(item.cartId)}
                        aria-label="Supprimer"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.05)',
                          border: '1px solid rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 200ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>

                    {/* Bottom Row: Price + Qty Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: isLight ? '#111827' : '#F2EDE2' }}>
                        {(item.price * item.quantity).toFixed(2)} <span style={{ fontSize: '0.7rem', color: isLight ? '#78716C' : '#A8A29E', fontWeight: 500 }}>dh</span>
                      </span>

                      {/* Qty Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '24px', padding: '2px 4px' }}>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', color: isLight ? '#111827' : '#F2EDE2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', transition: 'all 200ms' }}
                        >
                          −
                        </button>
                        <span style={{ minWidth: 28, textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', color: isLight ? '#111827' : '#F2EDE2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', transition: 'all 200ms' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Actions */}
            {items.length > 0 && (
              <div
                style={{
                  padding: '24px 24px 32px',
                  borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  background: isLight ? '#FAFAFA' : '#1C1917',
                }}
              >
                {/* Total */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: isLight ? '#44403C' : '#A8A29E', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Sous-total</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#CA8A04' }}>
                    {totalPrice.toFixed(2)} dh
                  </span>
                </div>

                {/* COD Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(202, 138, 4, 0.05)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(202, 138, 4, 0.1)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />
                  </svg>
                  <span style={{ fontSize: '0.65rem', color: '#A16207', letterSpacing: '0.05em', fontWeight: 600, textTransform: 'uppercase' }}>
                    Paiement à la livraison
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link href="/checkout" onClick={closeCart} style={{ textDecoration: 'none' }}>
                  <button 
                    style={{ 
                      width: '100%',
                      background: '#CA8A04',
                      color: '#fff',
                      border: 'none',
                      padding: '16px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 300ms ease',
                      boxShadow: '0 10px 20px rgba(202, 138, 4, 0.2)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#A16207';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#CA8A04';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Confirmer la commande
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
