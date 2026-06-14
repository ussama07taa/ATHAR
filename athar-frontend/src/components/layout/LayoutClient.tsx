'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/ui/CartDrawer';
import ThemeProvider from '@/components/ui/ThemeProvider';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MobileMenu from '@/components/layout/MobileMenu';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/about', label: 'Histoire' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isCatalogue = pathname?.startsWith('/catalogue');

  useEffect(() => {
    const handleOpen = () => setIsMenuOpen(true);
    window.addEventListener('open-mobile-menu', handleOpen);
    return () => window.removeEventListener('open-mobile-menu', handleOpen);
  }, []);

  return (
    <ThemeProvider>
      <Header />
      <CartDrawer />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navLinks={navLinks} />

      <div style={{ paddingTop: 130 }}>
        {!isCatalogue && <Breadcrumbs />}

        <main style={{ minHeight: '100dvh' }}>{children}</main>
      </div>

      <Footer />
    </ThemeProvider>
  );
}
