'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { parseApiError } from '@/lib/api';
import { siteConfig, whatsappUrl } from '@/lib/site-config';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') ?? '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<OrderTrack | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

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
    <main style={{ minHeight: '80vh', padding: '60px 24px', maxWidth: 560, margin: '0 auto', background: isLight ? '#FFFFFF' : '#0D0D0F', transition: 'all 500ms' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#CA8A04', marginBottom: 8 }}>Suivi de commande</h1>
      <p style={{ color: isLight ? '#44403C' : '#A8A29E', fontSize: '0.85rem', marginBottom: 32 }}>Entrez votre numéro de commande et téléphone.</p>

      <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, background: isLight ? '#F5F5F4' : '#1C1917', color: isLight ? '#111827' : '#F2EDE2', outline: 'none' }} placeholder="N° commande (ex: ATH-ABC12345)" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
        <input style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, background: isLight ? '#F5F5F4' : '#1C1917', color: isLight ? '#111827' : '#F2EDE2', outline: 'none' }} placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <button type="submit" style={{ width: '100%', background: '#CA8A04', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'opacity 200ms ease' }} disabled={loading}>{loading ? 'Recherche...' : 'Suivre'}</button>
      </form>

      {error && <p style={{ color: '#E57373', marginTop: 16, fontSize: '0.85rem' }}>{error}</p>}

      {order && (
        <div style={{ marginTop: 32, padding: 24, borderRadius: 16, border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, background: isLight ? '#F5F5F4' : '#1C1917' }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#CA8A04' }}>Commande</p>
          <p style={{ margin: '0 0 16px', fontWeight: 700, color: isLight ? '#111827' : '#F2EDE2' }}>{order.order_number}</p>
          <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#CA8A04' }}>Statut</p>
          <p style={{ margin: '0 0 16px', fontWeight: 600, color: isLight ? '#111827' : '#F2EDE2', background: 'rgba(202,138,4,0.1)', padding: '4px 12px', borderRadius: '8px', display: 'inline-block' }}>{order.status_label}</p>
          <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: isLight ? '#44403C' : '#A8A29E' }}>{order.customer_name} — {order.customer_city}</p>
          <div style={{ borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, paddingTop: 12 }}>
            {order.items.map((item, i) => (
              <p key={i} style={{ margin: '4px 0', fontSize: '0.8rem', color: isLight ? '#44403C' : '#A8A29E' }}>
                {item.product} ({item.size}) × {item.quantity}
              </p>
            ))}
          </div>
          <a
            href={whatsappUrl(`Bonjour, j'ai une question concernant ma commande ${order.order_number}`)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', marginTop: 16, color: '#CA8A04', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'underline' }}>
            Besoin d'aide ? Contactez-nous sur WhatsApp
          </a>
          <p style={{ margin: '16px 0 0', fontWeight: 700, color: '#CA8A04' }}>Total : {Number(order.total_amount).toFixed(2)} MAD</p>
        </div>
      )}

      <p style={{ marginTop: 32, textAlign: 'center' }}>
        <Link href="/" style={{ color: '#CA8A04', fontSize: '0.85rem', fontWeight: 600 }}>← Retour à la boutique</Link>
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
