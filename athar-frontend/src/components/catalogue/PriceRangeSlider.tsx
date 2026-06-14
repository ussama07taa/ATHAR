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
      <p className="text-sm font-medium tracking-wide text-neutral-700 dark:text-cream-dim">
        {formatPrice(min)} MAD
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative h-1.5 rounded-full bg-neutral-200">
        <div
          className="absolute h-full rounded-full bg-neutral-900"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={safeMin}
          onChange={(e) => onChange(Math.min(Number(e.target.value), safeMax), safeMax)}
          className="catalogue-range catalogue-range-min absolute inset-0 w-full"
          aria-label="Prix minimum"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={safeMax}
          onChange={(e) => onChange(safeMin, Math.max(Number(e.target.value), safeMin))}
          className="catalogue-range catalogue-range-max absolute inset-0 w-full"
          aria-label="Prix maximum"
        />
      </div>
      <p className="text-sm font-medium tracking-wide text-neutral-700 dark:text-cream-dim">
        {formatPrice(safeMin)} MAD — {formatPrice(safeMax)} MAD
      </p>
    </div>
  );
}
