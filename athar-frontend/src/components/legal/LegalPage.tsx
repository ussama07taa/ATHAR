import Link from 'next/link';

type Section = { title: string; content: string };

export default function LegalPage({ title, sections }: { title: string; sections: Section[] }) {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#C8A25C', marginBottom: 32 }}>{title}</h1>
      {sections.map((s) => (
        <section key={s.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#F2EDE2', marginBottom: 10 }}>{s.title}</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#C8BEA8', lineHeight: 1.8 }}>{s.content}</p>
        </section>
      ))}
      <p style={{ marginTop: 40 }}>
        <Link href="/" style={{ color: '#C8A25C' }}>← Retour à l&apos;accueil</Link>
      </p>
    </main>
  );
}
