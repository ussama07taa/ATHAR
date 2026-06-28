'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { parseApiError } from '@/lib/api';
import { calcShipping, siteConfig } from '@/lib/site-config';
import { useTheme } from 'next-themes';

type Status = 'idle' | 'loading' | 'success' | 'error';

type AppliedPromo = {
  code: string;
  label: string;
  discount: number;
  shipping_amount: number;
  total: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_city: '',
    customer_quartier: '',
    customer_address: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [orderNumber, setOrderNumber] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoStatus, setPromoStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [promoError, setPromoError] = useState('');

  const subtotal = totalPrice;
  const discount = appliedPromo?.discount ?? 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = appliedPromo?.shipping_amount ?? calcShipping(afterDiscount);
  const finalTotal = appliedPromo?.total ?? afterDiscount + shipping;

  const handleApplyPromo = async () => {
    const code = promoCode.trim();
    if (!code || items.length === 0) return;

    setPromoStatus('loading');
    setPromoError('');

    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          code,
          items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, 'Code promo invalide'));

      setAppliedPromo({
        code: data.code,
        label: data.label,
        discount: data.discount,
        shipping_amount: data.shipping_amount ?? 0,
        total: data.total,
      });
      setPromoStatus('idle');
    } catch (err: unknown) {
      setAppliedPromo(null);
      setPromoError(err instanceof Error ? err.message : 'Code promo invalide');
      setPromoStatus('error');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
    setPromoStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Veuillez sélectionner au moins un produit.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          promo_code: appliedPromo?.code ?? (promoCode.trim() || undefined),
          items: items.map((i) => ({
            variant_id: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, 'Erreur serveur'));
      setOrderNumber(data.order_number);
      setWhatsappUrl(data.whatsapp_url ?? '');
      setStatus('success');
      clearCart();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur inattendue');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: isLight ? '#FFFFFF' : '#0D0D0F', transition: 'all 500ms' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: isLight ? '#F5F5F4' : '#1C1917', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '28px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(202,138,4,0.1)', border: '2px solid #CA8A04', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#CA8A04' }}>Commande confirmée !</h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: isLight ? '#44403C' : '#A8A29E', lineHeight: 1.7 }}>
            Votre commande <strong style={{ color: isLight ? '#111827' : '#F2EDE2' }}>{orderNumber}</strong> a été reçue. Notre équipe vous contactera sous 24h.
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: isLight ? '#44403C' : '#A8A29E', fontWeight: 500 }}>Mode de paiement: Cash à la livraison</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '10px' }}>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: '#fff', padding: '14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', transition: 'transform 200ms ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Confirmer sur WhatsApp
              </a>
            )}
            <Link href={`/suivi?order=${orderNumber}`} style={{ fontSize: '0.8rem', color: '#CA8A04', textDecoration: 'none', fontWeight: 600 }}>
              Suivre ma commande
            </Link>
            <button onClick={() => router.push('/')} style={{ background: isLight ? '#111827' : '#F2EDE2', color: isLight ? '#FFFFFF' : '#0D0D0F', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 200ms ease' }} onMouseOver={e => e.currentTarget.style.opacity = '0.8'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
              Retourner à la boutique
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  const formFields = [
    { id: 'customer_name', label: 'Nom complet *', placeholder: 'Ahmed Taaouati', type: 'text' },
    { id: 'customer_phone', label: 'Téléphone *', placeholder: '06 61 23 45 67', type: 'tel' },
    { id: 'customer_city', label: 'Ville *', placeholder: 'Tanger', type: 'text' },
    { id: 'customer_quartier', label: 'Quartier *', placeholder: 'Malabata, Centre-ville...', type: 'text' },
    { id: 'customer_address', label: 'Adresse complète *', placeholder: 'Rue, numéro, immeuble...', type: 'text' },
  ] as const;

  return (
    <main style={{ minHeight: '100dvh', background: isLight ? '#FFFFFF' : '#0D0D0F', padding: '40px 24px 80px', transition: 'all 500ms' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        
        {/* Order Summary */}
        <div style={{ background: isLight ? '#F5F5F4' : '#1C1917', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '24px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 24px', fontSize: '1rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2' }}>Votre commande</h2>

          {!mounted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px 0' }}>
               <div style={{ height: '40px', background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
               <div style={{ height: '40px', background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
            </div>
          ) : items.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.85rem', color: isLight ? '#44403C' : '#A8A29E', textAlign: 'center', padding: '24px 0' }}>
              Panier vide — <Link href="/catalogue" style={{ color: '#CA8A04', textDecoration: 'none', fontWeight: 600 }}>voir le catalogue</Link>
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map((item) => (
                  <div key={item.cartId} style={{ background: isLight ? '#FFFFFF' : '#0D0D0F', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2' }}>{item.productName}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.725rem', color: '#CA8A04', fontWeight: 600 }}>{item.variantName} × {item.quantity}</p>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2' }}>{(item.price * item.quantity).toFixed(2)} dh</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {appliedPromo ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', background: 'rgba(21, 128, 61, 0.05)', border: '1px solid rgba(21, 128, 61, 0.1)' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>{appliedPromo.code}</span>
                      <span style={{ fontSize: '0.7rem', color: '#15803d', marginLeft: '8px' }}>−{appliedPromo.label}</span>
                    </div>
                    <button type="button" onClick={handleRemovePromo} style={{ background: 'transparent', border: 'none', color: isLight ? '#44403C' : '#A8A29E', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}>Retirer</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Code promo" style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, background: isLight ? '#FFFFFF' : '#0D0D0F', color: isLight ? '#111827' : '#F2EDE2', outline: 'none', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} value={promoCode} onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }} />
                    <button type="button" onClick={handleApplyPromo} disabled={promoStatus === 'loading' || !promoCode.trim()} style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #CA8A04', background: 'transparent', color: '#CA8A04', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', opacity: (promoStatus === 'loading' || !promoCode.trim()) ? 0.5 : 1 }}>
                      {promoStatus === 'loading' ? '...' : 'Valider'}
                    </button>
                  </div>
                )}
                {promoError && <p style={{ margin: 0, fontSize: '0.7rem', color: '#ef4444', fontWeight: 500 }}>{promoError}</p>}
              </div>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: isLight ? '#44403C' : '#A8A29E' }}>
                  <span>Sous-total</span><span>{subtotal.toFixed(2)} dh</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                    <span>Réduction</span><span>−{discount.toFixed(2)} dh</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: isLight ? '#44403C' : '#A8A29E' }}>
                  <span>Livraison</span>
                  <span style={{ color: shipping === 0 ? '#16a34a' : 'inherit', fontWeight: shipping === 0 ? 600 : 'inherit' }}>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} dh`}</span>
                </div>
                {shipping > 0 && (
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#CA8A04', fontWeight: 500 }}>
                    Gratuite dès {siteConfig.shippingFreeThreshold} dh d&apos;achat
                  </p>
                )}
                <div style={{ marginTop: '8px', padding: '16px', borderRadius: '16px', background: isLight ? '#FFFFFF' : '#0D0D0F', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: isLight ? '#111827' : '#F2EDE2', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#CA8A04' }}>{finalTotal.toFixed(2)} dh</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Shipping Form */}
        <div style={{ background: isLight ? '#F5F5F4' : '#1C1917', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '24px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2' }}>Coordonnées de livraison</h2>
          <div style={{ width: '40px', height: '2px', background: '#CA8A04', marginBottom: '28px' }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {formFields.map(({ id, label, placeholder, type }) => (
              <div key={id}>
                <label htmlFor={id} style={{ display: 'block', fontSize: '0.725rem', color: isLight ? '#44403C' : '#A8A29E', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                <input id={id} type={type} required placeholder={placeholder} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, background: isLight ? '#FFFFFF' : '#0D0D0F', color: isLight ? '#111827' : '#F2EDE2', outline: 'none', fontSize: '0.85rem', transition: 'border-color 300ms ease' }} value={form[id as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))} />
              </div>
            ))}

            <AnimatePresence>
              {(status === 'error' || errorMsg) && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ margin: 0, fontSize: '0.8rem', color: '#ef4444', textAlign: 'center', fontWeight: 500 }}>{errorMsg}</motion.p>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: 'rgba(202,138,4,0.05)', borderRadius: '12px', border: '1px solid rgba(202,138,4,0.1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />
              </svg>
              <span style={{ fontSize: '0.65rem', color: '#A16207', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paiement à la livraison</span>
            </div>

            <button type="submit" disabled={status === 'loading' || items.length === 0 || !mounted} style={{ width: '100%', background: '#CA8A04', color: '#fff', border: 'none', padding: '18px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 300ms ease', boxShadow: '0 10px 25px rgba(202,138,4,0.25)', opacity: (status === 'loading' || items.length === 0 || !mounted) ? 0.4 : 1 }}>
              {status === 'loading' 
                ? 'Traitement...' 
                : !mounted 
                  ? 'Chargement...' 
                  : `Confirmer — ${finalTotal.toFixed(2)} dh`
              }
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
