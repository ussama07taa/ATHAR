'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/api';


export interface CartItem {
  cartId: string;
  variant: {
    id: number;
    price: string;
    size: string;
  };
  productName: string;
  quantity: number;
}

interface CheckoutFormProps {
  cart: CartItem[];
  updateQty: (cartId: string, qty: number) => void;
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
      const res = await fetch(`${API_URL}/api/orders`, {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8, width: '100%', maxWidth: 280 }}>
          <a
            href={`https://wa.me/212755887106?text=Bonjour, je viens de passer la commande ${orderNumber}. Voici mon nom: ${form.customer_name}.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '12px 24px',
              borderRadius: '99px',
              background: '#25D366',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 300ms'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Confirmer sur WhatsApp
          </a>

          <button
            style={{
              padding: '12px 24px',
              borderRadius: '99px',
              background: 'transparent',
              color: '#C8BEA8',
              border: '1px solid rgba(200,162,92,0.3)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 300ms'
            }}
            onClick={() => { 
              setStatus('idle'); 
              setForm({ customer_name: '', customer_phone: '', customer_city: '' }); 
            }}
          >
            Nouvelle commande
          </button>
        </div>
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
              key={item.cartId}
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
                <button type="button" className="qty-btn" onClick={() => updateQty(item.cartId, item.quantity - 1)}>−</button>
                <span style={{ minWidth: 20, textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#F2EDE2' }}>{item.quantity}</span>
                <button type="button" className="qty-btn" onClick={() => updateQty(item.cartId, item.quantity + 1)}>+</button>
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
              value={form.customer_phone} 
              onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value }))}
              onBlur={() => {
                if (form.customer_phone.length > 8 && cart.length > 0) {
                  fetch(`${API_URL}/api/orders/abandoned`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      customer_phone: form.customer_phone,
                      customer_name: form.customer_name,
                      items: cart.map((i) => ({ product_variant_id: i.variant.id, quantity: i.quantity })),
                    }),
                  }).catch(() => {}); // silent fail
                }
              }} 
            />
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
