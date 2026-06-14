'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import useCartStore from '@/store/cartStore';
import { Product, ProductVariant, bottleColors } from '@/app/page';

interface Props {
  product: Product;
}

/* ── Stagger animation helpers ───────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function ProductDetail({ product }: Props) {
  const [selected, setSelected] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === 'light';

  /* ── Image & Gallery state ─────────────────────── */
  const allImages = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean) as string[];
  const [currentImage, setCurrentImage] = useState(allImages[0] || '');
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setMounted(true);
    if (allImages.length > 0) setCurrentImage(allImages[0]);
  }, [product.image_url, product.gallery_urls]);

  const color = bottleColors[product.slug] ?? '#C8A25C';
  const inCart = items.some((i) => i.variantId === selected.id);
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
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 800);
  };

  /* ── Mouse tracking for parallax lens ──────────── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      style={{
        maxWidth: 1140,
        margin: '0 auto',
        padding: '48px 24px 100px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        gap: 56,
        alignItems: 'start',
      }}
    >
      {/* ── LEFT: Cinematic Product Image ─────────────────── */}
      <motion.div variants={fadeUp} className="product-image-container">
        <div
          ref={imgRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          style={{
            background: isLight
              ? `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, ${color}20 0%, rgba(255,255,255,0) 60%), linear-gradient(135deg, rgba(200,162,92,0.04) 0%, rgba(255,255,255,0.97) 100%)`
              : `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, ${color}20 0%, rgba(13,13,15,0) 60%), linear-gradient(135deg, rgba(200,162,92,0.04) 0%, rgba(26,26,29,0.92) 100%)`,
            border: `1px solid ${isLight ? 'rgba(200,162,92,0.2)' : `${color}33`}`,
            borderRadius: 28,
            padding: product.image_url ? 0 : 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 420,
            overflow: 'hidden',
            cursor: product.image_url ? 'zoom-in' : 'default',
            backdropFilter: 'blur(20px)',
            transition: 'border-color 300ms ease, box-shadow 300ms ease',
            boxShadow: zoomed
              ? `0 24px 80px rgba(0,0,0,${isLight ? '0.12' : '0.5'}), 0 0 60px ${color}15`
              : `0 12px 40px rgba(0,0,0,${isLight ? '0.06' : '0.35'})`,
            position: 'relative',
          }}
        >
          {/* Ambient glow that follows mouse */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle 200px at ${mousePos.x}% ${mousePos.y}%, ${color}18, transparent)`,
              pointerEvents: 'none',
              transition: 'opacity 300ms',
              opacity: zoomed ? 1 : 0,
              zIndex: 1,
            }}
          />

          {currentImage ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={product.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: zoomed ? 1.12 : 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  minHeight: 420,
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  position: 'relative',
                  zIndex: 2,
                }}
              />
            </AnimatePresence>
          ) : (
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <svg width="120" height="200" viewBox="0 0 54 90" fill="none" aria-label={`Flacon ${product.name}`}>
                <rect x="18" y="0" width="18" height="10" rx="3" fill={color} opacity={0.85} />
                <rect x="22" y="10" width="10" height="8" fill={color} opacity={0.6} />
                <rect x="8" y="18" width="38" height="60" rx="10" fill={color} opacity={0.18} />
                <rect x="8" y="18" width="38" height="60" rx="10" stroke={color} strokeWidth="1.5" />
                <rect x="14" y="24" width="6" height="28" rx="3" fill="white" opacity={0.14} />
                <rect x="8" y="48" width="38" height="18" rx="0" fill={color} opacity={0.14} />
              </svg>
            </motion.div>
          )}
        </div>

        {/* ── Gallery Thumbnails ─────────────────────────── */}
        {allImages.length > 1 && (
          <motion.div
            variants={fadeUp}
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 20,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {allImages.map((img, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentImage(img)}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  overflow: 'hidden',
                  padding: 0,
                  border: `2px solid ${currentImage === img ? '#C8A25C' : 'transparent'}`,
                  background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,29,0.8)',
                  cursor: 'pointer',
                  transition: 'border-color 200ms',
                  boxShadow: currentImage === img ? '0 4px 12px rgba(200,162,92,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: currentImage === img ? 1 : 0.6 }}
                />
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* SKU / Category under image */}
        <motion.div
          variants={fadeUp}
          style={{
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B7A3D', fontWeight: 600 }}>
            {product.category?.name}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: isLight ? '#9CA3AF' : '#6B6654', fontWeight: 400, transition: 'color 300ms ease' }}>
            SKU: {selected.sku}
          </p>
        </motion.div>
      </motion.div>

      {/* ── RIGHT: Product Info ────────────────────────────── */}
      <motion.div
        variants={stagger}
        style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
      >
        {/* Breadcrumb */}
        <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', color: isLight ? '#6B7280' : '#6B6654' }}>
          <Link href="/" style={{ color: '#C8A25C', textDecoration: 'none', transition: 'opacity 200ms' }}>Collection</Link>
          <span>›</span>
          <span style={{ color: isLight ? '#374151' : '#C8BEA8', transition: 'color 300ms ease' }}>{product.name}</span>
        </motion.div>

        {/* Brand + Name */}
        <motion.div variants={fadeUp}>
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              color: '#C8A25C',
              background: 'rgba(200,162,92,0.1)',
              border: '1px solid rgba(200,162,92,0.2)',
              borderRadius: 20,
              padding: '4px 14px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'inline-block',
            }}
          >
            Athar — {product.category?.name}
          </span>

          <h1
            style={{
              margin: '16px 0 0',
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              fontWeight: 800,
              color: isLight ? '#111827' : '#F2EDE2',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              transition: 'color 300ms ease',
            }}
          >
            {product.name}
          </h1>

          {/* Animated gold divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 56 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ height: 2, background: `linear-gradient(90deg, ${color}, transparent)`, margin: '18px 0', borderRadius: 1 }}
          />

          <p style={{ margin: 0, fontSize: '0.9rem', color: isLight ? '#374151' : '#C8BEA8', lineHeight: 1.8, transition: 'color 300ms ease' }}>
            {product.description}
          </p>
        </motion.div>

        {/* Variant Pills */}
        <motion.div variants={fadeUp}>
          <p style={{ margin: '0 0 12px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9B7A3D' }}>
            Contenance
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {product.variants.map((v) => {
              const isSel = selected.id === v.id;
              const noStock = v.stock <= 0;
              return (
                <motion.button
                  key={v.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelected(v); setQuantity(1); }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 12,
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    border: '1px solid',
                    borderColor: isSel ? '#C8A25C' : 'rgba(200,162,92,0.22)',
                    background: isSel
                      ? 'linear-gradient(135deg, #C8A25C 0%, #9B7A3D 100%)'
                      : (isLight ? 'rgba(200,162,92,0.06)' : 'rgba(200,162,92,0.05)'),
                    color: isSel ? '#0D0D0F' : (isLight ? '#6B4F1F' : '#C8BEA8'),
                    cursor: noStock ? 'not-allowed' : 'pointer',
                    opacity: noStock ? 0.45 : 1,
                    transition: 'all 250ms cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: isSel ? '0 6px 24px rgba(200,162,92,0.35)' : 'none',
                  }}
                >
                  {v.size}{noStock ? ' — épuisé' : ''}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Price block */}
        <motion.div
          variants={fadeUp}
          style={{
            background: isLight ? 'rgba(200,162,92,0.04)' : 'rgba(200,162,92,0.04)',
            border: `1px solid ${isLight ? 'rgba(200,162,92,0.18)' : 'rgba(200,162,92,0.12)'}`,
            borderRadius: 18,
            padding: '22px 26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background 300ms ease, border-color 300ms ease',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: '0.6rem', color: isLight ? '#9CA3AF' : '#6B6654', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'color 300ms ease' }}>
              Prix
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={selected.price}
                initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ margin: '6px 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#C8A25C', lineHeight: 1 }}
              >
                {selected.price}
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#9B7A3D', marginLeft: 6 }}>MAD</span>
              </motion.p>
            </AnimatePresence>
            <Link href="/shipping-policy" style={{ fontSize: '0.65rem', color: '#9B7A3D', textDecoration: 'underline', marginTop: 8, display: 'block' }}>
              Frais d'expédition calculés à l'étape de paiement.
            </Link>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.6rem', color: '#6B6654', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Livraison
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#5A9A6C', fontWeight: 600 }}>
              Gratuite dès 500 MAD
            </p>
          </div>
        </motion.div>

        {/* Quantity Selector */}
        <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9B7A3D' }}>
            Quantité
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: isLight ? 'rgba(200,162,92,0.06)' : 'rgba(200,162,92,0.05)',
                border: `1px solid ${isLight ? 'rgba(200,162,92,0.22)' : 'rgba(200,162,92,0.15)'}`,
                borderRadius: 12,
                padding: '4px',
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: 'none',
                  background: 'transparent',
                  color: '#C8A25C',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 200ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,162,92,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                −
              </button>
              <span style={{ width: 40, textAlign: 'center', fontSize: '0.95rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: 'none',
                  background: 'transparent',
                  color: '#C8A25C',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 200ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,162,92,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                +
              </button>
            </div>
          </div>
        </motion.div>

        {/* Add to Cart CTA */}
        <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={!inCart ? { scale: 1.02, boxShadow: '0 12px 40px rgba(200,162,92,0.4)' } : {}}
            onClick={handleAdd}
            disabled={inCart || outOfStock}
            className="btn-gold"
            style={{
              background: outOfStock
                ? 'rgba(150,150,150,0.15)'
                : inCart
                ? (isLight ? 'rgba(200,162,92,0.1)' : 'rgba(200,162,92,0.1)')
                : added
                ? 'linear-gradient(135deg, #5A8A5C, #3D7A3F)'
                : undefined,
              color: outOfStock ? '#888' : inCart ? '#9B7A3D' : '#0D0D0F',
              border: inCart ? '1px solid rgba(200,162,92,0.2)' : 'none',
              cursor: inCart || outOfStock ? 'default' : 'pointer',
              fontSize: '0.88rem',
              padding: '16px 28px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderRadius: 14,
              transition: 'all 300ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {outOfStock
              ? 'Rupture de stock'
              : inCart
              ? '✓ Déjà dans votre panier'
              : added
              ? '✓ Ajouté — Ouverture du panier...'
              : `Ajouter au panier — ${selected.size}`}
          </motion.button>

          {/* COD badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.7 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9B7A3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />
            </svg>
            <span style={{ fontSize: '0.68rem', color: isLight ? '#6B7280' : '#6B6654', transition: 'color 300ms ease' }}>
              Paiement à la livraison — aucune carte bancaire requise
            </span>
          </div>
        </motion.div>

        {/* Ingredients note */}
        <motion.div
          variants={fadeUp}
          style={{
            borderTop: `1px solid ${isLight ? 'rgba(200,162,92,0.12)' : 'rgba(200,162,92,0.08)'}`,
            paddingTop: 24,
            fontSize: '0.75rem',
            color: isLight ? '#6B7280' : '#6B6654',
            lineHeight: 1.75,
            transition: 'color 300ms ease',
          }}
        >
          <p style={{ margin: 0 }}>
            Fabriqué artisanalement à Tanger. Ingrédients naturels sélectionnés. Flacon en verre recyclable.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
