'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { MenuCategory } from '@/types/catalog';
import { siteConfig } from '@/lib/site-config';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export default function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';
  const [parfumsMenu, setParfumsMenu] = useState<MenuCategory | null>(null);
  const [parfumsExpanded, setParfumsExpanded] = useState(false);
  const [decantageExpanded, setDecantageExpanded] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch('/api/collections?menu=true')
      .then((res) => res.json())
      .then((data: MenuCategory[]) => {
        const parfums = data.find((c) => c.slug === 'parfums');
        if (parfums) setParfumsMenu(parfums);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setParfumsExpanded(false);
      setDecantageExpanded(false);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const linkColor = (active: boolean) =>
    active ? '#CA8A04' : (isLight ? '#111827' : '#F2EDE2');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
            }}
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              width: '85%',
              maxWidth: 320,
              background: isLight ? '#FFFFFF' : '#0D0D0F',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              padding: '40px 32px',
              boxShadow: '20px 0 60px rgba(0,0,0,0.5)',
              overflowY: 'auto',
              transition: 'all 300ms ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 60 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#CA8A04', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Athar</span>
                <span style={{ fontSize: '0.55rem', fontWeight: 500, color: '#A16207', letterSpacing: '0.4em', textTransform: 'uppercase', marginTop: 4 }}>Maison de Parfums</span>
              </div>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: isLight ? '#111827' : '#F2EDE2', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Accueil */}
              <Link
                href="/"
                onClick={onClose}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: linkColor(pathname === '/'),
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 200ms ease'
                }}
              >
                Accueil
              </Link>

              {/* Niche */}
              <Link
                href="/niche"
                onClick={onClose}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: linkColor(pathname === '/niche'),
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 200ms ease'
                }}
              >
                Niche
              </Link>

              {/* Packs */}
              <Link
                href="/packs"
                onClick={onClose}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: linkColor(pathname === '/packs'),
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 200ms ease'
                }}
              >
                Packs
              </Link>

              {/* Arabic */}
              <Link
                href="/parfums-arabic"
                onClick={onClose}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: linkColor(pathname === '/parfums-arabic'),
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 200ms ease'
                }}
              >
                Arabic
              </Link>

              {/* Parfums accordion */}
              {parfumsMenu && (
                <div>
                  <button
                    onClick={() => setParfumsExpanded(!parfumsExpanded)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: linkColor(pathname.startsWith('/catalogue')),
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: 0,
                      transition: 'color 200ms ease'
                    }}
                  >
                    Parfums
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transform: parfumsExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {parfumsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', marginTop: 16, paddingLeft: 8 }}
                      >
                        <Link
                          href="/catalogue?category=parfums"
                          onClick={onClose}
                          style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#CA8A04', textDecoration: 'none', marginBottom: 20 }}
                        >
                          Tous les parfums
                        </Link>
                        {parfumsMenu.children?.map((group) => (
                          <div key={group.slug} style={{ marginBottom: 24 }}>
                            <Link
                              href={`/catalogue?category=${group.slug}`}
                              onClick={onClose}
                              style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2', textDecoration: 'none', marginBottom: 10 }}
                            >
                              {group.name}
                            </Link>
                            {group.children?.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/catalogue?category=${sub.slug}`}
                                onClick={onClose}
                                style={{ display: 'block', fontSize: '0.85rem', color: isLight ? '#44403C' : '#A8A29E', textDecoration: 'none', padding: '6px 0 6px 12px' }}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Décantage accordion */}
              <div>
                <button
                  onClick={() => setDecantageExpanded(!decantageExpanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: linkColor(pathname.startsWith('/decantage-des-parfums')),
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 0,
                    transition: 'color 200ms ease'
                  }}
                >
                  Décantage
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: decantageExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <AnimatePresence>
                  {decantageExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden', marginTop: 16, paddingLeft: 8 }}
                    >
                      <Link
                        href="/decantage-des-parfums"
                        onClick={onClose}
                        style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#CA8A04', textDecoration: 'none', marginBottom: 20 }}
                      >
                        Tous les décantages
                      </Link>
                      <Link
                        href="/decantage-des-parfums?gender=homme"
                        onClick={onClose}
                        style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2', textDecoration: 'none', marginBottom: 16 }}
                      >
                        Pour les Hommes
                      </Link>
                      <Link
                        href="/decantage-des-parfums?gender=femme"
                        onClick={onClose}
                        style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2', textDecoration: 'none', marginBottom: 16 }}
                      >
                        Pour les Femmes
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.slice(1).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: linkColor(pathname === href),
                    textDecoration: 'none',
                    letterSpacing: '0.05em',
                    transition: 'color 200ms ease'
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: 40, borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
              <p style={{ fontSize: '0.7rem', color: '#A16207', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20, fontWeight: 700 }}>Suivez-nous</p>
               <div style={{ display: 'flex', gap: 24 }}>
                <a href="https://www.instagram.com/atha_rfragrances/" target="_blank" rel="noopener noreferrer" style={{ color: isLight ? '#111827' : '#F2EDE2', opacity: 0.7 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="https://www.tiktok.com/@atha_rfragrances?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ color: isLight ? '#111827' : '#F2EDE2', opacity: 0.7 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                </a>
                <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: isLight ? '#111827' : '#F2EDE2', opacity: 0.7 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
