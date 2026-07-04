'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { siteConfig, whatsappUrl } from '@/lib/site-config';

// ── Official SVG Brand Icons ────────────────────────────────
const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.23 8.23 0 004.84 1.55V7.04a4.85 4.85 0 01-1.07-.35z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const contacts = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: siteConfig.phone,
    sub: 'Réponse en moins de 2h',
    href: whatsappUrl(),
    Icon: WhatsAppIcon,
    accent: '#25D366',
    grad: 'rgba(37, 211, 102, 0.05)',
    border: 'rgba(37, 211, 102, 0.2)',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@atha_rfragrances',
    sub: 'Photos & nouveautés',
    href: 'https://www.instagram.com/atha_rfragrances/',
    Icon: InstagramIcon,
    accent: '#E1306C',
    grad: 'rgba(225, 48, 108, 0.05)',
    border: 'rgba(225, 48, 108, 0.2)',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    value: '@atha_rfragrances',
    sub: 'Vidéos & tendances',
    href: 'https://www.tiktok.com/@atha_rfragrances?is_from_webapp=1&sender_device=pc',
    Icon: TikTokIcon,
    accent: '#CA8A04',
    grad: 'rgba(105, 201, 208, 0.05)',
    border: 'rgba(105, 201, 208, 0.2)',
  },
  {
    id: 'hours',
    label: 'Horaires',
    value: 'Lun – Sam : 10h – 21h',
    sub: 'Dim : 11h – 19h',
    href: null,
    Icon: ClockIcon,
    accent: '#CA8A04',
    grad: 'rgba(202, 138, 4, 0.05)',
    border: 'rgba(202, 138, 4, 0.2)',
  },
];

import { notFound } from 'next/navigation';

