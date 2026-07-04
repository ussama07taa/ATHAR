'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { notFound } from 'next/navigation';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'circOut' as any } }
} as any;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } }
};

export default function AboutPage() {
  notFound();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 120, background: isLight ? '#FFFFFF' : '#0D0D0F', transition: 'all 500ms' }}>

      {/* ── HERO Section ── */}
      <section className="theme-bg-card theme-border" style={{
        height: '75vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(202,138,4,0.1) 0%, transparent 70%)',
          zIndex: 1
        }} />

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          style={{ position: 'relative', zIndex: 2, padding: '0 24px' }}
        >
          <motion.p variants={fadeUp} style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.4em', color: '#CA8A04', textTransform: 'uppercase', marginBottom: 24 }}>
            L&apos;Esprit Athar
          </motion.p>
          <motion.h1 className="theme-title" variants={fadeUp} style={{ fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
            Destination<br />
            <span style={{ color: '#CA8A04' }}>Prestige</span>
          </motion.h1>
        </motion.div>
      </section>

      {/* ── Story Section ── */}
      <section style={{ maxWidth: 1100, margin: '120px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 80, alignItems: 'center' }}>
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <h2 className="theme-title" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 28, lineHeight: 1.2, fontFamily: 'var(--font-display)' }}>
              Athar — L&apos;Excellence du Parfum Authentique
            </h2>
            <p className="theme-text" style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              Athar est votre boutique spécialisée dans la haute parfumerie. Fondée sur la passion du beau et de l&apos;authentique, nous proposons une curation rigoureuse des meilleures fragrances mondiales.
            </p>
            <p className="theme-text" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
              Du parfum oriental traditionnel aux créations contemporaines de niche, chaque flacon de notre collection est choisi pour son caractère unique et sa tenue exceptionnelle. Notre mission est de vous offrir le meilleur du luxe, avec un service irréprochable et transparent.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{
              height: 480,
              borderRadius: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
              border: '1px solid'
            }}
            className="theme-bg-card theme-border"
          >
            <div style={{ textAlign: 'center', padding: 48 }}>
              <span style={{ fontSize: '5rem', display: 'block', marginBottom: 24 }}>🏺</span>
              <p className="theme-title" style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prestige Garanti</p>
              <p style={{ fontSize: '0.85rem', color: '#CA8A04', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>Tanger, Maroc</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values Section ── */}
      <section className="theme-bg-card theme-border" style={{ padding: '120px 24px', borderTop: '1px solid', borderBottom: '1px solid' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
            className="theme-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 20, fontFamily: 'var(--font-display)' }}>
            L&apos;Engagement Athar
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
            className="theme-text" style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 80, maxWidth: 600, margin: '0 auto 80px' }}>
            Nous sélectionnons chaque parfum avec la plus grande rigueur pour vous garantir une expérience olfactive inégalée.
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { icon: '💎', label: '100% Authentique', desc: 'Produits certifiés et scellés d\'origine' },
              { icon: '⚡', label: 'Livraison Express', desc: 'Votre parfum chez vous en 24h à 72h' },
              { icon: '🤝', label: 'Paiement à Réception', desc: 'Simple, sécurisé et sans carte bancaire' },
              { icon: '⚜️', label: 'Curation de Niche', desc: 'Les fragrances les plus rares du marché' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="show"
                variants={fadeUp}
                viewport={{ once: true }}
                style={{
                  padding: '40px 28px',
                  borderRadius: 24,
                  background: isLight ? '#FFFFFF' : '#0D0D0F',
                  transition: 'all 300ms ease',
                  border: '1px solid'
                }}
                className="theme-border"
                whileHover={{ y: -8 }}
              >
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 20 }}>{item.icon}</span>
                <span style={{ color: '#CA8A04', fontSize: '0.9rem', fontWeight: 800, display: 'block', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</span>
                <p className="theme-text" style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Boutique Map Card ── */}
      <section style={{ maxWidth: 1000, margin: '120px auto 100px', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            padding: '48px',
            borderRadius: 32,
            flexWrap: 'wrap',
            boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
            border: '1px solid'
          }}
          className="theme-bg-card theme-border"
        >
          <div className="theme-border" style={{ width: '80px', height: '80px', borderRadius: '50%', background: isLight ? '#FFFFFF' : '#0D0D0F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', border: '1px solid' }}>📍</div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#CA8A04', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800 }}>Boutique Physique</p>
            <h3 className="theme-title" style={{ margin: '0 0 12px', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              Visitez-nous à Tanger
            </h3>
            <p className="theme-text" style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
              Beni Makada, Arad Dawla — Tanger, Maroc<br />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginTop: 8 }}>Lun–Sam 10h–21h · Dim 11h–19h</span>
            </p>
          </div>
          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              padding: '16px 32px',
              borderRadius: 12,
              background: '#CA8A04',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.85rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 300ms ease',
              boxShadow: '0 10px 20px rgba(202,138,4,0.2)'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#A16207'}
            onMouseOut={e => e.currentTarget.style.background = '#CA8A04'}
          >
            Voir la carte
          </a>
        </motion.div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ textAlign: 'center', padding: '0 24px' }}>
        <motion.div initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
          <h3 className="theme-title" style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)' }}>
            Votre Signature Olfactive vous Attend
          </h3>
          <p className="theme-text" style={{ marginBottom: 40, fontSize: '1.05rem', fontWeight: 500 }}>
            Découvrez notre collection exclusive et profitez de la livraison COD.
          </p>
          <Link href="/catalogue" style={{ 
            textDecoration: 'none', 
            display: 'inline-block', 
            padding: '20px 56px', 
            borderRadius: 14, 
            background: isLight ? '#111827' : '#F2EDE2', 
            color: isLight ? '#FFFFFF' : '#0D0D0F', 
            fontWeight: 800, 
            fontSize: '0.95rem', 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase',
            transition: 'opacity 200ms ease'
          }} onMouseOver={e => e.currentTarget.style.opacity = '0.8'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            Explorer le Catalogue
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
