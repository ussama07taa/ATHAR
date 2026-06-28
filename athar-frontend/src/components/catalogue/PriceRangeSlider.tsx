'use client';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(n);
}

export default function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: PriceRangeSliderProps) {
  const isSinglePrice = min >= max;
  const safeMin = Math.min(valueMin, valueMax);
  const safeMax = Math.max(valueMin, valueMax);
  const range = max - min || 1;
  const left = ((safeMin - min) / range) * 100;
  const width = ((safeMax - safeMin) / range) * 100;

  if (isSinglePrice) {
    return (
      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0C0A09', margin: '10px 0' }}>
        {formatPrice(min)} DH
      </p>
    );
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ 
        position: 'relative', 
        height: '2px', 
        background: '#eee', 
        borderRadius: '2px',
        marginBottom: '20px'
      }}>
        <div
          style={{ 
            position: 'absolute', 
            height: '100%', 
            background: '#CA8A04', 
            left: `${left}%`, 
            width: `${width}%`,
            transition: 'all 200ms ease'
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={safeMin}
          onChange={(e) => onChange(Math.min(Number(e.target.value), safeMax), safeMax)}
          className="range-thumb-min"
          style={{ 
            position: 'absolute', 
            width: '100%', 
            background: 'none', 
            pointerEvents: 'none',
            appearance: 'none',
            top: '-6px'
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={safeMax}
          onChange={(e) => onChange(safeMin, Math.max(Number(e.target.value), safeMin))}
          className="range-thumb-max"
          style={{ 
            position: 'absolute', 
            width: '100%', 
            background: 'none', 
            pointerEvents: 'none',
            appearance: 'none',
            top: '-6px'
          }}
        />
      </div>
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#57534E', letterSpacing: '0.02em', marginTop: 12 }}>
        {formatPrice(safeMin)} DH — {formatPrice(safeMax)} DH
      </p>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #CA8A04;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(202,138,4,0.15);
          transition: transform 200ms ease;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        input[type=range]::-moz-range-thumb {
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #CA8A04;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
