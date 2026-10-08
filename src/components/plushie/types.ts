export interface PlushieDesign {
  name: string;
  base: 'bear' | 'bunny' | 'cat' | 'bus' | 'blob';
  size: 'mini' | 'regular' | 'jumbo';
  eyes: 'button' | 'sleepy' | 'sparkle';
  bodyColor: string;
  accentColor: string;
  cardPocket: 'none' | 'back-slot' | 'window';
  bagCount: number;
  bagStyle: 'tote' | 'drawstring';
  bagColor: string;
  artworkPlacement: 'reference' | 'belly' | 'full';
  notes: string;
}

export interface PlushieQuote {
  lines: { label: string; amount: number }[];
  total: number;
  currency: string;
}

export interface SavedPlushie {
  id: string;
  createdAt: string;
  design: PlushieDesign;
  quote: PlushieQuote;
  artworkUrl: string | null;
}
