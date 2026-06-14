'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import { siteConfig } from '@/lib/site-config';

const navLinks = [
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/about', label: 'À propos' },
  { href: '/suivi', label: 'Suivi commande' },
];

const legalLinks = [
  { href: '/cgv', label: 'CGV' },
  { href: '/confidentialite', label: 'Confidentialité' },
  { href: '/mentions-legales', label: 'Mentions légales' },
];

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);

  return (
    <footer
      style={{
        borderTop: `1px solid ${isLight ? 'rgba(200,162,92,0.2)' : 'rgba(200,162,92,0.12)'}`,
        background: isLight ? 'rgba(245,242,236,0.98)' : 'rgba(13,13,15,0.98)',
        marginTop: 80,
        transition: 'background 300ms ease, border-color 300ms ease',
      }}
    >
      {/* Gold gradient line */}
      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, #C8A25C55, #C8A25C, #C8A25C55, transparent)',
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 24px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#C8A25C',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              Athar
            </span>
            <span
              style={{
                fontSize: '0.55rem',
                color: '#9B7A3D',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}
            >
              Maison de Parfums Marocains
            </span>
          </div>
          <p
            style={{
              fontSize: '0.8rem',
              color: isLight ? '#374151' : '#6B6654',
              lineHeight: 1.7,
              maxWidth: 260,
              margin: 0,
              transition: 'color 300ms ease',
            }}
          >
            Des essences rares, distillées par la tradition marocaine, livrées à votre porte.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: '#C8A25C',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Navigation
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: '0.8rem',
                  color: isLight ? '#374151' : '#C8BEA8',
                  textDecoration: 'none',
                  transition: 'color 200ms',
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: '#C8A25C',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Contact
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              siteConfig.phone,
              siteConfig.email,
              siteConfig.city,
            ].map((label) => (
              <p key={label} style={{ margin: 0, fontSize: '0.8rem', color: isLight ? '#374151' : '#6B6654', transition: 'color 300ms ease' }}>
                {label}
              </p>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div>
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: '#C8A25C',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Garanties
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                label: '100% Authentique',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A25C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
              },
              {
                label: 'Livraison COD',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A25C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />
                  </svg>
                ),
              },
              {
                label: 'Partout au Maroc',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A25C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
                  </svg>
                ),
              },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {icon}
                <span style={{ fontSize: '0.75rem', color: isLight ? '#374151' : '#C8BEA8', transition: 'color 300ms ease' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Links Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        padding: '32px 24px',
        borderTop: `1px solid ${isLight ? 'rgba(200,162,92,0.15)' : 'rgba(200,162,92,0.08)'}`,
      }}>
        {[
          { 
            href: 'https://instagram.com/athar', 
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            )
          },
          { 
            href: 'https://tiktok.com/@athar', 
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            )
          }
        ].map(({ href, icon }, idx) => (
          <motion.a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, color: '#C8A25C' }}
            style={{
              color: isLight ? '#111827' : '#F2EDE2',
              textDecoration: 'none',
              transition: 'color 200ms ease',
            }}
          >
            {icon}
          </motion.a>
        ))}
      </div>

      {/* Legal links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', padding: '0 24px 16px' }}>
        {legalLinks.map(({ href, label }) => (
          <Link key={href} href={href} style={{ fontSize: '0.7rem', color: isLight ? '#6B7280' : '#6B6654', textDecoration: 'none' }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: `1px solid ${isLight ? 'rgba(200,162,92,0.1)' : 'rgba(200,162,92,0.04)'}`,
          padding: '16px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.65rem', color: isLight ? '#6B7280' : '#6B6654', letterSpacing: '0.08em', transition: 'color 300ms ease' }}>
          © {new Date().getFullYear()} Athar — Maison de Parfums Marocains. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
