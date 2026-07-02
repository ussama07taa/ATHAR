'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import useCartStore from '@/store/cartStore';
import { Product, ProductVariant } from '@/types/product';
import { bottleColors, PerfumeBottle } from '@/lib/productUtils';


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<ProductVariant>(product.variants[0]);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isHovered, setIsHovered] = useState(false);
  const color = bottleColors[product.slug] ?? '#C8A25C';
  const inCart = items.some((i) => i.variantId === selected.id);

  const mainImage = product.image_url;
  const hoverImage = product.gallery_urls?.[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      variantId: selected.id,
      sku: selected.sku,
      productName: product.name,
      variantName: selected.size,
      price: parseFloat(selected.price),
      slug: product.slug,
      imageUrl: product.image_url,
    } as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleVariantClick = (e: React.MouseEvent, v: ProductVariant) => {
    e.stopPropagation();
    setSelected(v);
  };

  return (
    <motion.article
      onClick={() => router.push(`/products/${product.slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(200,162,92,0.07) 0%, rgba(255,255,255,0.95) 60%, rgba(250,250,250,0.98) 100%)'
          : 'linear-gradient(135deg, rgba(200,162,92,0.07) 0%, rgba(26,26,29,0.9) 60%, rgba(13,13,15,0.97) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${isLight ? 'rgba(200,162,92,0.25)' : 'rgba(200,162,92,0.2)'}`,
        borderRadius: 24,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        height: '100%',
        minHeight: '480px',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        boxShadow: isLight ? '0 8px 32px rgba(0,0,0,0.08)' : '0 8px 32px rgba(0,0,0,0.45)',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        borderColor: 'rgba(200,162,92,0.5)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)',
        y: -5,
      }}
    >
      {/* Dynamic Badge */}
      {product.badge_label && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          background: product.badge_color || 'linear-gradient(135deg, #C8A25C, #9B7A3D)',
          color: '#ffffff', // Ensures good contrast, or #0D0D0F if gold
          fontSize: '0.6rem',
          fontWeight: 800,
          padding: '4px 12px',
          borderRadius: '0 0 10px 10px',
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
      
      {/* Top — bottle + category badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', minHeight: 88 }}>
        {/* Perfume bottle */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 22,
            background: `radial-gradient(ellipse at center, ${color}22 0%, transparent 70%)`,
            border: `1px solid ${color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0
          }}
        >
          {mainImage ? (
            <>
              <motion.img
                src={mainImage}
                alt={product.name}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ 
                  opacity: (hoverImage && isHovered) ? 0 : 1,
                  scale: (hoverImage && isHovered) ? 0.9 : 1 
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
              />
              {hoverImage && (
                <motion.img
                  src={hoverImage}
                  alt={`${product.name} view 2`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 1.1
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
                />
              )}
            </>
          ) : (
            <PerfumeBottle color={color} />
          )}
        </div>

        {/* Category + name */}
        <div style={{ textAlign: 'right' }}>
          {product.category && (
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                color: '#C8A25C',
                background: 'rgba(200,162,92,0.1)',
                border: '1px solid rgba(200,162,92,0.2)',
                borderRadius: 20,
                padding: '3px 10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {product.category.name}
            </span>
          )}
        </div>
      </div>

      {/* Product info */}
      <div style={{ flexGrow: 1 }}>
          {product.brand && (
            <p
              style={{
                margin: '0 0 4px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isLight ? '#6B7280' : '#9B9585',
              }}
            >
              {product.brand}
            </p>
          )}
          <h2
            style={{
              margin: '0 0 6px',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: isLight ? '#111827' : '#F2EDE2',
              transition: 'color 200ms',
            }}
          >
            {product.name}
          </h2>
        <div
          style={{
            width: 36,
            height: 2,
            background: `linear-gradient(90deg, ${color}, transparent)`,
            marginBottom: 10,
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: '0.8rem',
            color: isLight ? '#475569' : '#C8BEA8',
            lineHeight: 1.65,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>
      </div>

      {/* Variant Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
        {product.variants.map((v) => {
          const isSelected = selected.id === v.id;
          return (
            <button
              key={v.id}
              onClick={(e) => handleVariantClick(e, v)}
              style={{
                padding: '6px 14px',
                borderRadius: 10,
                fontSize: '0.72rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: isSelected ? '#bfa374' : 'rgba(191,163,116,0.3)',
                background: isSelected
                  ? '#bfa374'
                  : 'transparent',
                color: isSelected ? '#111' : (isLight ? '#6B4F1F' : '#C8BEA8'),
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                letterSpacing: '0.04em',
              }}
            >
              {v.size}
            </button>
          );
        })}
      </div>

      {/* Price + Actions Container aligned to bottom */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            {selected.compare_at_price && parseFloat(selected.compare_at_price) > parseFloat(selected.price) && (
              <span style={{ 
                fontSize: '0.9rem', 
                color: isLight ? '#9CA3AF' : '#6B6654', 
                textDecoration: 'line-through',
                fontWeight: 500 
              }}>
                {selected.compare_at_price}
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <motion.span
                key={selected.price}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C8A25C' }}
              >
                {selected.price}
              </motion.span>
              <span style={{ fontSize: '0.75rem', color: '#9B7A3D', fontWeight: 600 }}>MAD</span>
            </div>
            {selected.compare_at_price && parseFloat(selected.compare_at_price) > parseFloat(selected.price) && (
              <span style={{
                background: 'rgba(200,162,92,0.15)',
                color: '#C8A25C',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                letterSpacing: '0.05em'
              }}>
                PROMO
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={inCart}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              cursor: inCart ? 'default' : 'pointer',
              background: inCart
                ? 'rgba(200,162,92,0.12)'
                : added
                ? '#5A8A5C'
                : isHovered ? '#bfa374' : 'transparent',
              color: inCart || added ? '#fff' : isHovered ? '#111' : '#bfa374',
              border: `1px solid ${inCart ? 'transparent' : '#bfa374'}`,
              transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {inCart ? '✓ Panier' : added ? '✓ Ajouté' : 'Ajouter au panier'}
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(200,162,92,0.35)' }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            addItem({
              variantId: selected.id,
              sku: selected.sku,
              productName: product.name,
              variantName: selected.size,
              price: parseFloat(selected.price),
              slug: product.slug,
              imageUrl: product.image_url,
            } as any);
            router.push('/checkout');
          }}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 12,
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #C8A25C, #9B7A3D)',
            color: '#0D0D0F',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transition: 'all 300ms ease',
          }}
        >
          Commander Maintenant
        </motion.button>
      </div>
    </motion.article>
  );
}
