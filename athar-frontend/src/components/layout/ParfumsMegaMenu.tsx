'use client';

import Link from 'next/link';
import { MenuCategory } from '@/types/catalog';

interface ParfumsMegaMenuProps {
  parfums: MenuCategory;
  isLight: boolean;
  onClose?: () => void;
}

export default function ParfumsMegaMenu({ parfums, isLight, onClose }: ParfumsMegaMenuProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: 12,
        minWidth: 480,
        background: isLight ? '#FFFFFF' : '#0D0D0F',
        border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 8,
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        padding: '40px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 56,
        zIndex: 200,
        transition: 'background 300ms ease, border-color 300ms ease, box-shadow 300ms ease'
      }}
    >
      {parfums.children?.map((group) => (
        <div key={group.slug}>
          <Link
            href={`/catalogue?category=${group.slug}`}
            onClick={onClose}
            style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: isLight ? '#111827' : '#F2EDE2',
              textDecoration: 'none',
              marginBottom: 16,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            {group.name}
          </Link>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {group.children?.map((sub) => (
              <li key={sub.slug}>
                <Link
                  href={`/catalogue?category=${sub.slug}`}
                  onClick={onClose}
                  style={{
                    fontSize: '0.85rem',
                    color: isLight ? '#44403C' : '#A8A29E',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isLight ? '#111827' : '#F2EDE2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isLight ? '#44403C' : '#A8A29E';
                  }}
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div
        style={{
          gridColumn: '1 / -1',
          borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
          paddingTop: 20,
          marginTop: -8,
        }}
      >
        <Link
          href="/catalogue?category=parfums"
          onClick={onClose}
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#CA8A04',
            textDecoration: 'none',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'opacity 200ms ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Voir tous les parfums →
        </Link>
          <Link
            href="/parfums-arabic"
            onClick={onClose}
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#CA8A04',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'opacity 200ms ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Parfums Arabic →
          </Link>
      </div>
    </div>
  );
}
