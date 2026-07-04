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

// ── Security: strip HTML tags, script injections, and special chars
function sanitize(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'`{}()\[\]\\]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 256);
}

function sanitizeName(value: string): string {
  return value.replace(/[^a-zA-ZÀ-ÿ\s'\-\.]/g, '').slice(0, 100);
}

function sanitizePhone(value: string): string {
  return value.replace(/[^\d\s\+\-\(\)]/g, '').slice(0, 20);
}

// ── Morocco cities + quartiers data
const MOROCCO_CITIES: Record<string, string[]> = {
  'Casablanca': ['Ain Chock', 'Ain Sebaa', 'Al Fida', 'Anfa', "Ben M'Sick", 'Bernoussi', 'Bourgogne', 'Gauthier', 'Hay Hassani', 'Hay Mohammadi', 'Maârif', 'Mers Sultan', 'Moulay Rachid', 'Roches Noires', 'Sidi Belyout', 'Sidi Bernoussi', 'Sidi Moumen', 'Université'],
  'Rabat': ['Agdal', 'Aviation', 'Centre-ville', 'Diour Jamaa', 'Hassan', 'Hay Riad', 'Instituts', 'Océan', 'Orangers', 'Souissi', 'Takaddoum', 'Temara', 'Yacoub El Mansour'],
  'Marrakech': ['Agdal', 'Centre-ville', 'Daoudiate', 'Guéliz', 'Hivernage', 'Médina', 'Mellah', "M'Hamid", 'Sidi Youssef Ben Ali', 'Tamansourt', 'Targa'],
  'Fès': ['Ain Chkef', 'Aouinet Hajjaj', 'Centre-ville', 'Fès El Bali', 'Fès El Jdid', 'Médina', 'Narjisse', 'Saiss', 'Zouagha'],
  'Tanger': ['Achakar', 'Boubana', 'Centre-ville', 'Charf', 'Gzennnaya', 'Malabata', 'Mesnana', 'Moujahidine', "M'Ghogha", 'Place de France', 'Port', 'Route de Tétouan'],
  'Agadir': ['Anza', 'Centre-ville', 'Hay Mohammadi', 'Inezgane', 'Nassim', 'Nouveau Talborjt', 'Tikiouine', 'Tilila'],
  'Meknès': ['Al Hamriyae', 'Centre-ville', 'Hamriya', 'Isly', 'Médina', 'Mellah', 'Mikou', 'Nouvelle ville', 'Wislane'],
  'Tétouan': ['Azla', 'Centre-ville', 'Martil', 'Médina', "M'diq", 'Quartier Espagnol', 'Sania Ramel'],
  'Oujda': ['Al Qods', 'Centre-ville', 'Hay Al Qods', 'Isly', 'Lazaret', 'Médina', 'Sidi Maafa'],
  'Kénitra': ['Ancien Kénitra', 'Belle Vue', 'Centre-ville', 'Hay Salam', 'Médina', 'Sebou'],
  'El Jadida': ['Azemmour', 'Centre-ville', 'Haouzia', 'Médina', 'Sidi Bouzid'],
  'Safi': ['Centre-ville', 'Hay Ennahda', 'Lamharza', 'Médina'],
  'Nador': ['Arkmane', 'Centre-ville', 'Kariat Arkmane', 'Médina'],
  'Beni Mellal': ['Centre-ville', 'El Kasba', 'Hay Ziane'],
  'Settat': ['Centre-ville', 'Guisser'],
  'Mohammedia': ['Centre-ville', 'Hay Ennakhil', 'Sahel'],
  'Laâyoune': ['Centre-ville', 'Hay Maâta', 'Laâyoune Plage'],
  'Khouribga': ['Centre-ville', 'Hay Elkods'],
  'Ouarzazate': ['Centre-ville', 'Hay Salam', 'Tabounte'],
  'Taza': ['Centre-ville', 'Hay El Bader', 'Médina'],
  'Autre': ['Autre quartier'],
};

export default function CheckoutForm({ cart, updateQty, onOrderSuccess }: CheckoutFormProps) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_city: '',
    customer_address: '',
    customer_quartier: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const total = cart.reduce(
    (sum: number, i: CartItem) => sum + parseFloat(i.variant.price) * i.quantity,
    0
  );

  const quartiers = form.customer_city ? (MOROCCO_CITIES[form.customer_city] || []) : [];

  const handleField = (field: keyof typeof form, value: string, cleanFn?: (v: string) => string) => {
    const clean = cleanFn ? cleanFn(value) : sanitize(value);
    setForm((f) => ({ ...f, [field]: clean }));
  };

  const isValidPhone = (phone: string) => /^(\+212|0)([ \-]?\d){9}$/.test(phone.replace(/\s/g, ''));

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) { setErrorMsg('Veuillez sélectionner au moins un produit.'); return; }
    if (!isValidPhone(form.customer_phone)) { setErrorMsg('Numéro de téléphone invalide (ex: 06 12 34 56 78)'); return; }
    if (!form.customer_city) { setErrorMsg('Veuillez sélectionner votre ville.'); return; }
    if (!form.customer_quartier) { setErrorMsg('Veuillez sélectionner votre quartier.'); return; }

    setStatus('loading');
    setErrorMsg('');
    try {
      const payload = {
        customer_name: sanitizeName(form.customer_name),
        customer_phone: sanitizePhone(form.customer_phone),
        customer_city: form.customer_city,
        customer_address: sanitize(form.customer_address),
        customer_quartier: form.customer_quartier,
        items: cart.map((i: CartItem) => ({
          variant_id: i.variant.id,
          quantity: i.quantity,
        })),
      };
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
            style={{ padding: '12px 24px', borderRadius: '99px', background: '#25D366', color: '#fff', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 300ms' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Confirmer sur WhatsApp
          </a>
          <button
            style={{ padding: '12px 24px', borderRadius: '99px', background: 'transparent', color: '#C8BEA8', border: '1px solid rgba(200,162,92,0.3)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 300ms' }}
            onClick={() => {
              setStatus('idle');
              setForm({ customer_name: '', customer_phone: '', customer_city: '', customer_address: '', customer_quartier: '' });
            }}
          >
            Nouvelle commande
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────── */
  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid rgba(200,162,92,0.15)',
    background: 'rgba(255,255,255,0.04)',
    color: '#F2EDE2',
    fontSize: '0.875rem',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C8A25C' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '36px',
    cursor: 'pointer',
    outline: 'none',
  };

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
          {cart.map((item: CartItem) => (
            <div key={item.cartId} className="glass-card selected" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Nom */}
          <div>
            <label htmlFor="customer_name" style={{ display: 'block', fontSize: '0.75rem', color: '#C8BEA8', marginBottom: 4 }}>Nom complet *</label>
            <input
              id="customer_name"
              className="athar-input"
              required
              placeholder="Ahmed Taaouati"
              maxLength={100}
              value={form.customer_name}
              onChange={(e) => handleField('customer_name', e.target.value, sanitizeName)}
            />
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="customer_phone" style={{ display: 'block', fontSize: '0.75rem', color: '#C8BEA8', marginBottom: 4 }}>Téléphone *</label>
            <input
              id="customer_phone"
              className="athar-input"
              required
              placeholder="06 61 23 45 67"
              type="tel"
              maxLength={20}
              value={form.customer_phone}
              onChange={(e) => handleField('customer_phone', e.target.value, sanitizePhone)}
              onBlur={() => {
                if (form.customer_phone.length > 8 && cart.length > 0) {
                  fetch(`${API_URL}/api/orders/abandoned`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      customer_phone: sanitizePhone(form.customer_phone),
                      customer_name: sanitizeName(form.customer_name),
                      items: cart.map((i: CartItem) => ({ product_variant_id: i.variant.id, quantity: i.quantity })),
                    }),
                  }).catch(() => {});
                }
              }}
            />
          </div>

          {/* Ville — dropdown */}
          <div>
            <label htmlFor="customer_city" style={{ display: 'block', fontSize: '0.75rem', color: '#C8BEA8', marginBottom: 4 }}>Ville *</label>
            <select
              id="customer_city"
              required
              value={form.customer_city}
              onChange={(e) => setForm((f) => ({ ...f, customer_city: e.target.value, customer_quartier: '' }))}
              style={selectStyle}
            >
              <option value="" disabled style={{ background: '#1C1917', color: '#888' }}>Sélectionner votre ville</option>
              {Object.keys(MOROCCO_CITIES).map((city) => (
                <option key={city} value={city} style={{ background: '#1C1917', color: '#F2EDE2' }}>{city}</option>
              ))}
            </select>
          </div>

          {/* Quartier — dropdown (dynamic based on city) */}
          <div>
            <label htmlFor="customer_quartier" style={{ display: 'block', fontSize: '0.75rem', color: '#C8BEA8', marginBottom: 4 }}>Quartier *</label>
            <select
              id="customer_quartier"
              required
              value={form.customer_quartier}
              disabled={!form.customer_city}
              onChange={(e) => setForm((f) => ({ ...f, customer_quartier: e.target.value }))}
              style={{ ...selectStyle, opacity: form.customer_city ? 1 : 0.5, cursor: form.customer_city ? 'pointer' : 'not-allowed' }}
            >
              <option value="" disabled style={{ background: '#1C1917', color: '#888' }}>
                {form.customer_city ? 'Sélectionner votre quartier' : "Choisissez d'abord une ville"}
              </option>
              {quartiers.map((q: string) => (
                <option key={q} value={q} style={{ background: '#1C1917', color: '#F2EDE2' }}>{q}</option>
              ))}
            </select>
          </div>

          {/* Adresse */}
          <div>
            <label htmlFor="customer_address" style={{ display: 'block', fontSize: '0.75rem', color: '#C8BEA8', marginBottom: 4 }}>Adresse complète *</label>
            <input
              id="customer_address"
              className="athar-input"
              required
              placeholder="Rue, numéro, immeuble..."
              maxLength={256}
              value={form.customer_address}
              onChange={(e) => handleField('customer_address', e.target.value)}
            />
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
