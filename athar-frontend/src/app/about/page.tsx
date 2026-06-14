'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'circOut' as any } }
} as any;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } }
};

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>

      {/* ── HERO ──────────────────────────────────────── */}
      <section style={{
        height: '70vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        background: isLight
          ? 'linear-gradient(135deg, #F5F2EC 0%, #FFFFFF 100%)'
          : 'linear-gradient(135deg, #0D0D0F 0%, #1A1A1D 100%)'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(200,162,92,0.12) 0%, transparent 70%)',
          zIndex: 1
        }} />

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          style={{ position: 'relative', zIndex: 2, padding: '0 24px' }}
        >
          <motion.p variants={fadeUp} style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.4em', color: '#C8A25C', textTransform: 'uppercase', marginBottom: 20 }}>
            Notre Boutique
          </motion.p>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 800, color: isLight ? '#111827' : '#F2EDE2', letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>
            Votre Destination<br />
            <span style={{ color: '#C8A25C' }}>Parfum Prestige</span>
          </motion.h1>
        </motion.div>
      </section>

      {/* ── QUI SOMMES NOUS ───────────────────────────── */}
      <section style={{ maxWidth: 1000, margin: '100px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2', marginBottom: 24 }}>
              Athar — La Boutique du Parfum Authentique
            </h2>
            <p style={{ fontSize: '1rem', color: isLight ? '#374151' : '#C8BEA8', lineHeight: 1.8 }}>
              Athar est votre boutique spécialisée dans la vente de parfums de prestige. Nous proposons une large sélection des meilleures marques, du parfum oriental traditionnel au moderne — toutes soigneusement choisies pour leur qualité et leur authenticité.
            </p>
            <p style={{ fontSize: '1rem', color: isLight ? '#374151' : '#C8BEA8', lineHeight: 1.8, marginTop: 16 }}>
              Notre mission est simple : vous offrir accès aux plus belles fragrances du marché, avec un service honnête, une livraison rapide, et le paiement à la livraison — sans stress.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{
              height: 420,
              background: isLight ? 'rgba(200,162,92,0.04)' : 'rgba(200,162,92,0.04)',
              border: `1px solid ${isLight ? 'rgba(200,162,92,0.2)' : 'rgba(200,162,92,0.12)'}`,
              borderRadius: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center', padding: 40 }}>
              <span style={{ fontSize: '5rem', display: 'block', marginBottom: 20 }}>🛍️</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2', margin: '0 0 8px' }}>Toutes les grandes marques</p>
              <p style={{ fontSize: '0.8rem', color: '#9B7A3D', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Un seul endroit</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VALEURS ───────────────────────────────────── */}
      <section style={{ background: isLight ? '#F9F7F2' : '#111115', padding: '100px 24px', margin: '40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
            style={{ fontSize: '2.2rem', fontWeight: 800, color: isLight ? '#111827' : '#F2EDE2', marginBottom: 16 }}>
            Pourquoi choisir Athar ?
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
            style={{ fontSize: '1rem', color: isLight ? '#374151' : '#C8BEA8', lineHeight: 1.8, marginBottom: 60 }}>
            Nous sélectionnons chaque parfum avec soin. Qualité garantie, prix compétitifs, et un service client disponible 7j/7.
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { icon: '✅', label: 'Produits 100% Authentiques', desc: 'Chaque parfum est contrôlé avant expédition' },
              { icon: '🚚', label: 'Livraison Rapide', desc: '24 à 72h partout au Maroc' },
              { icon: '💳', label: 'COD — Paiement à la livraison', desc: 'Vous payez seulement à réception' },
              { icon: '🌟', label: 'Toutes les marques', desc: 'Oriental, niche, Western — tout chez nous' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="show"
                variants={fadeUp}
                viewport={{ once: true }}
                style={{
                  padding: '28px 20px',
                  border: `1px solid ${isLight ? 'rgba(200,162,92,0.15)' : 'rgba(200,162,92,0.1)'}`,
                  borderRadius: 20,
                  background: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(200,162,92,0.03)',
                }}
              >
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 16 }}>{item.icon}</span>
                <span style={{ color: '#C8A25C', fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: 8 }}>{item.label}</span>
                <p style={{ fontSize: '0.8rem', color: isLight ? '#6B7280' : '#6B6654', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '120px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: isLight ? '#111827' : '#F2EDE2', margin: '0 0 12px' }}>
            Notre Sélection
          </h2>
          <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, transparent, #C8A25C, transparent)', margin: '0 auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
          {[
            { icon: '🪵', name: 'Parfums Orientaux', desc: 'Oud, Musc, Ambre, Rose — les trésors de l\'Orient' },
            { icon: '🌸', name: 'Parfums Floraux', desc: 'Feminin, élégant, intemporel' },
            { icon: '🌊', name: 'Parfums Frais', desc: 'Aquatique et citrus pour le quotidien' },
            { icon: '💎', name: 'Collections Prestige', desc: 'Marques de niche et éditions limitées' },
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(200,162,92,0.15)' }}
              style={{
                padding: '36px 28px',
                borderRadius: 20,
                textAlign: 'center',
                background: isLight ? '#FDFDFC' : 'rgba(200,162,92,0.03)',
                border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(200,162,92,0.1)'}`,
                boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.04)' : 'none',
                cursor: 'pointer',
                transition: 'all 300ms ease',
              }}
            >
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 16 }}>{cat.icon}</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2', margin: '0 0 10px' }}>{cat.name}</h3>
              <p style={{ fontSize: '0.82rem', color: isLight ? '#6B7280' : '#9B7A3D', margin: 0, lineHeight: 1.6 }}>{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BOUTIQUE PHYSIQUE ─────────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            padding: '32px 36px',
            borderRadius: 24,
            background: isLight
              ? 'linear-gradient(135deg, rgba(200,162,92,0.06), rgba(255,255,255,0.9))'
              : 'linear-gradient(135deg, rgba(200,162,92,0.08), rgba(26,26,29,0.8))',
            border: `1px solid ${isLight ? 'rgba(200,162,92,0.2)' : 'rgba(200,162,92,0.15)'}`,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '3.5rem', flexShrink: 0 }}>📍</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 4px', fontSize: '0.7rem', color: '#C8A25C', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Boutique Physique</p>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 800, color: isLight ? '#111827' : '#F2EDE2' }}>
              Visitez-nous à Tanger
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#9B7A3D', lineHeight: 1.6 }}>
              Beni Makada, Arad Dawla — Tanger, Maroc<br />
              <span style={{ fontSize: '0.8rem' }}>Lun–Sam 10h–21h · Dim 11h–19h</span>
            </p>
          </div>
          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #C8A25C, #9B7A3D)',
              color: '#0D0D0F',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            🗺️ Voir sur la carte
          </a>
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '40px 24px 80px' }}>
        <motion.div initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2', marginBottom: 12 }}>
            Trouvez votre parfum signature chez Athar
          </h3>
          <p style={{ color: '#9B7A3D', marginBottom: 32, fontSize: '0.95rem' }}>
            Livraison COD partout au Maroc — payez à la réception.
          </p>
          <Link href="/catalogue" style={{ textDecoration: 'none', display: 'inline-block', padding: '16px 48px', borderRadius: 14, background: 'linear-gradient(135deg, #C8A25C, #9B7A3D)', color: '#0D0D0F', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.05em', boxShadow: '0 8px 24px rgba(200,162,92,0.3)' }}>
            Explorer le Catalogue
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
