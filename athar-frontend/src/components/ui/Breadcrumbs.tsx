'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

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
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);

  if (!pathname || pathname === '/') return null;

  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav 
      aria-label="Breadcrumb"
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 20px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: '0.65rem',
        fontWeight: 600,
        color: isLight ? '#44403C' : '#A8A29E',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
      }}
    >
      <Link 
        href="/" 
        style={{ 
          color: '#CA8A04', 
          textDecoration: 'none',
          transition: 'opacity 200ms',
        }}
      >
        ATHAR
      </Link>

      {paths.map((p, idx) => {
        const href = `/${paths.slice(0, idx + 1).join('/')}`;
        const isLast = idx === paths.length - 1;
        const label = routeLabels[p] || p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ');

        return (
          <div key={href} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ opacity: 0.3, color: isLight ? '#44403C' : '#A8A29E' }}>/</span>
            {isLast ? (
              <span style={{ color: isLight ? '#111827' : '#F2EDE2', fontWeight: 700 }}>
                {label}
              </span>
            ) : (
              <Link 
                href={href}
                style={{ 
                  color: '#CA8A04', 
                  textDecoration: 'none',
                  transition: 'opacity 200ms',
                }}
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
