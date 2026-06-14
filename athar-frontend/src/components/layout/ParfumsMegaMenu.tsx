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
        marginTop: 8,
        minWidth: 480,
        background: isLight ? '#F9F9F9' : '#1A1A1C',
        border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 4,
        boxShadow: isLight
          ? '0 8px 32px rgba(0,0,0,0.08)'
          : '0 8px 32px rgba(0,0,0,0.4)',
        padding: '32px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 48,
        zIndex: 200,
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
              color: isLight ? '#333333' : '#F2EDE2',
              textDecoration: 'none',
              marginBottom: 16,
              letterSpacing: '0.02em',
            }}
          >
            {group.name}
          </Link>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {group.children?.map((sub) => (
              <li key={sub.slug}>
                <Link
                  href={`/catalogue?category=${sub.slug}`}
                  onClick={onClose}
                  style={{
                    fontSize: '0.85rem',
                    color: isLight ? '#666666' : '#9B9585',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isLight ? '#333333' : '#F2EDE2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isLight ? '#666666' : '#9B9585';
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
          borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
          paddingTop: 16,
          marginTop: -8,
        }}
      >
        <Link
          href="/catalogue?category=parfums"
          onClick={onClose}
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#C8A25C',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Voir tous les parfums →
        </Link>
      </div>
    </div>
  );
}
