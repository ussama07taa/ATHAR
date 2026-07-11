'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const faqs = [
  {
    category: 'Livraison',
    questions: [
      {
        q: 'Quels sont vos délais de livraison ?',
        a: 'Les livraisons à Tanger sont effectuées en 24h. Pour Casablanca, Rabat et Marrakech, comptez 48h. Pour le reste du Maroc, le délai est de 3 à 4 jours ouvrés.'
      },
      {
        q: 'Quels sont les frais d\'expédition ?',
        a: 'La livraison est GRATUITE pour toute commande supérieure à 500 MAD partout au Maroc. En dessous, des frais forfaitaires de 35 MAD s\'appliquent.'
      }
    ]
  },
  {
    category: 'Paiement',
    questions: [
      {
        q: 'Comment fonctionne le paiement à la livraison (COD) ?',
        a: 'C\'est très simple : vous passez commande sur le site sans sortir votre carte bancaire. Vous payez en espèces directement au livreur au moment où il vous remet votre colis.'
      },
      {
        q: 'Puis-je payer par carte bancaire ?',
        a: 'Actuellement, nous privilégions le paiement à la livraison pour votre sécurité et votre confort. Le paiement par carte sera bientôt disponible.'
      }
    ]
  },
  {
    category: 'Produits',
    questions: [
      {
        q: 'Vos parfums sont-ils authentiques ?',
        a: 'Absolument. Tous nos décants proviennent de flacons 100% authentiques, achetés directement auprès des marques officielles ou de distributeurs agréés. Nous procédons minutieusement à leur mise en flacon (décantage) de manière propre et stérile, sans aucune altération ni dilution du parfum d\'origine.'
      },
      {
        q: 'Puis-je commander des échantillons ?',
        a: 'Oui, nous proposons souvent des doses d\'essai de 2ml lors de vos commandes pour vous faire découvrir nos nouveautés.'
      }
    ]
  }
];

function AccordionItem({ q, a, isLight }: { q: string, a: string, isLight: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="theme-border" style={{ 
      borderBottom: '1px solid',
      padding: '24px 0'
    }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left'
        }}
      >
        <span className="theme-title" style={{ 
          fontSize: '1.05rem', 
          fontWeight: 600, 
          transition: 'color 200ms'
        }}>
          {q}
        </span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          style={{ color: '#CA8A04', fontSize: '1.2rem' }}
        >
          ↓
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="theme-text" style={{ 
              marginTop: 16, 
              fontSize: '0.95rem', 
              lineHeight: 1.7,
              maxWidth: '90%'
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '120px 24px 120px', background: isLight ? '#FFFFFF' : '#0D0D0F', transition: 'all 500ms', minHeight: '100dvh' }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <h1 className="theme-title" style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
          fontWeight: 800, 
          letterSpacing: '-0.02em',
          marginBottom: 20,
          fontFamily: 'var(--font-display)'
        }}>
          Questions Fréquentes
        </h1>
        <p style={{ color: '#CA8A04', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
          Tout ce que vous devez savoir sur Athar
        </p>
        <div style={{ width: 60, height: 3, background: '#CA8A04', margin: '32px auto', borderRadius: 2 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        {faqs.map((cat, idx) => (
          <div key={idx}>
            <h2 style={{ 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              color: '#CA8A04', 
              textTransform: 'uppercase', 
              letterSpacing: '0.25em',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <span style={{ width: 4, height: 20, background: '#CA8A04', borderRadius: 2 }} />
              {cat.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cat.questions.map((item, qIdx) => (
                <AccordionItem key={qIdx} q={item.q} a={item.a} isLight={isLight} />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="theme-bg-card theme-border" style={{ marginTop: 100, padding: '56px 40px', borderRadius: 32, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', border: '1px solid' }}>
        <h3 className="theme-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>
          Vous avez encore des questions ?
        </h3>
        <p className="theme-text" style={{ fontSize: '0.95rem', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Notre équipe est à votre disposition sur WhatsApp ou via notre formulaire de contact pour vous accompagner.
        </p>
        <a 
          href="/contact" 
          style={{ 
            display: 'inline-block',
            padding: '14px 32px',
            background: '#CA8A04',
            color: '#fff',
            textDecoration: 'none', 
            fontWeight: 700, 
            fontSize: '0.9rem',
            borderRadius: 12,
            transition: 'all 300ms ease',
            boxShadow: '0 8px 20px rgba(202,138,4,0.2)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#A16207';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#CA8A04';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Nous contacter
        </a>
      </div>
    </main>
  );
}
