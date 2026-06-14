'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch — render only after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render an invisible placeholder of the same size to avoid layout shift
    return (
      <div
        style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      style={{
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: 12,
        background: isDark
          ? 'rgba(200,162,92,0.08)'
          : 'rgba(200,162,92,0.12)',
        border: '1px solid rgba(200,162,92,0.25)',
        color: '#C8A25C',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 200ms ease, border-color 200ms ease',
        flexShrink: 0,
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = 'rgba(200,162,92,0.22)';
        el.style.borderColor = 'rgba(200,162,92,0.5)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = isDark
          ? 'rgba(200,162,92,0.08)'
          : 'rgba(200,162,92,0.12)';
        el.style.borderColor = 'rgba(200,162,92,0.25)';
      }}
    >
      {/* Sun icon — visible in dark mode (clicking switches to light) */}
      <span
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)',
          transition: 'opacity 250ms ease, transform 250ms ease',
          pointerEvents: 'none',
        }}
      >
        <Sun size={17} strokeWidth={1.75} />
      </span>

      {/* Moon icon — visible in light mode (clicking switches to dark) */}
      <span
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(-90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
          transition: 'opacity 250ms ease, transform 250ms ease',
          pointerEvents: 'none',
        }}
      >
        <Moon size={17} strokeWidth={1.75} />
      </span>
    </button>
  );
}
