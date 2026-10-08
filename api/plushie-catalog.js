/**
 * Plushie Studio catalog: the single source of truth for design options and
 * pricing. Imported by both the Express API (to validate and price orders) and
 * the React designer (to render choices), so the two can never disagree.
 */

export const PLUSHIE_BASES = [
  { id: 'bear', label: 'Classic Bear', price: 28 },
  { id: 'bunny', label: 'Floppy Bunny', price: 30 },
  { id: 'cat', label: 'Commuter Cat', price: 29 },
  { id: 'bus', label: 'Double-Decker Bus', price: 34 },
  { id: 'blob', label: 'Squishy Blob', price: 24 },
];

export const PLUSHIE_SIZES = [
  { id: 'mini', label: 'Mini (12 cm)', multiplier: 0.8 },
  { id: 'regular', label: 'Regular (22 cm)', multiplier: 1 },
  { id: 'jumbo', label: 'Jumbo (40 cm)', multiplier: 1.6 },
];

export const PLUSHIE_EYES = [
  { id: 'button', label: 'Button' },
  { id: 'sleepy', label: 'Sleepy' },
  { id: 'sparkle', label: 'Sparkle' },
];

export const PLUSHIE_PALETTE = [
  '#f5e6d3', '#d9a066', '#8b5a2b', '#f7c6d9', '#c3b1e1',
  '#a8d8ea', '#b5e48c', '#ffd166', '#ef476f', '#6f2c75',
  '#eb651b', '#2b2d42', '#ffffff',
];

export const CARD_POCKETS = [
  { id: 'none', label: 'No card pocket', price: 0 },
  { id: 'back-slot', label: 'Back slot pocket', price: 5,
    description: 'Hidden slip pocket on the back. Tap the plushie on the reader to pay.' },
  { id: 'window', label: 'Clear-window pocket', price: 7,
    description: 'Zipped belly pocket with a clear window so your card stays visible.' },
];

export const BAG_STYLES = [
  { id: 'tote', label: 'Fold-away tote', price: 6 },
  { id: 'drawstring', label: 'Drawstring sack', price: 4 },
];

export const MAX_BAGS = 3;

export const ARTWORK_PLACEMENTS = [
  { id: 'reference', label: 'Reference only', price: 0,
    description: 'Our makers use your image as inspiration for colours and features.' },
  { id: 'belly', label: 'Printed belly patch', price: 6,
    description: 'Your image printed on a soft fabric patch on the front.' },
  { id: 'full', label: 'All-over print', price: 15,
    description: 'Your image printed across the whole body fabric.' },
];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const findById = (list, id) => list.find((item) => item.id === id);

/** Default design used when the studio first opens. */
export function defaultDesign() {
  return {
    name: '',
    base: 'bear',
    size: 'regular',
    eyes: 'button',
    bodyColor: '#d9a066',
    accentColor: '#f5e6d3',
    cardPocket: 'back-slot',
    bagCount: 1,
    bagStyle: 'tote',
    bagColor: '#6f2c75',
    artworkPlacement: 'reference',
    notes: '',
  };
}

/**
 * Validates a design submitted by a client. Returns { design } with a cleaned
 * copy on success or { errors } listing every problem found.
 */
export function validateDesign(input) {
  const errors = [];
  if (!input || typeof input !== 'object') {
    return { errors: ['Design must be an object.'] };
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!name) errors.push('Give your plushie a name.');
  if (name.length > 40) errors.push('Name must be 40 characters or fewer.');

  if (!findById(PLUSHIE_BASES, input.base)) errors.push('Unknown plushie base.');
  if (!findById(PLUSHIE_SIZES, input.size)) errors.push('Unknown size.');
  if (!findById(PLUSHIE_EYES, input.eyes)) errors.push('Unknown eye style.');
  if (!HEX_COLOR.test(input.bodyColor ?? '')) errors.push('Body colour must be a hex colour.');
  if (!HEX_COLOR.test(input.accentColor ?? '')) errors.push('Accent colour must be a hex colour.');
  if (!findById(CARD_POCKETS, input.cardPocket)) errors.push('Unknown card pocket option.');

  const bagCount = Number(input.bagCount);
  if (!Number.isInteger(bagCount) || bagCount < 0 || bagCount > MAX_BAGS) {
    errors.push(`Reusable bags must be between 0 and ${MAX_BAGS}.`);
  }
  if (!findById(BAG_STYLES, input.bagStyle)) errors.push('Unknown bag style.');
  if (!HEX_COLOR.test(input.bagColor ?? '')) errors.push('Bag colour must be a hex colour.');
  if (!findById(ARTWORK_PLACEMENTS, input.artworkPlacement)) errors.push('Unknown artwork placement.');

  const notes = typeof input.notes === 'string' ? input.notes.trim() : '';
  if (notes.length > 500) errors.push('Notes must be 500 characters or fewer.');

  if (errors.length) return { errors };

  return {
    design: {
      name,
      base: input.base,
      size: input.size,
      eyes: input.eyes,
      bodyColor: input.bodyColor.toLowerCase(),
      accentColor: input.accentColor.toLowerCase(),
      cardPocket: input.cardPocket,
      bagCount,
      bagStyle: input.bagStyle,
      bagColor: input.bagColor.toLowerCase(),
      artworkPlacement: input.artworkPlacement,
      notes,
    },
  };
}

/**
 * Prices a design. Artwork placement is only charged when an image is
 * attached, since there is nothing to print otherwise.
 */
export function priceDesign(design, hasArtwork) {
  const base = findById(PLUSHIE_BASES, design.base);
  const size = findById(PLUSHIE_SIZES, design.size);
  const pocket = findById(CARD_POCKETS, design.cardPocket);
  const bag = findById(BAG_STYLES, design.bagStyle);
  const artwork = findById(ARTWORK_PLACEMENTS, design.artworkPlacement);

  const lines = [
    { label: `${base.label} — ${size.label}`, amount: round(base.price * size.multiplier) },
  ];
  if (pocket.price) lines.push({ label: pocket.label, amount: pocket.price });
  if (design.bagCount > 0) {
    lines.push({ label: `${design.bagCount} × ${bag.label}`, amount: design.bagCount * bag.price });
  }
  if (hasArtwork && artwork.price) lines.push({ label: artwork.label, amount: artwork.price });

  const total = round(lines.reduce((sum, line) => sum + line.amount, 0));
  return { lines, total, currency: 'SGD' };
}

function round(value) {
  return Math.round(value * 100) / 100;
}
