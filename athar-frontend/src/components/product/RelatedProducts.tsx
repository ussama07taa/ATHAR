'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Product } from '@/app/page';
import ProductCard from '@/components/ui/ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => setMounted(true), []);

  if (!products || products.length === 0) return null;

  return (
    <section 
      style={{ 
        padding: '80px 24px',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ 
            fontSize: '0.65rem', 
            fontWeight: 700, 
            letterSpacing: '0.4em', 
            color: '#C8A25C', 
            textTransform: 'uppercase',
            marginBottom: 12
          }}
        >
          Découverte
          </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', 
            fontWeight: 800, 
            color: isLight ? '#111827' : '#F2EDE2',
            margin: 0,
            letterSpacing: '-0.02em'
          }}
        >
          Vous aimerez aussi
        </motion.h2>
        <div style={{ 
          width: 60, 
          height: 3, 
          background: '#C8A25C', 
          margin: '20px auto 0',
          borderRadius: 2
        }} />
      </div>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 32 
        }}
      >
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
