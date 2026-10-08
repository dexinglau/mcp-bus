import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CreditCard,
  ShoppingBag,
  Palette,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  Search,
} from 'lucide-react';
import {
  PLUSHIE_BASES,
  PLUSHIE_SIZES,
  PLUSHIE_EYES,
  PLUSHIE_PALETTE,
  CARD_POCKETS,
  BAG_STYLES,
  MAX_BAGS,
  ARTWORK_PLACEMENTS,
  MAX_IMAGE_BYTES,
  ALLOWED_IMAGE_TYPES,
  defaultDesign,
  validateDesign,
  priceDesign,
} from '../../../api/plushie-catalog.js';
import { PlushiePreview } from './PlushiePreview';
import type { PlushieDesign, PlushieQuote, SavedPlushie } from './types';

const DRAFT_KEY = 'plushie_studio_draft';

function loadDraft(): { design: PlushieDesign; artwork: string | null } {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { design: { ...defaultDesign(), ...parsed.design }, artwork: parsed.artwork ?? null };
    }
  } catch {
    // Fall through to a fresh design.
  }
  return { design: defaultDesign() as PlushieDesign, artwork: null };
}

async function urlToDataUrl(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const sectionClass = 'bg-white border border-[#e2e8f0] rounded p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]';
const labelClass = 'block text-xs font-space font-semibold uppercase tracking-wider text-[#64748b] mb-2';
const optionClass = (active: boolean) =>
  `cursor-pointer p-3 rounded text-left border transition-all ${
    active
      ? 'bg-[#6f2c75] text-white border-[#6f2c75] shadow-xs'
      : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:bg-[#f1f5f9]'
  }`;

export const PlushieStudio: React.FC = () => {
  const [initial] = useState(loadDraft);
  const [design, setDesign] = useState<PlushieDesign>(initial.design);
  const [artwork, setArtwork] = useState<string | null>(initial.artwork);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState<SavedPlushie | null>(null);
  const [lookupId, setLookupId] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quote: PlushieQuote = priceDesign(design, Boolean(artwork));

  // Persist the draft locally so a refresh doesn't lose work. Large images
  // can exceed the storage quota; in that case keep the design only.
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ design, artwork }));
    } catch {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ design, artwork: null }));
      } catch {
        // Storage unavailable; drafts just won't persist.
      }
    }
  }, [design, artwork]);

  const update = <K extends keyof PlushieDesign>(key: K, value: PlushieDesign[K]) => {
    setDesign((prev) => ({ ...prev, [key]: value }));
    setSaved(null);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Please upload a PNG, JPEG or WebP image.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError(`Images must be ${MAX_IMAGE_BYTES / (1024 * 1024)} MB or smaller.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setArtwork(reader.result as string);
      setSaved(null);
      if (design.artworkPlacement === 'reference') update('artworkPlacement', 'belly');
    };
    reader.onerror = () => setUploadError('Could not read that file. Please try another image.');
    reader.readAsDataURL(file);
  };

  const removeArtwork = () => {
    setArtwork(null);
    setSaved(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    const { errors } = validateDesign(design);
    if (errors) {
      setSubmitErrors(errors);
      return;
    }
    setSubmitErrors([]);
    setIsSubmitting(true);
    try {
      // Artwork loaded from a saved design is a URL; re-send it as image data.
      const artworkData = artwork?.startsWith('/api/') ? await urlToDataUrl(artwork) : artwork;
      const response = await fetch('/api/plushies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design, artwork: artworkData }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSubmitErrors(body.errors ?? [`Request failed (${response.status}).`]);
        return;
      }
      setSaved(body);
    } catch {
      setSubmitErrors(['Could not reach the server. Check your connection and try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async () => {
    const id = lookupId.trim().toLowerCase();
    if (!id) return;
    setLookupError(null);
    try {
      const response = await fetch(`/api/plushies/${encodeURIComponent(id)}`);
      if (!response.ok) {
        setLookupError('No design found with that reference.');
        return;
      }
      const record: SavedPlushie = await response.json();
      setDesign(record.design);
      setArtwork(record.artworkUrl);
      setSaved(record);
      setLookupId('');
    } catch {
      setLookupError('Could not reach the server.');
    }
  };

  const resetDesign = () => {
    setDesign(defaultDesign() as PlushieDesign);
    removeArtwork();
    setSubmitErrors([]);
  };

  const hasRemoteArtwork = artwork?.startsWith('/api/');

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className={`${sectionClass} flex flex-col sm:flex-row sm:items-start justify-between gap-4`}>
        <div>
          <h2 className="font-space font-bold text-2xl text-[#0f172a]">Plushie Studio</h2>
          <p className="text-sm text-[#64748b] mt-1 max-w-2xl">
            Design a one-of-a-kind commuter companion. Pick a shape, upload your own artwork, add a pocket that holds
            your transport card, and stash fold-away reusable bags for the ride home.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="Design reference"
            aria-label="Load a saved design by reference"
            className="h-9 w-40 px-3 border border-[#e2e8f0] rounded text-xs font-mono focus:border-[#6f2c75] outline-none"
          />
          <button
            onClick={handleLookup}
            className="cursor-pointer h-9 px-3 flex items-center gap-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#e2e8f0] rounded text-xs font-space font-bold text-[#334155]"
          >
            <Search className="w-3.5 h-3.5" /> Load
          </button>
        </div>
      </div>
      {lookupError && <p className="text-xs text-[#dc2626] -mt-4">{lookupError}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Preview & summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4 order-1">
          <div className={sectionClass}>
            <div className="aspect-square bg-gradient-to-b from-[#faf5ff] to-[#fff7ed] rounded flex items-center justify-center p-4">
              <PlushiePreview design={design} artworkUrl={artwork} />
            </div>
            <div className="mt-3 text-center">
              <div className="font-space font-bold text-lg text-[#0f172a]">{design.name || 'Unnamed plushie'}</div>
              <div className="text-xs text-[#64748b]">
                {PLUSHIE_BASES.find((b) => b.id === design.base)?.label} ·{' '}
                {PLUSHIE_SIZES.find((s) => s.id === design.size)?.label}
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="font-space font-bold text-base text-[#0f172a] mb-3">Price summary</h3>
            <ul className="space-y-1.5 text-sm">
              {quote.lines.map((line) => (
                <li key={line.label} className="flex justify-between gap-3 text-[#475569]">
                  <span>{line.label}</span>
                  <span className="font-mono tabular-nums">${line.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-3 pt-3 border-t border-[#f1f5f9] font-space font-bold text-[#0f172a]">
              <span>Total ({quote.currency})</span>
              <span className="font-mono tabular-nums">${quote.total.toFixed(2)}</span>
            </div>

            {submitErrors.length > 0 && (
              <div className="mt-3 p-3 rounded bg-red-50 border border-red-200 text-xs text-[#b91c1c] space-y-1">
                {submitErrors.map((err) => (
                  <div key={err} className="flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}

            {saved ? (
              <div className="mt-3 p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-[#166534]">
                <div className="flex items-center gap-1.5 font-space font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Design saved
                </div>
                <p className="mt-1">
                  Your reference is <span className="font-mono font-bold">{saved.id}</span>. Use it to load this design
                  again later.
                </p>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="cursor-pointer w-full mt-4 px-4 py-3 bg-[#eb651b] hover:bg-[#d9531e] text-white rounded text-xs font-space font-bold tracking-wider uppercase transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Saving…' : 'Save design'}
              </button>
            )}
            <button
              onClick={resetDesign}
              className="cursor-pointer w-full mt-2 px-4 py-2 text-xs font-space font-semibold text-[#64748b] hover:text-[#0f172a]"
            >
              Start over
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-7 space-y-6 order-2">
          {/* 1. Shape & name */}
          <section className={sectionClass}>
            <h3 className="font-space font-bold text-lg text-[#0f172a] flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#6f2c75]" /> 1. Shape & personality
            </h3>
            <label className={labelClass} htmlFor="plushie-name">Name</label>
            <input
              id="plushie-name"
              value={design.name}
              maxLength={40}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Captain Cuddles"
              className="w-full h-11 px-3 mb-4 border border-[#e2e8f0] rounded text-sm focus:border-[#6f2c75] focus:ring-2 focus:ring-[#6f2c75]/15 outline-none"
            />

            <span className={labelClass}>Base</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {PLUSHIE_BASES.map((b) => (
                <button key={b.id} onClick={() => update('base', b.id as PlushieDesign['base'])} className={optionClass(design.base === b.id)}>
                  <div className="font-space font-bold text-xs">{b.label}</div>
                  <div className={`text-[11px] mt-0.5 ${design.base === b.id ? 'text-purple-200' : 'text-[#94a3b8]'}`}>
                    from ${b.price}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className={labelClass}>Size</span>
                <div className="grid grid-cols-3 gap-2">
                  {PLUSHIE_SIZES.map((s) => (
                    <button key={s.id} onClick={() => update('size', s.id as PlushieDesign['size'])} className={optionClass(design.size === s.id)}>
                      <div className="font-space font-bold text-xs">{s.label.split(' ')[0]}</div>
                      <div className={`text-[11px] ${design.size === s.id ? 'text-purple-200' : 'text-[#94a3b8]'}`}>
                        {s.label.split(' ').slice(1).join(' ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className={labelClass}>Eyes</span>
                <div className="grid grid-cols-3 gap-2">
                  {PLUSHIE_EYES.map((e) => (
                    <button key={e.id} onClick={() => update('eyes', e.id as PlushieDesign['eyes'])} className={optionClass(design.eyes === e.id)}>
                      <div className="font-space font-bold text-xs">{e.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Colours */}
          <section className={sectionClass}>
            <h3 className="font-space font-bold text-lg text-[#0f172a] flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-[#6f2c75]" /> 2. Fabric colours
            </h3>
            <ColorPicker label="Body" value={design.bodyColor} onChange={(c) => update('bodyColor', c)} />
            <ColorPicker label="Accent (ears, paws, belly)" value={design.accentColor} onChange={(c) => update('accentColor', c)} />
          </section>

          {/* 3. Artwork upload */}
          <section className={sectionClass}>
            <h3 className="font-space font-bold text-lg text-[#0f172a] flex items-center gap-2 mb-1">
              <ImageIcon className="w-5 h-5 text-[#6f2c75]" /> 3. Your artwork
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              Upload a drawing, photo or pattern you want your plushie to look like. PNG, JPEG or WebP, up to{' '}
              {MAX_IMAGE_BYTES / (1024 * 1024)} MB. Only upload images you own or have permission to use.
            </p>

            {artwork ? (
              <div className="flex items-center gap-4 p-3 border border-[#e2e8f0] rounded bg-[#f8fafc]">
                <img src={artwork} alt="Uploaded artwork" className="w-20 h-20 object-cover rounded border border-[#e2e8f0]" />
                <div className="flex-1 text-xs text-[#475569]">
                  {hasRemoteArtwork ? 'Artwork from your saved design.' : 'Artwork ready to go.'}
                </div>
                <button
                  onClick={removeArtwork}
                  className="cursor-pointer flex items-center gap-1 px-3 py-2 text-xs font-space font-semibold text-[#dc2626] hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFile(e.dataTransfer.files[0]);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded p-8 text-center transition-colors ${
                  isDragging ? 'border-[#6f2c75] bg-purple-50' : 'border-[#cbd5e1] hover:border-[#6f2c75] bg-[#f8fafc]'
                }`}
              >
                <Upload className="w-7 h-7 mx-auto text-[#6f2c75]" />
                <div className="mt-2 font-space font-bold text-sm text-[#0f172a]">Drop an image here or click to browse</div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {uploadError && <p className="mt-2 text-xs text-[#dc2626]">{uploadError}</p>}

            <span className={`${labelClass} mt-4`}>How should we use it?</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ARTWORK_PLACEMENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => update('artworkPlacement', p.id as PlushieDesign['artworkPlacement'])}
                  className={optionClass(design.artworkPlacement === p.id)}
                >
                  <div className="font-space font-bold text-xs">
                    {p.label} {p.price > 0 && `(+$${p.price})`}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${design.artworkPlacement === p.id ? 'text-purple-200' : 'text-[#94a3b8]'}`}>
                    {p.description}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 4. Transport card pocket */}
          <section className={sectionClass}>
            <h3 className="font-space font-bold text-lg text-[#0f172a] flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-[#6f2c75]" /> 4. Transport card pocket
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CARD_POCKETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => update('cardPocket', p.id as PlushieDesign['cardPocket'])}
                  className={optionClass(design.cardPocket === p.id)}
                >
                  <div className="font-space font-bold text-xs">
                    {p.label} {p.price > 0 && `(+$${p.price})`}
                  </div>
                  {p.description && (
                    <div className={`text-[11px] mt-0.5 ${design.cardPocket === p.id ? 'text-purple-200' : 'text-[#94a3b8]'}`}>
                      {p.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-3">
              Pockets fit a standard ID-1 card (EZ-Link, SimplyGo, concession and bank cards).
            </p>
          </section>

          {/* 5. Reusable bags */}
          <section className={sectionClass}>
            <h3 className="font-space font-bold text-lg text-[#0f172a] flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-[#6f2c75]" /> 5. Reusable bags
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-[#475569]">Bags stored in the plushie</span>
              <div className="flex items-center border border-[#e2e8f0] rounded">
                <button
                  onClick={() => update('bagCount', Math.max(0, design.bagCount - 1))}
                  disabled={design.bagCount === 0}
                  aria-label="Fewer bags"
                  className="cursor-pointer p-2 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-mono font-bold">{design.bagCount}</span>
                <button
                  onClick={() => update('bagCount', Math.min(MAX_BAGS, design.bagCount + 1))}
                  disabled={design.bagCount === MAX_BAGS}
                  aria-label="More bags"
                  className="cursor-pointer p-2 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            {design.bagCount > 0 && (
              <>
                <span className={labelClass}>Bag style</span>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {BAG_STYLES.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => update('bagStyle', b.id as PlushieDesign['bagStyle'])}
                      className={optionClass(design.bagStyle === b.id)}
                    >
                      <div className="font-space font-bold text-xs">
                        {b.label} (+${b.price} each)
                      </div>
                    </button>
                  ))}
                </div>
                <ColorPicker label="Bag colour" value={design.bagColor} onChange={(c) => update('bagColor', c)} />
              </>
            )}
          </section>

          {/* 6. Notes */}
          <section className={sectionClass}>
            <label className={labelClass} htmlFor="plushie-notes">Notes for our makers (optional)</label>
            <textarea
              id="plushie-notes"
              value={design.notes}
              maxLength={500}
              rows={3}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Anything else? e.g. embroider initials on the foot, match the colours in my drawing…"
              className="w-full p-3 border border-[#e2e8f0] rounded text-sm focus:border-[#6f2c75] focus:ring-2 focus:ring-[#6f2c75]/15 outline-none"
            />
            <div className="text-right text-[11px] text-[#94a3b8]">{design.notes.length}/500</div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ColorPicker: React.FC<{ label: string; value: string; onChange: (color: string) => void }> = ({ label, value, onChange }) => (
  <div className="mb-4 last:mb-0">
    <span className={labelClass}>{label}</span>
    <div className="flex flex-wrap items-center gap-2">
      {PLUSHIE_PALETTE.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          aria-label={`${label} ${color}`}
          aria-pressed={value === color}
          className={`cursor-pointer w-8 h-8 rounded-full border-2 transition-transform ${
            value === color ? 'border-[#0f172a] scale-110' : 'border-[#e2e8f0] hover:scale-105'
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
      <label className="cursor-pointer relative w-8 h-8 rounded-full border-2 border-dashed border-[#cbd5e1] flex items-center justify-center overflow-hidden" title="Custom colour">
        <Plus className="w-4 h-4 text-[#94a3b8]" />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" aria-label={`Custom ${label.toLowerCase()}`} />
      </label>
    </div>
  </div>
);
