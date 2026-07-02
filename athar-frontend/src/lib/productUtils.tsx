// Shared product UI utilities

export const bottleColors: Record<string, string> = {};

export function PerfumeBottle({ color = '#C8A25C' }: { color?: string }) {
  return (
    <svg viewBox="0 0 60 90" width="48" height="72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="2" width="16" height="8" rx="3" fill={color} fillOpacity="0.6" />
      <path
        d="M18 20 Q10 30 10 50 Q10 75 30 78 Q50 75 50 50 Q50 30 42 20 Z"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M24 10 Q24 20 18 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M36 10 Q36 20 42 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="30" cy="50" rx="14" ry="4" fill={color} fillOpacity="0.1" />
    </svg>
  );
}
