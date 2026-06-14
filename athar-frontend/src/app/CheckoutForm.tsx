'use client';

import { useState } from 'react';
import { CartItem } from './Storefront';

interface CheckoutFormProps {
  cart: CartItem[];
  updateQty: (variantId: number, qty: number) => void;
  onOrderSuccess: () => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function CheckoutForm({ cart, updateQty, onOrderSuccess }: CheckoutFormProps) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_city: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const total = cart.reduce(
    (sum, i) => sum + parseFloat(i.variant.price) * i.quantity,
    0
  );

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) { setErrorMsg('Veuillez sélectionner au moins un produit.'); return; }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart.map((i) => ({ 
            product_variant_id: i.variant.id, 
            quantity: i.quantity 
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Erreur serveur');
      setOrderNumber(data.order_number);
      setStatus('success');
      onOrderSuccess();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur inattendue');
      setStatus('error');
    }
  };

  /* ── Success screen ──────────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="glass-card p-8 text-center fade-up" style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="27" stroke="#C8A25C" strokeWidth="2" fill="rgba(200,162,92,0.08)" />
          <path d="M18 29l7 7 13-13" stroke="#C8A25C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 style={{ color: '#C8A25C', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Commande confirmée</h3>
        <p style={{ color: '#C8BEA8', fontSize: '0.875rem', margin: 0 }}>
          Votre commande <strong style={{ color: '#F2EDE2' }}>{orderNumber}</strong> a été reçue.<br />
          Paiement à la livraison (COD).
        </p>
        <button
          className="btn-gold"
          style={{ maxWidth: 200, marginTop: 8 }}
          onClick={() => { 
            setStatus('idle'); 
            setForm({ customer_name: '', customer_phone: '', customer_city: '' }); 
          }}
        >
          Nouvelle commande
        </button>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Cart Summary */}
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: '#C8A25C', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Votre sélection</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cart.length === 0 && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B6654', textAlign: 'center', padding: '12px 0' }}>
              Aucun produit sélectionné.
            </p>
          )}
          {cart.map((item) => (
            <div
              key={item.variant.id}
              className="glass-card selected"
              style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#C8A25C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.productName}
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9B7A3D' }}>{item.variant.size} — {item.variant.price} MAD</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button type="button" className="qty-btn" onClick={() => updateQty(item.variant.id, item.quantity - 1)}>−</button>
                <span style={{ minWidth: 20, textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#F2EDE2' }}>{item.quantity}</span>
                <button type="button" className="qty-btn" onClick={() => updateQty(item.variant.id, item.quantity + 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      {cart.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'rgba(200,162,92,0.07)', border: '1px solid rgba(200,162,92,0.2)' }}>
          <span style={{ fontSize: '0.8rem', color: '#C8BEA8', fontWeight: 500 }}>Total estimé</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#C8A25C' }}>{total.toFixed(2)} MAD</span>
        </div>
      )}

      {/* Customer info */}
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: '#C8A25C', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Vos coordonnées</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label htmlFor="customer_name" style={{ display: 'block', fontSize: '0.75rem', color: '#C8BEA8', marginBottom: 4 }}>Nom complet *</label>
            <input id="customer_name" className="athar-input" required placeholder="Ahmed Taaouati"
              value={form.customer_name} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="customer_phone" style={{ display: 'block', fontSize: '0.75rem', color: '#C8BEA8', marginBottom: 4 }}>Téléphone *</label>
            <input id="customer_phone" className="athar-input" required placeholder="06 61 23 45 67" type="tel"
              value={form.customer_phone} onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="customer_city" style={{ display: 'block', fontSize: '0.75rem', color: '#C8BEA8', marginBottom: 4 }}>Ville *</label>
            <input id="customer_city" className="athar-input" required placeholder="Tanger"
              value={form.customer_city} onChange={(e) => setForm((f) => ({ ...f, customer_city: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* Error */}
      {(status === 'error' || errorMsg) && (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#E57373', textAlign: 'center' }}>{errorMsg}</p>
      )}

      {/* COD badge + Submit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A25C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" />
          </svg>
          <span style={{ fontSize: '0.75rem', color: '#9B7A3D', fontWeight: 500 }}>Paiement à la livraison — aucune carte requise</span>
        </div>
        <button type="submit" className="btn-gold" disabled={status === 'loading'}>
          {status === 'loading' ? 'Traitement...' : 'Commander maintenant'}
        </button>
      </div>
    </form>
  );
}
