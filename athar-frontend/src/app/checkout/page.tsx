'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { parseApiError } from '@/lib/api';
import { calcShipping, siteConfig } from '@/lib/site-config';

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
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

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
      <main className="min-h-[80vh] flex items-center justify-center py-10 px-6 bg-[#FAFAFA] dark:bg-[#0D0D0F] transition-colors duration-500">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#1A1A1D]/95 border border-[#C8A25C]/25 rounded-[28px] p-12 max-w-[480px] w-full text-center flex flex-col items-center gap-5 shadow-2xl transition-colors duration-500">
          <div className="w-18 h-18 rounded-full bg-[#C8A25C]/10 border-2 border-[#C8A25C] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8A25C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="m-0 text-2xl font-bold text-[#C8A25C]">Commande confirmée !</h1>
          <p className="m-0 text-sm text-gray-600 dark:text-[#C8BEA8] leading-relaxed">
            Votre commande <strong className="text-gray-900 dark:text-[#F2EDE2]">{orderNumber}</strong> a été reçue. Notre équipe vous contactera sous 24h.
          </p>
          <p className="m-0 text-xs text-gray-500 dark:text-[#6B6654]">Paiement à la livraison (COD)</p>
          <div className="flex flex-col gap-3 w-full">
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-gold text-center no-underline">
                Confirmer sur WhatsApp
              </a>
            )}
            <Link href={`/suivi?order=${orderNumber}`} className="text-xs text-[#C8A25C] hover:underline">
              Suivre ma commande
            </Link>
            <button onClick={() => router.push('/')} className="btn-gold mt-1 opacity-85">
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
    <main className="min-h-[100dvh] bg-[#FAFAFA] dark:bg-[#0D0D0F] pt-10 pb-20 px-6 transition-colors duration-500">
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#C8A25C]/20 rounded-3xl p-7 shadow-lg transition-colors duration-500">
          <h2 className="m-0 mb-5 text-base font-bold text-gray-900 dark:text-[#F2EDE2] transition-colors">Votre commande</h2>

          {items.length === 0 ? (
            <p className="m-0 text-sm text-gray-500 dark:text-[#6B6654] text-center py-6">
              Panier vide — <Link href="/catalogue" className="text-[#C8A25C] hover:underline">voir le catalogue</Link>
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.variantId} className="bg-gray-50 dark:bg-[#C8A25C]/5 border border-gray-100 dark:border-[#C8A25C]/10 rounded-xl p-3 px-4 flex justify-between items-center transition-colors">
                    <div>
                      <p className="m-0 text-sm font-semibold text-gray-800 dark:text-[#F2EDE2] transition-colors">{item.productName}</p>
                      <p className="m-0 mt-0.5 text-[0.7rem] text-[#9B7A3D]">{item.variantName} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#C8A25C]">{(item.price * item.quantity).toFixed(2)} MAD</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {appliedPromo ? (
                  <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-500/30 transition-colors">
                    <div>
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">{appliedPromo.code}</span>
                      <span className="text-[0.7rem] text-[#9B7A3D] ml-2">−{appliedPromo.label}</span>
                    </div>
                    <button type="button" onClick={handleRemovePromo} className="bg-transparent border-none text-gray-500 dark:text-[#C8BEA8] text-[0.7rem] cursor-pointer hover:underline">Retirer</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" placeholder="Code promo" className="athar-input flex-1 uppercase" value={promoCode} onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }} />
                    <button type="button" onClick={handleApplyPromo} disabled={promoStatus === 'loading' || !promoCode.trim()} className="px-4 rounded-xl border border-[#C8A25C]/40 bg-[#C8A25C]/10 text-[#C8A25C] text-xs font-semibold cursor-pointer hover:bg-[#C8A25C]/20 transition-colors disabled:opacity-50">
                      {promoStatus === 'loading' ? '...' : 'Appliquer'}
                    </button>
                  </div>
                )}
                {promoError && <p className="m-0 text-[0.72rem] text-red-500 items-center">{promoError}</p>}
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <div className="flex justify-between text-[0.78rem] text-gray-600 dark:text-[#C8BEA8] transition-colors">
                  <span>Sous-total</span><span>{subtotal.toFixed(2)} MAD</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[0.78rem] text-green-600 dark:text-green-400 transition-colors">
                    <span>Réduction</span><span>−{discount.toFixed(2)} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-[0.78rem] text-gray-600 dark:text-[#C8BEA8] transition-colors">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} MAD`}</span>
                </div>
                {shipping > 0 && (
                  <p className="m-0 text-[0.68rem] text-[#9B7A3D]">
                    Gratuite dès {siteConfig.shippingFreeThreshold} MAD
                  </p>
                )}
                <div className="mt-1 p-3.5 px-4 rounded-xl bg-gray-50 dark:bg-[#C8A25C]/10 border border-gray-200 dark:border-[#C8A25C]/20 flex justify-between items-center transition-colors">
                  <span className="text-sm text-gray-700 dark:text-[#C8BEA8] font-medium transition-colors">Total</span>
                  <span className="text-xl font-extrabold text-[#C8A25C]">{finalTotal.toFixed(2)} MAD</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#C8A25C]/20 rounded-3xl p-7 shadow-lg transition-colors duration-500">
          <h2 className="m-0 mb-1.5 text-base font-bold text-gray-900 dark:text-[#F2EDE2] transition-colors">Livraison & coordonnées</h2>
          <div className="w-9 h-0.5 bg-gradient-to-r from-[#C8A25C] to-transparent mb-5" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formFields.map(({ id, label, placeholder, type }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-[0.72rem] text-gray-600 dark:text-[#C8BEA8] mb-1.5 font-medium transition-colors">{label}</label>
                <input id={id} type={type} required placeholder={placeholder} className="athar-input transition-colors duration-300" value={form[id as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))} />
              </div>
            ))}

            <AnimatePresence>
              {(status === 'error' || errorMsg) && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="m-0 text-sm text-red-500 text-center">{errorMsg}</motion.p>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[0.68rem] text-[#9B7A3D]">Paiement à la livraison — aucune carte requise</span>
            </div>

            <button type="submit" className="btn-gold disabled:opacity-40" disabled={status === 'loading' || items.length === 0}>
              {status === 'loading' ? 'Traitement en cours...' : `Confirmer — ${finalTotal.toFixed(2)} MAD`}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
