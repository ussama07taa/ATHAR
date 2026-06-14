'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ShippingPolicyPage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      minHeight: '80vh',
      padding: '120px 24px 80px',
      background: isLight ? '#F9FAFB' : '#0D0D0F',
      transition: 'background 300ms ease'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: isLight ? '#FFFFFF' : '#1A1A1C',
            padding: '60px 40px',
            borderRadius: 32,
            border: `1px solid ${isLight ? '#E5E7EB' : 'rgba(200,162,92,0.15)'}`,
            boxShadow: isLight ? '0 4px 24px rgba(0,0,0,0.04)' : '0 4px 24px rgba(0,0,0,0.4)',
            textAlign: 'center'
          }}
        >
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: isLight ? '#111827' : '#F2EDE2',
            marginBottom: 32,
            letterSpacing: '-0.02em'
          }}>
            Politique d'expédition
          </h1>

          <div style={{
            color: isLight ? '#4B5563' : '#C8BEA8',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 24
          }}>
            <p>
              Nous traitons toutes les commandes dans les plus brefs délais pour vous garantir une expérience exceptionnelle.
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: '#C8A25C' }}>•</span>
                <span>Les produits seront expédiés au maximum sous <strong>72 heures</strong> après confirmation de la commande.</span>
              </li>
              <li style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: '#C8A25C' }}>•</span>
                <span>Les délais de livraison peuvent varier en fonction de votre localisation et du transporteur.</span>
              </li>
              <li style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: '#C8A25C' }}>•</span>
                <span>Une fois la commande expédiée, vous recevrez un appel de la société de livraison pour organiser la réception de votre colis.</span>
              </li>
            </ul>

            <div style={{
              marginTop: 32,
              padding: '24px',
              borderRadius: 16,
              background: 'rgba(200,162,92,0.05)',
              border: '1px solid rgba(200,162,92,0.1)',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#C8A25C', fontWeight: 600 }}>
                Livraison gratuite partout au Maroc
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
