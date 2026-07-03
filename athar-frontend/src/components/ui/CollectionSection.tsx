import Link from 'next/link';
import Image from 'next/image';

/* ── Types ────────────────────────────────────────────────── */
export interface Collection {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string | null;
  products_count: number;
  sort_order: number;
}

/* ── CollectionSection (Server Component) ─────────────────── */
export default async function CollectionSection() {
  let collections: Collection[] = [];

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.atharfragrances.ma';
    const res = await fetch(`${backendUrl}/api/collections`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) collections = await res.json();
  } catch {
    /* server offline */
  }

  if (collections.length === 0) return null;

  return (
    <section id="collections" className="max-w-7xl mx-auto px-6 py-12">
      {/* Section header */}
      <div className="text-center mb-16">
        <span className="block text-xs font-semibold tracking-widest uppercase text-[#9B7A3D] mb-4 fade-up">Nos Univers</span>
        <h2 className="font-display font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-tight tracking-tight text-[#F2EDE2] mb-6 fade-up">Collections</h2>
        <div className="w-12 h-0.5 mx-auto fade-up" style={{ background: 'linear-gradient(90deg, transparent, #C8A25C, transparent)' }} />
      </div>

      {/* Collections grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
          gap: 20,
        }}
      >
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/catalogue?category=${col.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="collection-card"
              style={{
                position: 'relative',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(200,162,92,0.18)',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                aspectRatio: '3/4',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image */}
              {col.image_url ? (
                <Image
                  src={col.image_url}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              ) : (
                /* Fallback gradient */
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(135deg, rgba(200,162,92,0.12) 0%, rgba(155,122,61,0.06) 100%)',
                  }}
                />
              )}

              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                }}
              />

              {/* Product count badge */}
              {col.products_count > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: 'rgba(200,162,92,0.85)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: 999,
                    padding: '3px 10px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.05em',
                  }}
                >
                  {col.products_count} produits
                </div>
              )}

              {/* Text at bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '20px 18px 18px',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    lineHeight: 1.3,
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                  }}
                >
                  {col.name}
                </p>
                {col.description && (
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '0.72rem',
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {col.description}
                  </p>
                )}
                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#C8A25C',
                    letterSpacing: '0.05em',
                  }}
                >
                  Découvrir
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
