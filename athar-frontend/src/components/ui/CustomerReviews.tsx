'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const reviews = [
  {
    id: 1,
    name: 'Nadia B.',
    location: 'Casablanca',
    rating: 5,
    text: 'Waw, c\'est vraiment un parfum exceptionnel. La tenue est incroyable — j\'en ai encore le soir alors que je l\'ai mis le matin. Je reviendrai commander !',
    product: 'Athar Gold',
    date: 'Mai 2025',
    verified: true,
    avatar: 'N',
  },
  {
    id: 2,
    name: 'Youssef M.',
    location: 'Marrakech',
    rating: 5,
    text: "Livraison rapide, emballage luxueux et le parfum est divin. J'ai commandé en COD — 0 problème, très professionnel. 100% authentique.",
    product: 'Musk Al Tahara',
    date: 'Avril 2025',
    verified: true,
    avatar: 'Y',
  },
  {
    id: 3,
    name: 'Salma K.',
    location: 'Rabat',
    rating: 5,
    text: 'Je cherchais un oud qui ne soit pas trop fort — Athar a exactement ce qu\'il faut. Délicat, élégant, longue durée. Parfait pour le bureau.',
    product: 'Oud Fassi',
    date: 'Mars 2025',
    verified: true,
    avatar: 'S',
  },
  {
    id: 4,
    name: 'Hamza R.',
    location: 'Tanger',
    rating: 5,
    text: 'Cadeau pour ma femme — elle était absolument ravie. La présentation est magnifique et le parfum est sublime. Je recommande fortement !',
    product: 'Rose Berbère',
    date: 'Juin 2025',
    verified: true,
    avatar: 'H',
  },
  {
    id: 5,
    name: 'Fatima Z.',
    location: 'Fès',
    rating: 5,
    text: 'Qualité authentique, prix raisonnable. On sent vraiment la différence avec les parfums industriels. Merci Athar pour cette pépite !',
    product: 'Athar Noir',
    date: 'Fév 2025',
    verified: true,
    avatar: 'F',
  },
];

function StarRow({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} style={{ color: '#C8A25C', fontSize: '0.85rem' }}>★</span>
      ))}
    </div>
  );
}

type DisplayReview = typeof reviews[number];

export default function CustomerReviews() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [displayReviews, setDisplayReviews] = useState<DisplayReview[]>(reviews);
  const [stats, setStats] = useState({ count: 147, average: 4.9 });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch('/api/reviews/featured')
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews?.length) {
          setDisplayReviews(data.reviews.map((r: { id: number; customer_name: string; customer_city?: string; rating: number; comment: string; product?: string }, i: number) => ({
            id: r.id ?? i,
            name: r.customer_name,
            location: r.customer_city ?? 'Maroc',
            rating: r.rating,
            text: r.comment,
            product: r.product ?? 'Athar',
            date: '',
            verified: true,
            avatar: r.customer_name.charAt(0),
          })));
        }
        if (data.stats?.count > 0) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActive(a => (a + 1) % displayReviews.length), 4500);
    return () => clearInterval(timer);
  }, [displayReviews.length]);

  const isLight = mounted && resolvedTheme === 'light';
  const bg = isLight
    ? 'linear-gradient(135deg, rgba(200,162,92,0.04), rgba(255,255,255,0.9))'
    : 'linear-gradient(135deg, rgba(200,162,92,0.06), rgba(26,26,29,0.8))';
  const border = isLight ? 'rgba(200,162,92,0.2)' : 'rgba(200,162,92,0.18)';

  return (
    <section style={{ padding: '80px 0', position: 'relative' }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 56 }}
      >
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8A25C', marginBottom: 12 }}>
          Témoignages
        </p>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: isLight ? '#1A1A1D' : '#F2EDE2', margin: '0 0 16px' }}>
          Ils ont choisi Athar
        </h2>
        <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, transparent, #C8A25C, transparent)', margin: '0 auto 16px' }} />
        {/* Overall rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#C8A25C', fontSize: '1.2rem' }}>★</span>)}
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: isLight ? '#111' : '#F2EDE2' }}>{stats.average}</span>
          <span style={{ fontSize: '0.8rem', color: isLight ? '#64748B' : '#C8BEA8' }}>sur 5 · {stats.count}+ avis</span>
        </div>
      </motion.div>

      {/* Carousel */}
      <div style={{ overflow: 'hidden', padding: '0 0 40px' }}>
        <div
          style={{
            display: 'flex',
            gap: 24,
            transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)',
            transform: `translateX(calc(-${active * 100}% / ${displayReviews.length} * ${displayReviews.length > 3 ? 1 : displayReviews.length}))`,
            width: 'max-content',
            paddingLeft: 24,
          }}
        >
          {displayReviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                width: 'min(360px, 80vw)',
                flexShrink: 0,
                background: bg,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${border}`,
                borderRadius: 20,
                padding: '28px 28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                boxShadow: isLight ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.3)',
                transition: 'all 300ms ease',
                opacity: i === active ? 1 : 0.7,
                transform: `scale(${i === active ? 1 : 0.97})`,
              }}
            >
              {/* Quote */}
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: isLight ? '#374151' : '#C8BEA8',
                fontStyle: 'italic',
              }}>
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C8A25C, #9B7A3D)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1rem', color: '#0D0D0F',
                    flexShrink: 0,
                  }}>
                    {r.avatar}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: isLight ? '#111827' : '#F2EDE2' }}>
                      {r.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: isLight ? '#6B7280' : '#9B7A3D' }}>
                      {r.location} · {r.date}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <StarRow n={r.rating} />
                  {r.verified && (
                    <span style={{ fontSize: '0.6rem', color: '#22C55E', display: 'block', marginTop: 4, letterSpacing: '0.05em' }}>
                      ✓ Achat vérifié
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
        {displayReviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === active ? '#C8A25C' : (isLight ? 'rgba(0,0,0,0.15)' : 'rgba(200,162,92,0.2)'),
              border: 'none',
              cursor: 'pointer',
              transition: 'all 300ms ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
