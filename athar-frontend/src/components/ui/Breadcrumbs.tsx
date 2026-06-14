'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const routeLabels: Record<string, string> = {
  catalogue: 'Catalogue',
  about: 'Histoire',
  contact: 'Contact',
  faq: 'FAQ',
  checkout: 'Paiement',
  'shipping-policy': 'Expédition',
  products: 'Produits',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isLight = mounted && resolvedTheme === 'light';

  if (!pathname || pathname === '/') return null;

  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav 
      aria-label="Breadcrumb"
      style={{
        maxWidth: 1140,
        margin: '0 auto',
        padding: '24px 24px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: '0.72rem',
        fontWeight: 600,
        color: isLight ? '#9CA3AF' : '#6B6654',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
      }}
    >
      <Link 
        href="/" 
        style={{ 
          color: '#C8A25C', 
          textDecoration: 'none',
          transition: 'opacity 200ms',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        ATHAR
      </Link>

      {paths.map((p, idx) => {
        const href = `/${paths.slice(0, idx + 1).join('/')}`;
        const isLast = idx === paths.length - 1;
        const label = routeLabels[p] || p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ');

        return (
          <div key={href} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ opacity: 0.5 }}>/</span>
            {isLast ? (
              <span style={{ color: isLight ? '#374151' : '#C8BEA8' }}>
                {label}
              </span>
            ) : (
              <Link 
                href={href}
                style={{ 
                  color: '#C8A25C', 
                  textDecoration: 'none',
                  transition: 'opacity 200ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
