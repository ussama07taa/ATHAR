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
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.23 8.23 0 004.84 1.55V7.04a4.85 4.85 0 01-1.07-.35z"/>
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
    grad: 'linear-gradient(135deg, #25D36622, #25D36608)',
    border: 'rgba(37,211,102,0.25)',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@athar.parfums',
    sub: 'Photos & nouveautés',
    href: 'https://instagram.com/athar.parfums',
    Icon: InstagramIcon,
    accent: '#E1306C',
    grad: 'linear-gradient(135deg, #E1306C22, #F5651508)',
    border: 'rgba(225,48,108,0.25)',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    value: '@atharparfums',
    sub: 'Vidéos & tendances',
    href: 'https://tiktok.com/@atharparfums',
    Icon: TikTokIcon,
    accent: '#010101',
    grad: 'linear-gradient(135deg, #69C9D022, #EE1D5208)',
    border: 'rgba(105,201,208,0.3)',
  },
  {
    id: 'hours',
    label: 'Horaires',
    value: 'Lun – Sam : 10h – 21h',
    sub: 'Dim : 11h – 19h',
    href: null,
    Icon: ClockIcon,
    accent: '#C8A25C',
    grad: 'linear-gradient(135deg, #C8A25C18, #C8A25C06)',
    border: 'rgba(200,162,92,0.25)',
  },
];

