'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig, whatsappUrl } from '@/lib/site-config';
import useCartStore from '@/store/cartStore';
import { useTheme } from 'next-themes';

export default function FloatingActions() {
  const [showTopButton, setShowTopButton] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    setMounted(true);

    // Show label after 5 seconds to invite user
    const timer = setTimeout(() => setShowLabel(true), 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const proMessage = "Bonjour Athar 👋, je souhaite avoir plus d'informations sur vos parfums.";

  // If cart is open, hide the actions to avoid overlap
  if (!mounted || isCartOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-4">
      <style>{`
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        .whatsapp-pulse {
          animation: pulse-green 2s infinite;
        }
      `}</style>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Retourner en haut"
        type="button"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: isLight ? '#FFFFFF' : '#0D0D0F',
          color: isLight ? '#111827' : '#F2EDE2',
          border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 300ms cubic-bezier(0.23, 1, 0.32, 1)',
          opacity: showTopButton ? 1 : 0,
          transform: showTopButton ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: showTopButton ? 'auto' : 'none'
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = showTopButton ? 'translateY(0)' : 'translateY(20px)')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>

      {/* WhatsApp Section */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Floating Label */}
        <div style={{ 
          marginRight: 12, 
          padding: '8px 16px', 
          borderRadius: 16, 
          background: isLight ? '#FFFFFF' : '#0D0D0F', 
          border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, 
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          color: isLight ? '#111827' : '#F2EDE2', 
          transition: 'all 500ms ease',
          opacity: showLabel ? 1 : 0,
          transform: showLabel ? 'translateX(0)' : 'translateX(20px)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          Besoin d&apos;aide ? 👋
        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl(proMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactez-nous sur WhatsApp"
          className="whatsapp-pulse"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#25d366',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(37,211,102,0.3)',
            transition: 'transform 300ms ease',
            zIndex: 1
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1) rotate(6deg)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
          onClick={() => setShowLabel(false)}
        >
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
