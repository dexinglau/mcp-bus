import React, { useId } from 'react';
import type { PlushieDesign } from './types';

interface PlushiePreviewProps {
  design: PlushieDesign;
  artworkUrl: string | null;
}

// Hand-drawn SVG preview. Every base shares the same belly area (centred at
// 100,150) so pockets and printed patches line up regardless of shape.
export const PlushiePreview: React.FC<PlushiePreviewProps> = ({ design, artworkUrl }) => {
  const uid = useId().replace(/:/g, '');
  const { base, bodyColor, accentColor, eyes, cardPocket, artworkPlacement, bagCount, bagColor } = design;
  const outline = '#2b2d42';
  const fullPrintId = `full-${uid}`;
  const bellyClipId = `belly-${uid}`;
  const showFullPrint = artworkUrl && artworkPlacement === 'full';
  const showBellyPrint = artworkUrl && artworkPlacement === 'belly';
  const bodyFill = showFullPrint ? `url(#${fullPrintId})` : bodyColor;

  return (
    <svg viewBox="0 0 240 240" className="w-full h-full" role="img" aria-label={`Preview of ${design.name || 'your plushie'}`}>
      <defs>
        {showFullPrint && (
          <pattern id={fullPrintId} patternUnits="userSpaceOnUse" width="240" height="240">
            <rect width="240" height="240" fill={bodyColor} />
            <image href={artworkUrl!} width="240" height="240" preserveAspectRatio="xMidYMid slice" opacity="0.85" />
          </pattern>
        )}
        <clipPath id={bellyClipId}>
          <ellipse cx="100" cy="150" rx="30" ry="28" />
        </clipPath>
      </defs>

      {/* Reusable bags, folded into little pouches hanging off the side */}
      {Array.from({ length: bagCount }).map((_, i) => (
        <g key={i} transform={`translate(${184 + (i % 2) * 22}, ${118 + i * 30})`}>
          <line x1="-14" y1="-16" x2="2" y2="0" stroke={outline} strokeWidth="1.5" />
          <rect x="-8" y="0" width="22" height="20" rx="5" fill={bagColor} stroke={outline} strokeWidth="2" />
          <path d="M-2 0 q5 -7 10 0" fill="none" stroke={outline} strokeWidth="1.5" />
        </g>
      ))}

      {base === 'bus' ? (
        <g>
          <rect x="35" y="55" width="130" height="140" rx="22" fill={bodyFill} stroke={outline} strokeWidth="3" />
          <rect x="47" y="68" width="106" height="22" rx="6" fill={accentColor} stroke={outline} strokeWidth="2" />
          <rect x="47" y="96" width="106" height="20" rx="6" fill={accentColor} stroke={outline} strokeWidth="2" />
          <circle cx="62" cy="198" r="12" fill={outline} />
          <circle cx="138" cy="198" r="12" fill={outline} />
        </g>
      ) : base === 'blob' ? (
        <path
          d="M100 50 C150 48 175 95 170 140 C166 185 140 205 100 205 C58 205 32 185 30 140 C28 95 52 52 100 50 Z"
          fill={bodyFill}
          stroke={outline}
          strokeWidth="3"
        />
      ) : (
        <g>
          {base === 'bear' && (
            <>
              <circle cx="62" cy="42" r="17" fill={bodyFill} stroke={outline} strokeWidth="3" />
              <circle cx="138" cy="42" r="17" fill={bodyFill} stroke={outline} strokeWidth="3" />
              <circle cx="62" cy="42" r="8" fill={accentColor} />
              <circle cx="138" cy="42" r="8" fill={accentColor} />
            </>
          )}
          {base === 'bunny' && (
            <>
              <ellipse cx="74" cy="22" rx="12" ry="32" fill={bodyFill} stroke={outline} strokeWidth="3" transform="rotate(-10 74 22)" />
              <ellipse cx="128" cy="22" rx="12" ry="32" fill={bodyFill} stroke={outline} strokeWidth="3" transform="rotate(14 128 22)" />
              <ellipse cx="74" cy="24" rx="5" ry="22" fill={accentColor} transform="rotate(-10 74 24)" />
              <ellipse cx="128" cy="24" rx="5" ry="22" fill={accentColor} transform="rotate(14 128 24)" />
            </>
          )}
          {base === 'cat' && (
            <>
              <path d="M52 62 L58 22 L86 46 Z" fill={bodyFill} stroke={outline} strokeWidth="3" strokeLinejoin="round" />
              <path d="M148 62 L142 22 L114 46 Z" fill={bodyFill} stroke={outline} strokeWidth="3" strokeLinejoin="round" />
              <path d="M144 196 q36 -10 26 -50" fill="none" stroke={outline} strokeWidth="11" strokeLinecap="round" />
              <path d="M144 196 q36 -10 26 -50" fill="none" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
            </>
          )}
          {/* Body */}
          <ellipse cx="100" cy="155" rx="55" ry="52" fill={bodyFill} stroke={outline} strokeWidth="3" />
          {/* Arms & feet */}
          <ellipse cx="48" cy="140" rx="12" ry="20" fill={bodyFill} stroke={outline} strokeWidth="3" transform="rotate(25 48 140)" />
          <ellipse cx="152" cy="140" rx="12" ry="20" fill={bodyFill} stroke={outline} strokeWidth="3" transform="rotate(-25 152 140)" />
          <ellipse cx="74" cy="203" rx="18" ry="10" fill={accentColor} stroke={outline} strokeWidth="3" />
          <ellipse cx="126" cy="203" rx="18" ry="10" fill={accentColor} stroke={outline} strokeWidth="3" />
          {/* Head */}
          <circle cx="100" cy="72" r="44" fill={bodyFill} stroke={outline} strokeWidth="3" />
          <ellipse cx="100" cy="88" rx="17" ry="12" fill={accentColor} />
        </g>
      )}

      <Face eyes={eyes} base={base} outline={outline} />

      {/* Belly: plain accent patch, printed artwork, or nothing for full prints */}
      {!showFullPrint && !showBellyPrint && cardPocket !== 'window' && base !== 'bus' && (
        <ellipse cx="100" cy="150" rx="30" ry="28" fill={accentColor} />
      )}
      {showBellyPrint && (
        <g>
          <ellipse cx="100" cy="150" rx="30" ry="28" fill="#fff" />
          <image
            href={artworkUrl!}
            x="70"
            y="122"
            width="60"
            height="56"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${bellyClipId})`}
          />
          <ellipse cx="100" cy="150" rx="30" ry="28" fill="none" stroke={outline} strokeWidth="2" strokeDasharray="4 3" />
        </g>
      )}

      {/* Transport card pockets */}
      {cardPocket === 'window' && (
        <g>
          <rect x="72" y="134" width="56" height="36" rx="5" fill="#dff3ff" fillOpacity="0.85" stroke={outline} strokeWidth="2" />
          <rect x="78" y="140" width="44" height="24" rx="3" fill="#6f2c75" opacity="0.8" />
          <rect x="82" y="144" width="10" height="7" rx="1.5" fill="#ffd166" />
          <line x1="70" y1="132" x2="130" y2="132" stroke={outline} strokeWidth="2.5" />
          <circle cx="130" cy="132" r="3" fill={outline} />
        </g>
      )}
      {cardPocket === 'back-slot' && (
        <g>
          <rect x="10" y="10" width="62" height="20" rx="10" fill="#ffffff" stroke={outline} strokeWidth="1.5" />
          <text x="41" y="24" textAnchor="middle" fontSize="9" fontFamily="Space Grotesk, sans-serif" fill={outline}>
            card slot ↺
          </text>
        </g>
      )}
    </svg>
  );
};

const Face: React.FC<{ eyes: PlushieDesign['eyes']; base: PlushieDesign['base']; outline: string }> = ({ eyes, base, outline }) => {
  // The bus has its "face" on the lower front panel; others on the head.
  const y = base === 'bus' ? 135 : base === 'blob' ? 110 : 66;
  const mouthY = y + (base === 'bus' || base === 'blob' ? 18 : 24);
  const left = 82;
  const right = 118;

  const eye = (cx: number) => {
    if (eyes === 'sleepy') {
      return <path key={cx} d={`M${cx - 7} ${y} q7 6 14 0`} fill="none" stroke={outline} strokeWidth="3" strokeLinecap="round" />;
    }
    if (eyes === 'sparkle') {
      return (
        <g key={cx}>
          <circle cx={cx} cy={y} r="8" fill={outline} />
          <circle cx={cx + 3} cy={y - 3} r="3" fill="#fff" />
          <circle cx={cx - 3} cy={y + 3} r="1.5" fill="#fff" />
        </g>
      );
    }
    return <circle key={cx} cx={cx} cy={y} r="5.5" fill={outline} />;
  };

  return (
    <g>
      {eye(left)}
      {eye(right)}
      <path d={`M93 ${mouthY - 4} q7 7 14 0`} fill="none" stroke={outline} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="70" cy={y + 14} r="5" fill="#ef476f" opacity="0.35" />
      <circle cx="130" cy={y + 14} r="5" fill="#ef476f" opacity="0.35" />
    </g>
  );
};
