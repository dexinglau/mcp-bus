import React, { useEffect, useRef, useState } from 'react';
import photoUrl from '../../assets/plushie/sleepy-giant.webp';
import maskUrl from '../../assets/plushie/sleepy-giant-mask.png';
import type { PlushieDesign } from './types';

interface PlushiePhotoPreviewProps {
  design: PlushieDesign;
  artworkUrl: string | null;
}

// Photo dimensions; overlay coordinates below are in this space.
const W = 774;
const H = 612;

// Median lightness of the body fur and accent fabric in the original photo,
// as printed by scripts/make-plushie-mask.py. Recolouring shifts each pixel's
// lightness relative to these so the fur keeps its shading.
const BODY_REF_L = 0.196;
const ACCENT_REF_L = 0.537;

// Belly area used for the printed belly patch.
const BELLY = { cx: 465, cy: 345, rx: 140, ry: 75 };

interface Sources {
  photo: ImageData;
  mask: ImageData;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function toImageData(img: HTMLImageElement, draw?: (ctx: CanvasRenderingContext2D) => void): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  if (draw) draw(ctx);
  else ctx.drawImage(img, 0, 0, W, H);
  return ctx.getImageData(0, 0, W, H);
}

// Draws `img` scaled to cover the given box, like CSS object-fit: cover.
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2rgb(p, q, h + 1 / 3) * 255, hue2rgb(p, q, h) * 255, hue2rgb(p, q, h - 1 / 3) * 255];
}

/**
 * Recolours one fabric region. `target` is either a flat colour or a
 * per-pixel texture (uploaded artwork); `region` limits which pixels of the
 * mask channel apply (used to confine the belly print to the belly).
 */
function paintRegion(
  out: Uint8ClampedArray,
  { photo, mask }: Sources,
  channel: 0 | 1,
  refL: number,
  target: string | ImageData,
  region?: (x: number, y: number) => boolean,
) {
  const flat = typeof target === 'string' ? rgbToHsl(...hexToRgb(target)) : null;
  const src = photo.data;
  const m = mask.data;
  for (let i = 0; i < src.length; i += 4) {
    const weight = m[i + channel] / 255;
    if (weight === 0) continue;
    if (region) {
      const p = i / 4;
      if (!region(p % W, Math.floor(p / W))) continue;
    }
    const [, , pl] = rgbToHsl(src[i], src[i + 1], src[i + 2]);
    let th: number, ts: number, tl: number;
    if (flat) {
      [th, ts, tl] = flat;
    } else {
      const t = (target as ImageData).data;
      [th, ts, tl] = rgbToHsl(t[i], t[i + 1], t[i + 2]);
    }
    const l = Math.min(1, Math.max(0, tl + (pl - refL)));
    const [r, g, b] = hslToRgb(th, ts, l);
    out[i] = out[i] * (1 - weight) + r * weight;
    out[i + 1] = out[i + 1] * (1 - weight) + g * weight;
    out[i + 2] = out[i + 2] * (1 - weight) + b * weight;
  }
}

const inBelly = (x: number, y: number) =>
  ((x - BELLY.cx) / BELLY.rx) ** 2 + ((y - BELLY.cy) / BELLY.ry) ** 2 <= 1;

// Photo-based preview for the Sleepy Giant: the body and accent fabric are
// recoloured on a canvas, and pockets and bags are drawn as an SVG overlay.
export const PlushiePhotoPreview: React.FC<PlushiePhotoPreviewProps> = ({ design, artworkUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sources, setSources] = useState<Sources | null>(null);
  const [artwork, setArtwork] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadImage(photoUrl), loadImage(maskUrl)])
      .then(([photo, mask]) => {
        if (!cancelled) setSources({ photo: toImageData(photo), mask: toImageData(mask) });
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!artworkUrl) {
      setArtwork(null);
      return;
    }
    loadImage(artworkUrl)
      .then((img) => !cancelled && setArtwork(img))
      .catch(() => !cancelled && setArtwork(null));
    return () => {
      cancelled = true;
    };
  }, [artworkUrl]);

  const { bodyColor, accentColor, artworkPlacement } = design;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!sources || !canvas) return;
    const ctx = canvas.getContext('2d')!;
    const out = new ImageData(new Uint8ClampedArray(sources.photo.data), W, H);

    const fullPrint =
      artwork && artworkPlacement === 'full' ? toImageData(artwork, (c) => drawCover(c, artwork, 0, 0, W, H)) : null;
    const bellyPrint =
      artwork && artworkPlacement === 'belly'
        ? toImageData(artwork, (c) => drawCover(c, artwork, BELLY.cx - BELLY.rx, BELLY.cy - BELLY.ry, BELLY.rx * 2, BELLY.ry * 2))
        : null;

    paintRegion(out.data, sources, 0, BODY_REF_L, fullPrint ?? bodyColor);
    paintRegion(out.data, sources, 1, ACCENT_REF_L, accentColor);
    if (bellyPrint) paintRegion(out.data, sources, 1, ACCENT_REF_L, bellyPrint, inBelly);
    ctx.putImageData(out, 0, 0);
  }, [sources, artwork, bodyColor, accentColor, artworkPlacement]);

  const { cardPocket, bagCount, bagColor } = design;
  const outline = '#2b2d42';

  return (
    <div className="relative w-full rounded overflow-hidden bg-[#e8efe3]" style={{ aspectRatio: `${W} / ${H}` }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label={`Preview of ${design.name || 'your plushie'}`}
      />
      {!sources && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-[#64748b]">
          {loadError ? 'Preview unavailable.' : 'Loading preview…'}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {cardPocket === 'window' && (
          <g transform="rotate(-6 465 330)">
            <rect x="398" y="290" width="134" height="84" rx="10" fill="#dff3ff" fillOpacity="0.55" stroke={outline} strokeWidth="3" />
            <rect x="410" y="302" width="110" height="60" rx="6" fill="#6f2c75" opacity="0.85" />
            <rect x="420" y="312" width="22" height="16" rx="3" fill="#ffd166" />
            <line x1="394" y1="286" x2="536" y2="286" stroke={outline} strokeWidth="4" strokeLinecap="round" />
            <circle cx="536" cy="286" r="6" fill={outline} />
          </g>
        )}
        {cardPocket === 'back-slot' && (
          <g>
            <rect x="16" y="16" width="150" height="40" rx="20" fill="#ffffff" fillOpacity="0.9" stroke={outline} strokeWidth="2" />
            <text x="91" y="42" textAnchor="middle" fontSize="18" fontFamily="Space Grotesk, sans-serif" fill={outline}>
              card slot ↺
            </text>
          </g>
        )}
        {Array.from({ length: bagCount }).map((_, i) => (
          <g key={i} transform={`translate(${640 + i * 42}, ${250 + i * 28})`}>
            <line x1="-40" y1="-14" x2="4" y2="0" stroke={outline} strokeWidth="3" />
            <rect x="-14" y="0" width="40" height="38" rx="9" fill={bagColor} stroke={outline} strokeWidth="3" />
            <path d="M-4 0 q10 -13 20 0" fill="none" stroke={outline} strokeWidth="3" />
          </g>
        ))}
      </svg>
    </div>
  );
};
