'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/ui/CartDrawer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MobileMenu from '@/components/layout/MobileMenu';
import { ThemeProvider } from 'next-themes';

const navLinks = [
  { href: '/', label: 'Accueil' },
  // { href: '/about', label: 'Histoire' },
  { href: '/faq', label: 'FAQ' },
  // { href: '/contact', label: 'Contact' },
];

export default function LayoutClient({ children, initialMenuData }: { children: React.ReactNode, initialMenuData?: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isCatalogue = pathname?.startsWith('/catalogue');
 
  useEffect(() => {
    const handleOpen = () => setIsMenuOpen(true);
    window.addEventListener('open-mobile-menu', handleOpen);
    return () => window.removeEventListener('open-mobile-menu', handleOpen);
  }, []);
 
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Header initialMenuData={initialMenuData} />
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
