'use client';

import { useState } from 'react';
import { parseApiError } from '@/lib/api';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, 'Erreur'));
      setStatus('success');
      setMessage('Merci ! Vous êtes inscrit(e).');
      setEmail('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <input
          type="email"
          required
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, minWidth: 240, padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(200,162,92,0.3)', background: 'rgba(200,162,92,0.05)', color: 'inherit', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
        />
        <button type="submit" disabled={status === 'loading'} style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #C8A25C, #9B7A3D)', color: '#0D0D0F', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
          {status === 'loading' ? '...' : "S'abonner"}
        </button>
      </form>
      {message && (
        <p style={{ margin: '12px 0 0', fontSize: '0.8rem', textAlign: 'center', color: status === 'success' ? '#81C784' : '#E57373' }}>
          {message}
        </p>
      )}
    </div>
  );
}
