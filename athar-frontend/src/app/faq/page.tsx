'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

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
        a: 'Absolument. Chaque fragrance Athar est une création originale issue de notre atelier à Tanger. Nous n\'utilisons que des essences de haute qualité.'
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
    <div style={{ 
      borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
      padding: '20px 0'
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
        <span style={{ 
          fontSize: '1.05rem', 
          fontWeight: 600, 
          color: isLight ? '#111827' : '#F2EDE2',
          transition: 'color 200ms'
        }}>
          {q}
        </span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          style={{ color: '#C8A25C', fontSize: '1.2rem' }}
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
            <p style={{ 
              marginTop: 16, 
              fontSize: '0.95rem', 
              color: isLight ? '#4B5563' : '#C8BEA8', 
              lineHeight: 1.6,
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
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', 
          fontWeight: 800, 
          color: isLight ? '#111827' : '#F2EDE2',
          letterSpacing: '-0.02em',
          marginBottom: 16
        }}>
          Questions Fréquentes
        </h1>
        <p style={{ color: '#9B7A3D', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          Tout ce que vous devez savoir sur Athar
        </p>
        <div style={{ width: 48, height: 2, background: '#C8A25C', margin: '24px auto' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {faqs.map((cat, idx) => (
          <div key={idx}>
            <h2 style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: '#C8A25C', 
              textTransform: 'uppercase', 
              letterSpacing: '0.25em',
              marginBottom: 24,
              borderLeft: '3px solid #C8A25C',
              paddingLeft: 16
            }}>
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
      
      <div style={{ 
        marginTop: 80, 
        padding: 40, 
        borderRadius: 24, 
        background: isLight ? '#F9F7F2' : 'rgba(200,162,92,0.05)',
        textAlign: 'center',
        border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(200,162,92,0.1)'}`
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2', marginBottom: 12 }}>
          Vous avez encore des questions ?
        </h3>
        <p style={{ fontSize: '0.9rem', color: isLight ? '#4B5563' : '#C8BEA8', marginBottom: 24 }}>
          Notre équipe est à votre disposition sur WhatsApp ou via notre formulaire de contact.
        </p>
        <a 
          href="/contact" 
          style={{ 
            color: '#C8A25C', 
            textDecoration: 'none', 
            fontWeight: 700, 
            fontSize: '0.9rem',
            borderBottom: '1px solid #C8A25C'
          }}
        >
          Nous contacter
        </a>
      </div>
    </main>
  );
}
