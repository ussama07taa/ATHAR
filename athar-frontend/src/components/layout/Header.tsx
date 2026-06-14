'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import useCartStore from '@/store/cartStore';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { usePathname } from 'next/navigation';
import ParfumsMegaMenu from '@/components/layout/ParfumsMegaMenu';
import { MenuCategory } from '@/types/catalog';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/about', label: 'Histoire' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  
  const isLight = mounted && resolvedTheme === 'light';

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [parfumsMenu, setParfumsMenu] = useState<MenuCategory | null>(null);
  const [isParfumsOpen, setIsParfumsOpen] = useState(false);

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
    if (isSearchOpen && allProducts.length === 0) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setAllProducts(data))
        .catch(() => {});
    }
  }, [isSearchOpen, allProducts.length]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      ).slice(0, 5);
      setFilteredProducts(filtered);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled 
          ? (isLight ? 'rgba(255,255,255,0.92)' : 'rgba(13,13,15,0.92)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${isLight ? 'rgba(200,162,92,0.15)' : 'rgba(200,162,92,0.1)'}` : 'none',
        transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Top Row: Search, Logo, Cart/Theme */}
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Mobile Menu Toggle - This will now need to trigger a global state or I use a simple window event */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-menu'))}
            className="mobile-only"
            style={{
              background: 'none',
              border: 'none',
              color: isLight ? '#111827' : '#F2EDE2',
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <button 
            onClick={() => setIsSearchOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: isLight ? '#111827' : '#F2EDE2', 
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              transition: 'background 200ms'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          
          {mounted && (
            <div className="desktop-only" style={{ gap: 12, marginLeft: 8 }}>
              <a href="https://instagram.com/athar" target="_blank" rel="noopener noreferrer" style={{ color: isLight ? '#111827' : '#F2EDE2', opacity: 0.6, transition: 'opacity 200ms' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://tiktok.com/@athar" target="_blank" rel="noopener noreferrer" style={{ color: isLight ? '#111827' : '#F2EDE2', opacity: 0.6, transition: 'opacity 200ms' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
              </a>
            </div>
          )}
        </div>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <span style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#C8A25C',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              lineHeight: 0.9
            }}>
              Athar
            </span>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 400,
              color: '#9B7A3D',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginTop: 4
            }}>
              Maison de Parfums
            </span>
          </motion.div>
        </Link>

        {/* Cart & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
          <ThemeToggle />
          
          <button
            onClick={openCart}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: isLight ? '#111827' : '#F2EDE2',
              cursor: 'pointer',
              padding: 8,
              transition: 'transform 200ms'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    background: '#C8A25C',
                    color: '#0D0D0F',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px'
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <nav 
        className="nav-row desktop-only"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          padding: '0 24px 16px',
        }}
      >
        {/* Accueil */}
        <Link
          href="/"
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: pathname === '/' ? '#C8A25C' : (isLight ? '#4B5563' : '#C8BEA8'),
            textDecoration: 'none',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transition: 'all 250ms ease',
            position: 'relative',
            padding: '4px 0',
          }}
        >
          Accueil
          {pathname === '/' && (
            <motion.div layoutId="activeNav" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#C8A25C', borderRadius: 1 }} />
          )}
        </Link>

        {/* Parfums dropdown */}
        {parfumsMenu && (
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsParfumsOpen(true)}
            onMouseLeave={() => setIsParfumsOpen(false)}
          >
            <Link
              href="/catalogue?category=parfums"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: pathname.startsWith('/catalogue') ? '#C8A25C' : (isLight ? '#4B5563' : '#C8BEA8'),
                textDecoration: 'none',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'all 250ms ease',
                position: 'relative',
                padding: '4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Parfums
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
              {pathname.startsWith('/catalogue') && (
                <motion.div layoutId="activeNav" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#C8A25C', borderRadius: 1 }} />
              )}
            </Link>
            <AnimatePresence>
              {isParfumsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ParfumsMegaMenu
                    parfums={parfumsMenu}
                    isLight={isLight}
                    onClose={() => setIsParfumsOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {navLinks.slice(1).map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: isActive ? '#C8A25C' : (isLight ? '#4B5563' : '#C8BEA8'),
                textDecoration: 'none',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'all 250ms ease',
                position: 'relative',
                padding: '4px 0'
              }}
            >
              {label}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: '#C8A25C',
                    borderRadius: 1
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── SEARCH MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(13,13,15,0.98)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              padding: '100px 24px',
              alignItems: 'center',
              backdropFilter: 'blur(20px)',
            }}
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              style={{
                position: 'absolute',
                top: 40,
                right: 40,
                background: 'none',
                border: 'none',
                color: isLight ? '#111827' : '#F2EDE2',
                cursor: 'pointer',
                fontSize: '1.5rem',
              }}
            >
              ✕
            </button>
            
            <div style={{ width: '100%', maxWidth: 650 }}>
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un parfum..."
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(200,162,92,0.3)'}`,
                  padding: '16px 0',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: isLight ? '#111827' : '#F2EDE2',
                  outline: 'none',
                }}
              />
              
              <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <Link 
                      key={p.id} 
                      href={`/products/${p.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 20, 
                        padding: '12px 20px', 
                        borderRadius: 16,
                        background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(200,162,92,0.05)',
                        textDecoration: 'none',
                        transition: 'transform 200ms ease'
                      }}
                    >
                      <div style={{ width: 50, height: 50, borderRadius: 8, background: '#C8A25C22', flexShrink: 0 }}>
                        {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2' }}>{p.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#9B7A3D' }}>{p.variants?.[0]?.price} MAD</p>
                      </div>
                    </Link>
                  ))
                ) : searchQuery.trim() !== '' ? (
                  <p style={{ color: '#6B6654', textAlign: 'center' }}>Aucun résultat pour &quot;{searchQuery}&quot;</p>
                ) : (
                  <p style={{ color: '#6B6654', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Saisissez un nom de parfum...
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

  );
}
