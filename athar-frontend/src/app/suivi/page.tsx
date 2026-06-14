'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { parseApiError } from '@/lib/api';

type OrderTrack = {
  order_number: string;
  status_label: string;
  customer_name: string;
  customer_city: string;
  total_amount: string;
  shipping_amount: string;
  items: { product: string; size: string; quantity: number; price: string }[];
};

function TrackForm() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') ?? '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<OrderTrack | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const params = new URLSearchParams({ order_number: orderNumber.trim(), phone: phone.trim() });
      const res = await fetch(`/api/orders/track?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, 'Commande introuvable'));
      setOrder(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '80vh', padding: '60px 24px', maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#C8A25C', marginBottom: 8 }}>Suivi de commande</h1>
      <p style={{ color: '#C8BEA8', fontSize: '0.85rem', marginBottom: 32 }}>Entrez votre numéro de commande et téléphone.</p>

      <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input className="athar-input" placeholder="N° commande (ex: ATH-ABC12345)" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
        <input className="athar-input" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <button type="submit" className="btn-gold" disabled={loading}>{loading ? 'Recherche...' : 'Suivre'}</button>
      </form>

      {error && <p style={{ color: '#E57373', marginTop: 16, fontSize: '0.85rem' }}>{error}</p>}

      {order && (
        <div style={{ marginTop: 32, padding: 24, borderRadius: 16, border: '1px solid rgba(200,162,92,0.2)', background: 'rgba(26,26,29,0.9)' }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9B7A3D' }}>Commande</p>
          <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#F2EDE2' }}>{order.order_number}</p>
          <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9B7A3D' }}>Statut</p>
          <p style={{ margin: '0 0 16px', fontWeight: 600, color: '#C8A25C' }}>{order.status_label}</p>
          <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#C8BEA8' }}>{order.customer_name} — {order.customer_city}</p>
          <div style={{ borderTop: '1px solid rgba(200,162,92,0.1)', paddingTop: 12 }}>
            {order.items.map((item, i) => (
              <p key={i} style={{ margin: '4px 0', fontSize: '0.8rem', color: '#C8BEA8' }}>
                {item.product} ({item.size}) × {item.quantity}
              </p>
            ))}
          </div>
          <p style={{ margin: '16px 0 0', fontWeight: 700, color: '#C8A25C' }}>Total : {Number(order.total_amount).toFixed(2)} MAD</p>
        </div>
      )}

      <p style={{ marginTop: 32, textAlign: 'center' }}>
        <Link href="/" style={{ color: '#C8A25C', fontSize: '0.85rem' }}>← Retour à la boutique</Link>
      </p>
    </main>
  );
}

export default function SuiviPage() {
  return (
    <Suspense>
      <TrackForm />
    </Suspense>
  );
}
