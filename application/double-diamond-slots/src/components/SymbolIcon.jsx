import React from 'react';

/**
 * Renders one of the 6 game symbols as crisp inline SVG — no external image
 * assets required. `size` controls the square viewport in pixels.
 */
export default function SymbolIcon({ symbol, size = 64, className = '' }) {
  const common = { width: size, height: size, className };

  switch (symbol) {
    case 'Diamond':
      return (
        <svg {...common} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7df9ff" />
              <stop offset="45%" stopColor="#1ec8e8" />
              <stop offset="100%" stopColor="#0a6f8c" />
            </linearGradient>
          </defs>
          <polygon points="50,6 80,38 50,94 20,38" fill="url(#diamondGrad)" stroke="#063b4a" strokeWidth="3" />
          <polygon points="50,6 80,38 50,38 20,38" fill="#bdfcff" opacity="0.55" />
          <polygon points="20,38 50,38 50,94" fill="#0a6f8c" opacity="0.35" />
          <line x1="50" y1="6" x2="50" y2="94" stroke="#eafffe" strokeWidth="1.5" opacity="0.6" />
        </svg>
      );
    case '7':
      return (
        <svg {...common} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="sevenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff5b5b" />
              <stop offset="100%" stopColor="#b3001b" />
            </linearGradient>
          </defs>
          <text x="50" y="78" textAnchor="middle" fontSize="78" fontWeight="900" fontFamily="Georgia, serif" fill="url(#sevenGrad)" stroke="#5c0010" strokeWidth="2">
            7
          </text>
        </svg>
      );
    case 'Triple BAR':
      return <BarIcon size={size} className={className} rows={3} color="#ffc94d" shadow="#8a5a00" />;
    case 'Double BAR':
      return <BarIcon size={size} className={className} rows={2} color="#ffc94d" shadow="#8a5a00" />;
    case 'Single BAR':
      return <BarIcon size={size} className={className} rows={1} color="#ffc94d" shadow="#8a5a00" />;
    case 'Cherry':
      return (
        <svg {...common} viewBox="0 0 100 100">
          <defs>
            <radialGradient id="cherryGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ff6b81" />
              <stop offset="100%" stopColor="#c40233" />
            </radialGradient>
          </defs>
          <path d="M50 20 C48 35, 44 42, 44 42 M50 20 C52 35, 58 42, 58 42" stroke="#3d7a2f" strokeWidth="3" fill="none" />
          <circle cx="40" cy="68" r="20" fill="url(#cherryGrad)" stroke="#7a001f" strokeWidth="2" />
          <circle cx="64" cy="62" r="20" fill="url(#cherryGrad)" stroke="#7a001f" strokeWidth="2" />
          <ellipse cx="34" cy="60" rx="5" ry="3" fill="#ffd0db" opacity="0.7" />
          <ellipse cx="58" cy="54" rx="5" ry="3" fill="#ffd0db" opacity="0.7" />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" fill="#333" />
        </svg>
      );
  }
}

function BarIcon({ size, className, rows, color, shadow }) {
  const barHeight = 16;
  const gap = 10;
  const totalHeight = rows * barHeight + (rows - 1) * gap;
  const startY = 50 - totalHeight / 2;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {Array.from({ length: rows }).map((_, i) => {
        const y = startY + i * (barHeight + gap);
        return (
          <g key={i}>
            <rect x="10" y={y + 3} width="80" height={barHeight} fill={shadow} rx="3" />
            <rect x="8" y={y} width="80" height={barHeight} fill={color} rx="3" stroke="#7a4f00" strokeWidth="1.5" />
            <text x="48" y={y + barHeight - 3} textAnchor="middle" fontSize="11" fontWeight="800" fontFamily="Arial, sans-serif" fill="#7a4f00">
              BAR
            </text>
          </g>
        );
      })}
    </svg>
  );
}
