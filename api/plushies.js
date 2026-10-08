import express from 'express';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import {
  validateDesign,
  priceDesign,
  MAX_IMAGE_BYTES,
} from './plushie-catalog.js';

const router = express.Router();

// Designs are stored as JSON on disk next to their uploaded artwork:
//   <dataDir>/<id>/design.json
//   <dataDir>/<id>/artwork.<ext>
const dataDir = path.resolve(process.env.PLUSHIE_DATA_DIR || 'data/plushies');

const ID_PATTERN = /^[a-f0-9]{16}$/;

// Detect the image type from its magic bytes rather than trusting the
// client-declared MIME type.
function detectImageType(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mime: 'image/png', ext: 'png' };
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: 'image/jpeg', ext: 'jpg' };
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { mime: 'image/webp', ext: 'webp' };
  }
  return null;
}

function decodeArtwork(dataUrl) {
  const match = /^data:image\/[a-z+]+;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) return { error: 'Artwork must be a base64 image data URL.' };
  const buffer = Buffer.from(match[1], 'base64');
  if (buffer.length > MAX_IMAGE_BYTES) {
    return { error: `Artwork must be ${MAX_IMAGE_BYTES / (1024 * 1024)} MB or smaller.` };
  }
  const type = detectImageType(buffer);
  if (!type) return { error: 'Artwork must be a PNG, JPEG or WebP image.' };
  return { buffer, type };
}

async function readDesign(id) {
  if (!ID_PATTERN.test(id)) return null;
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir, id, 'design.json'), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

// Price a design without saving it, so the UI can show a server-confirmed quote.
router.post('/quote', (req, res) => {
  const { design, errors } = validateDesign(req.body?.design);
  if (errors) return res.status(400).json({ errors });
  res.json(priceDesign(design, Boolean(req.body?.hasArtwork)));
});

router.post('/', async (req, res) => {
  const { design, errors } = validateDesign(req.body?.design);
  if (errors) return res.status(400).json({ errors });

  let artwork = null;
  if (req.body.artwork) {
    const decoded = decodeArtwork(req.body.artwork);
    if (decoded.error) return res.status(400).json({ errors: [decoded.error] });
    artwork = decoded;
  }

  const id = crypto.randomBytes(8).toString('hex');
  const dir = path.join(dataDir, id);
  const record = {
    id,
    createdAt: new Date().toISOString(),
    design,
    artwork: artwork ? { file: `artwork.${artwork.type.ext}`, mime: artwork.type.mime } : null,
    quote: priceDesign(design, Boolean(artwork)),
  };

  try {
    await fs.mkdir(dir, { recursive: true });
    if (artwork) await fs.writeFile(path.join(dir, record.artwork.file), artwork.buffer);
    await fs.writeFile(path.join(dir, 'design.json'), JSON.stringify(record, null, 2));
  } catch (err) {
    console.error('Failed to save plushie design:', err);
    return res.status(500).json({ errors: ['Could not save your design. Please try again.'] });
  }

  res.status(201).json(toResponse(record));
});

router.get('/:id', async (req, res) => {
  const record = await readDesign(req.params.id);
  if (!record) return res.status(404).json({ errors: ['Design not found.'] });
  res.json(toResponse(record));
});

router.get('/:id/artwork', async (req, res) => {
  const record = await readDesign(req.params.id);
  if (!record?.artwork) return res.status(404).json({ errors: ['Artwork not found.'] });
  res.type(record.artwork.mime);
  res.set('X-Content-Type-Options', 'nosniff');
  res.sendFile(path.join(dataDir, record.id, record.artwork.file));
});

function toResponse(record) {
  return {
    id: record.id,
    createdAt: record.createdAt,
    design: record.design,
    quote: record.quote,
    artworkUrl: record.artwork ? `/api/plushies/${record.id}/artwork` : null,
  };
}

export default router;