export default function ContactPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  const isLight = mounted && resolvedTheme === 'light';

  const getInputStyle = (name: string) => ({
    width: '100%',
    padding: '14px 18px',
    borderRadius: 12,
    border: `1.5px solid ${focused === name ? '#C8A25C' : isLight ? 'rgba(200,162,92,0.2)' : 'rgba(200,162,92,0.15)'}`,
    background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(26,26,29,0.7)',
    color: isLight ? '#111827' : '#F2EDE2',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
    boxShadow: focused === name ? '0 0 0 3px rgba(200,162,92,0.12)' : 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Bonjour Athar 👋\n\nNom: ${form.name}\nEmail: ${form.email}\nTél: ${form.phone}\n\nMessage:\n${form.message}`
    );
    window.open(`https://wa.me/212600000000?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <main style={{ minHeight: '100vh' }}>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        paddingTop: 40,
        paddingBottom: 80,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: 'center',
        background: isLight
          ? 'linear-gradient(180deg, rgba(200,162,92,0.06) 0%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(200,162,92,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(200,162,92,0.1)',
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, margin: '0 0 16px', color: isLight ? '#111827' : '#F2EDE2', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Parlons Parfum
          </h1>
          <div style={{ width: 56, height: 2, background: 'linear-gradient(90deg, transparent, #C8A25C, transparent)', margin: '0 auto 20px' }} />
          <p style={{ maxWidth: 480, margin: '0 auto', fontSize: '1rem', color: isLight ? '#6B7280' : '#9B7A3D', lineHeight: 1.7 }}>
            Notre équipe est disponible <strong style={{ color: '#C8A25C' }}>7j/7</strong> pour vous conseiller et vous accompagner dans votre choix.
          </p>
        </motion.div>
      </section>

      {/* ── MAIN GRID ───────────────────────────────────────── */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 48 }}>

          {/* LEFT — Contact Channels */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ marginBottom: 8 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: isLight ? '#111827' : '#F2EDE2', margin: '0 0 8px' }}>
                Nous rejoindre
              </h2>
              <p style={{ fontSize: '0.875rem', color: isLight ? '#6B7280' : '#9B7A3D', margin: 0, lineHeight: 1.6 }}>
                Pour toute commande, question ou conseil — choisissez votre canal préféré.
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
                      gap: 18,
                      padding: '18px 22px',
                      borderRadius: 18,
                      background: isLight ? c.grad : c.grad.replace('22', '15').replace('08', '04'),
                      border: `1px solid ${c.border}`,
                      textDecoration: 'none',
                      transition: 'transform 200ms ease, box-shadow 200ms ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${c.border}`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: 48, height: 48,
                      borderRadius: 14,
                      background: c.grad,
                      border: `1px solid ${c.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: c.accent,
                      flexShrink: 0,
                    }}>
                      <c.Icon />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '0.7rem', fontWeight: 700, color: isLight ? '#9B7A3D' : '#C8A25C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.label}</p>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: c.accent }}>{c.value}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: isLight ? '#6B7280' : '#6B6654' }}>{c.sub}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
                      <path d="M7 17L17 7M17 7H7M17 7v10"/>
                    </svg>
                  </a>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: '18px 22px',
                    borderRadius: 18,
                    background: isLight ? c.grad : c.grad.replace('22', '15').replace('08', '04'),
                    border: `1px solid ${c.border}`,
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: c.grad, border: `1px solid ${c.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: c.accent, flexShrink: 0,
                    }}>
                      <c.Icon />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '0.7rem', fontWeight: 700, color: isLight ? '#9B7A3D' : '#C8A25C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.label}</p>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.95rem', color: isLight ? '#111827' : '#F2EDE2' }}>{c.value}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: isLight ? '#6B7280' : '#6B6654' }}>{c.sub}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* COD Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{
                padding: '20px 22px', borderRadius: 18,
                background: 'linear-gradient(135deg, rgba(200,162,92,0.1), rgba(155,122,61,0.15))',
                border: '1px solid rgba(200,162,92,0.3)',
                marginTop: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(200,162,92,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8A25C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <p style={{ margin: 0, fontWeight: 800, color: '#C8A25C', fontSize: '0.9rem' }}>Paiement à la livraison (COD)</p>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: isLight ? '#6B7280' : '#9B7A3D', lineHeight: 1.6 }}>
                Commandez en toute confiance — vous payez uniquement à la réception de votre colis.
              </p>
              <Link href="/faq" style={{ fontSize: '0.78rem', color: '#C8A25C', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                En savoir plus → FAQ
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — Form */}
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
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    padding: 40, borderRadius: 24,
                    background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(26,26,29,0.8)',
                    border: '1px solid rgba(200,162,92,0.2)',
                    boxShadow: isLight ? '0 8px 40px rgba(0,0,0,0.06)' : '0 8px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #22C55E22, #22C55E08)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: '2rem' }}>✅</div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: isLight ? '#111827' : '#F2EDE2', marginBottom: 12 }}>Message envoyé !</h3>
                  <p style={{ color: '#9B7A3D', lineHeight: 1.7, marginBottom: 28 }}>Votre message WhatsApp a été préparé. Notre équipe vous répondra très rapidement.</p>
                  <button onClick={() => setSent(false)} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #C8A25C, #9B7A3D)', border: 'none', borderRadius: 12, color: '#0D0D0F', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>
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
                    background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(26,26,29,0.75)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: `1px solid ${isLight ? 'rgba(200,162,92,0.2)' : 'rgba(200,162,92,0.15)'}`,
                    borderRadius: 24,
                    padding: '36px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    boxShadow: isLight ? '0 8px 40px rgba(0,0,0,0.06)' : '0 8px 40px rgba(0,0,0,0.25)',
                  }}
                >
                  <div>
                    <h2 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.25rem', color: isLight ? '#111827' : '#F2EDE2' }}>
                      Envoyer un message
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#9B7A3D', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#25D366' }}>●</span> Redirige vers WhatsApp automatiquement
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#C8A25C', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Nom *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Votre nom" onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} style={getInputStyle('name')} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#C8A25C', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Téléphone</label>
                      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+212 6..." onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} style={getInputStyle('phone')} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#C8A25C', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="votre@email.com" onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} style={getInputStyle('email')} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#C8A25C', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Message *</label>
                    <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Bonjour, je voulais me renseigner sur..." rows={5} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} style={{ ...getInputStyle('message'), resize: 'vertical', lineHeight: 1.65 }} />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.015, boxShadow: '0 12px 32px rgba(200,162,92,0.35)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '16px',
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #C8A25C, #9B7A3D)',
                      color: '#0D0D0F', fontWeight: 900, fontSize: '0.92rem',
                      letterSpacing: '0.05em', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      boxShadow: '0 4px 20px rgba(200,162,92,0.2)',
                    }}
                  >
                    <WhatsAppIcon />
                    Envoyer via WhatsApp
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── BOUTIQUE PHYSIQUE ───────────────────────────────── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 100px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            borderRadius: 28, overflow: 'hidden',
            border: `1px solid ${isLight ? 'rgba(200,162,92,0.2)' : 'rgba(200,162,92,0.15)'}`,
            boxShadow: isLight ? '0 8px 48px rgba(0,0,0,0.07)' : '0 8px 48px rgba(0,0,0,0.35)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '28px 36px',
            background: isLight
              ? 'linear-gradient(135deg, rgba(200,162,92,0.06), rgba(255,255,255,0.95))'
              : 'linear-gradient(135deg, rgba(200,162,92,0.09), rgba(22,22,26,0.98))',
            borderBottom: '1px solid rgba(200,162,92,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(200,162,92,0.12)', border: '1px solid rgba(200,162,92,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8A25C', flexShrink: 0 }}>
                <MapPinIcon />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8A25C' }}>Boutique Physique</p>
                <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#111827' : '#F2EDE2' }}>Athar — Tanger</h2>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#9B7A3D' }}>Beni Makada, Arad Dawla — Tanger, Maroc</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: 20 }}>
                {[{ icon: <ClockIcon />, text: 'Lun–Sam : 10h–21h' }, { icon: <ClockIcon />, text: 'Dim : 11h–19h' }].map(h => (
                  <div key={h.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#C8A25C', opacity: 0.7, width: 16 }}>{h.icon}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#374151' : '#C8BEA8' }}>{h.text}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://maps.google.com/?q=Beni+Makada+Tanger+Maroc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 20px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #C8A25C, #9B7A3D)',
                  color: '#0D0D0F', fontWeight: 800, fontSize: '0.8rem',
                  textDecoration: 'none', letterSpacing: '0.04em',
                }}
              >
                <MapPinIcon /> Ouvrir dans Maps
              </a>
            </div>
          </div>

          {/* Map */}
          <div style={{ height: 400, position: 'relative' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.0!2d-5.8220!3d35.7685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b875d0b0aaaaab%3A0x1!2sBeni+Makada%2C+Tanger!5e0!3m2!1sfr!2sma!4v1700000000000"
              width="100%" height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Athar Boutique — Beni Makada, Tanger"
            />
          </div>

          {/* Footer strip */}
          <div style={{
            padding: '18px 36px',
            background: isLight ? 'rgba(200,162,92,0.04)' : 'rgba(13,13,15,0.9)',
            borderTop: '1px solid rgba(200,162,92,0.1)',
            display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center',
          }}>
            {[
              { icon: '🚗', text: 'Parking disponible à proximité' },
              { icon: '👃', text: 'Essayez avant d\'acheter en boutique' },
              { icon: '💳', text: 'COD — Paiement à la réception' },
            ].map(item => (
              <span key={item.text} style={{ fontSize: '0.82rem', color: isLight ? '#374151' : '#C8BEA8', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

    </main>
  );
}
