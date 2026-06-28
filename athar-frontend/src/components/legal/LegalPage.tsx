'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

type Section = { title: string; content: string };

export default function LegalPage({ title, sections }: { title: string; sections: Section[] }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px', background: isLight ? '#FFFFFF' : '#0D0D0F', transition: 'all 500ms', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#CA8A04', marginBottom: 32 }}>{title}</h1>
      {sections.map((s) => (
        <section key={s.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: isLight ? '#111827' : '#F2EDE2', marginBottom: 10 }}>{s.title}</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: isLight ? '#44403C' : '#A8A29E', lineHeight: 1.8 }}>{s.content}</p>
        </section>
      ))}
      <p style={{ marginTop: 40 }}>
        <Link href="/" style={{ color: '#CA8A04' }}>← Retour à l&apos;accueil</Link>
      </p>
    </main>
  );
}