export default function ContactPage() {
  notFound();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const getInputStyle = (name: string) => ({
    width: '100%',
    padding: '16px 20px',
    borderRadius: 14,
    border: `1.5px solid ${focused === name ? '#CA8A04' : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)')}`,
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 300ms ease',
    boxShadow: focused === name ? '0 0 0 4px rgba(202, 138, 4, 0.1)' : 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Bonjour Athar 👋\n\nNom: ${form.name}\nEmail: ${form.email}\nTél: ${form.phone}\n\nMessage:\n${form.message}`
    );
    window.open(`https://wa.me/${siteConfig.whatsapp}?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <main style={{ minHeight: '100vh', background: isLight ? '#FFFFFF' : '#0D0D0F', transition: 'all 500ms' }}>

      {/* ── HERO Section ── */}
      <section className="theme-bg-card theme-border" style={{
        padding: '80px 24px',
        textAlign: 'center',
        borderBottom: '1px solid',
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="theme-title" style={{ 
            fontSize: 'clamp(3rem, 7vw, 5rem)', 
            fontWeight: 800, 
            margin: '0 0 20px', 
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em', 
            lineHeight: 1.1 
          }}>
            Parlons Parfum
          </h1>
          <p className="theme-text" style={{ maxWidth: 550, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8, fontWeight: 500 }}>
            L&apos;équipe Athar est à votre entière disposition gratuitement pour vous conseiller et vous accompagner dans votre voyage olfactif.
          </p>
          <div style={{ width: 80, height: 3, background: '#CA8A04', margin: '32px auto', borderRadius: 2 }} />
        </motion.div>
      </section>

      {/* ── Main Content Grid ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 64 }}>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <div style={{ marginBottom: 12 }}>
              <h2 className="theme-title" style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', margin: '0 0 12px' }}>
                Nous contacter
              </h2>
              <p className="theme-text" style={{ fontSize: '0.95rem', margin: 0, lineHeight: 1.7 }}>
                Choisissez le moyen qui vous convient le mieux pour échanger avec nos experts.
              </p>
            </div>

            {contacts.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              >
                {c.href ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      padding: '20px 24px',
                      borderRadius: 20,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                      border: '1px solid'
                    }}
                    className="theme-bg-card theme-border"
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = c.accent;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = c.border;
                    }}
                  >
                    <div style={{
                      width: 52, height: 52,
                      borderRadius: 14,
                      background: c.grad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: c.accent,
                      flexShrink: 0,
                    }}>
                      <c.Icon />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px', fontSize: '0.7rem', fontWeight: 800, color: '#CA8A04', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{c.label}</p>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }} className="theme-title">{c.value}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: isLight ? '#44403C' : '#A8A29E' }}>{c.sub}</p>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }} className="theme-text">
                      <path d="M7 17L17 7M17 7H7M17 7v10"/>
                    </svg>
                  </a>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    padding: '20px 24px',
                    borderRadius: 20,
                    border: '1px solid'
                  }}
                  className="theme-bg-card theme-border"
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: c.grad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: c.accent, flexShrink: 0,
                    }}>
                      <c.Icon />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: '0.7rem', fontWeight: 800, color: '#CA8A04', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{c.label}</p>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '1.05rem' }} className="theme-title">{c.value}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: isLight ? '#44403C' : '#A8A29E' }}>{c.sub}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* COD Promo-like Box */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{
                padding: '28px', borderRadius: 24,
                background: 'rgba(202, 138, 4, 0.05)',
                border: '1px solid rgba(202, 138, 4, 0.2)',
                marginTop: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(202, 138, 4, 0.1)', border: '1px solid rgba(202, 138, 4, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <p style={{ margin: 0, fontWeight: 800, color: '#CA8A04', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Livraison COD Express</p>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '0.875rem', lineHeight: 1.6 }} className="theme-text">
                Commandez en ligne et payez uniquement à la livraison. Nous livrons partout au Maroc en un temps record.
              </p>
              <Link href="/faq" style={{ fontSize: '0.8rem', color: '#CA8A04', textDecoration: 'none', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                En savoir plus →
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    height: '100%', minHeight: 500, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    padding: 48, borderRadius: 28,
                    background: isLight ? '#F5F5F4' : '#1C1917',
                    border: '1px solid #CA8A04',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', border: '2px solid #22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontSize: '2.5rem' }}>✅</div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 16 }} className="theme-title">Message en route !</h3>
                  <p className="theme-text" style={{ lineHeight: 1.8, marginBottom: 32, fontSize: '1rem' }}>Votre demande a été préparée pour WhatsApp. Notre équipe reviendra vers vous très prochainement.</p>
                  <button onClick={() => setSent(false)} style={{ padding: '16px 40px', background: '#CA8A04', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Nouveau message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                    border: '1px solid'
                  }}
                  className="theme-bg-card theme-border"
                >
                  <div>
                    <h2 style={{ margin: '0 0 10px', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'var(--font-display)' }} className="theme-title">
                      Formulaire Direct
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#CA8A04', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      <span style={{ color: '#25D366' }}>●</span> Redirection WhatsApp instantanée
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#CA8A04', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Nom complet *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ahmed Tazi" onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} style={getInputStyle('name')} className="theme-bg-card theme-title" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#CA8A04', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Téléphone *</label>
                      <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="06..." onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} style={getInputStyle('phone')} className="theme-bg-card theme-title" />
                    </div>
                  </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#CA8A04', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Votre Message *</label>
                      <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Comment pouvons-nous vous aider ?" rows={6} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} style={{ ...getInputStyle('message'), resize: 'none', lineHeight: 1.7 }} className="theme-bg-card theme-title" />
                    </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '18px',
                      borderRadius: 14,
                      background: '#CA8A04',
                      color: '#FFFFFF', fontWeight: 800, fontSize: '0.95rem',
                      letterSpacing: '0.15em', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                      boxShadow: '0 12px 30px rgba(202,138,4,0.25)',
                      transition: 'all 300ms ease',
                      textTransform: 'uppercase'
                    }}
                  >
                    <WhatsAppIcon />
                    Confirmer sur WhatsApp
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── Visual Map Strip ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto 120px', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            borderRadius: 32, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
            border: '1px solid'
          }}
          className="theme-bg-card theme-border"
        >
          <div className="theme-border" style={{
            padding: '40px',
            borderBottom: '1px solid',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div className="theme-border" style={{ width: 64, height: 64, borderRadius: 20, background: isLight ? '#FFFFFF' : '#0D0D0F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CA8A04', flexShrink: 0, border: '1px solid' }}>
                <MapPinIcon />
              </div>
              <div>
                <p style={{ margin: '0 0 6px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#CA8A04' }}>Boutique Physique</p>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }} className="theme-title">Athar — Tanger</h2>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }} className="theme-title">Beni Makada, Arad Dawla</p>
                <p style={{ margin: 0, fontSize: '0.8rem' }} className="theme-text">Tanger – Maroc</p>
              </div>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '16px 28px', borderRadius: 12,
                  background: isLight ? '#111827' : '#F2EDE2',
                  color: isLight ? '#FFFFFF' : '#0D0D0F', fontWeight: 800, fontSize: '0.85rem',
                  textDecoration: 'none', letterSpacing: '0.1em',
                  transition: 'opacity 200ms ease',
                  textTransform: 'uppercase'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                Itinéraire
              </a>
            </div>
          </div>

          <div style={{ height: 450, position: 'relative', filter: 'grayscale(0.2) contrast(1.1)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.3!2d-5.8!3d35.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAthar+Fragrances!5e0!3m2!1sfr!2sma!4v1700000000000"
              width="100%" height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Athar Boutique Tanger"
            />
          </div>
        </motion.div>
      </section>

    </main>
  );
}
