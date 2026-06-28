'use client';

interface PackChoiceHeroProps {
  customCount: number;
  fixedCount: number;
}

export default function PackChoiceHero({ customCount, fixedCount }: PackChoiceHeroProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <style>{`
        .pack-choice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .pack-choice-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
        .pack-choice-card {
          border-radius: 24px;
          padding: 36px 28px;
          cursor: pointer;
          transition: all 300ms ease;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 2px solid transparent;
          text-align: left;
        }
        .pack-choice-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .pack-card-custom {
          background: #111;
          color: #fff;
        }
        .pack-card-fixed {
          background: #F9F8F6;
          color: #111;
          border-color: rgba(0,0,0,0.08);
        }
        .pack-card-icon {
          font-size: 2rem;
          line-height: 1;
        }
        .pack-card-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(202,138,4,0.15);
          color: #CA8A04;
          padding: 4px 10px;
          border-radius: 999px;
          align-self: flex-start;
        }
        .pack-card-title {
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-family: var(--font-display);
          font-weight: 700;
          line-height: 1.2;
          margin: 0;
        }
        .pack-card-desc {
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
          opacity: 0.7;
        }
        .pack-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 8px;
        }
      `}</style>

      <div style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 40px)',
        background: 'linear-gradient(180deg, #F9F8F6 0%, #FFFFFF 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        textAlign: 'center',
      }}>
        {/* Title */}
        <div style={{ maxWidth: 540, margin: '0 auto 40px' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 800, color: '#CA8A04',
            letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: 12
          }}>
            L&apos;Art de la Découverte
          </span>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontFamily: 'var(--font-display)', fontWeight: 700, color: '#111', marginBottom: 12
          }}>
            Packs Decante
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#888', lineHeight: 1.6 }}>
            Choisissez votre type de pack pour commencer.
          </p>
        </div>

        {/* Two-choice Cards */}
        <div className="pack-choice-grid" style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Card 1 — Personnalisable */}
          {customCount > 0 && (
            <button
              className="pack-choice-card pack-card-custom"
              onClick={() => scrollTo('packs-personnalisables')}
            >
              <div className="pack-card-icon">🎨</div>
              <span className="pack-card-badge">{customCount} pack{customCount > 1 ? 's' : ''} disponibles</span>
              <h2 className="pack-card-title">Je compose mon pack</h2>
              <p className="pack-card-desc">
                Choisissez vos fragrances favorites et créez un pack 100% personnalisé selon vos envies.
              </p>
              <span className="pack-card-cta">
                Voir les packs <span style={{ fontSize: '1rem' }}>→</span>
              </span>
            </button>
          )}

          {/* Card 2 — Prêts-à-offrir */}
          {fixedCount > 0 && (
            <button
              className="pack-choice-card pack-card-fixed"
              onClick={() => scrollTo('packs-prets-a-offrir')}
            >
              <div className="pack-card-icon">🎁</div>
              <span className="pack-card-badge">{fixedCount} pack{fixedCount > 1 ? 's' : ''} disponibles</span>
              <h2 className="pack-card-title">Pack prêt-à-offrir</h2>
              <p className="pack-card-desc">
                Sélection experte de nos fragrances signatures, prêtes à être offertes ou savourées.
              </p>
              <span className="pack-card-cta">
                Voir les packs <span style={{ fontSize: '1rem' }}>→</span>
              </span>
            </button>
          )}

        </div>
      </div>
    </>
  );
}
