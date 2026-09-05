// Walkthrough: /wc/learn/plain-mode

import { CELL_ASPECT } from './asciiRender';

/** Supersample factor. Rendering big and averaging down is what turns hard
 *  glyph edges into the grey levels the character ramp needs. */
const SS = 4;

export type TextMaskOptions = {
  /** Fraction of grid width the widest line should occupy. */
  fill?: number;
  /** Vertical centre, 0 to 1. */
  centre?: number;
  /** Line height as a multiple of the font size. */
  lineHeight?: number;
  fontFamily?: string;
  fontWeight?: string;
};

/**
 * Render text into a per-cell coverage mask in 0..1. Nothing about this is
 * DOM text: the words become dye, so the field IS the wordmark, and the
 * cursor smears the letters the same way it smears everything else.
 */
export function renderTextMask(
  lines: string[],
  cols: number,
  rows: number,
  options: TextMaskOptions = {},
): Float32Array | null {
  const { fill = 0.6, centre = 0.5, lineHeight = 1.32,
          fontFamily = 'ui-monospace, monospace', fontWeight = '700' } = options;

  const mask = new Float32Array(cols * rows);
  if (typeof document === 'undefined' || cols < 2 || rows < 2) return mask;

  const off = document.createElement('canvas');
  off.width = cols * SS;
  off.height = rows * SS;
  const ctx = off.getContext('2d');
  if (!ctx) return mask;

  // A cell is drawn CELL_ASPECT times taller than it is wide, but the mask is
  // sampled on a square grid, so type laid out here comes out stretched by
  // that factor on screen. Draw into a space that is CELL_ASPECT taller and
  // squash it back down, and the letters keep their real proportions.
  const drawHeight = off.height * CELL_ASPECT;
  ctx.setTransform(1, 0, 0, 1 / CELL_ASPECT, 0, 0);

  // Size the type by measuring at a reference size and scaling, rather than
  // guessing: one measureText beats a loop that creeps up on a fit.
  const REF = 100;
  ctx.font = `${fontWeight} ${REF}px ${fontFamily}`;
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 1);
  const byWidth = (off.width * fill) / widest * REF;
  const byHeight = (drawHeight * 0.7) / (lines.length * lineHeight);
  const size = Math.max(4, Math.min(byWidth, byHeight));

  ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const step = size * lineHeight;
  const top = drawHeight * centre - ((lines.length - 1) * step) / 2;
  lines.forEach((line, i) => ctx.fillText(line, off.width / 2, top + i * step));
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Box-average each SS x SS block down to one cell.
  const px = ctx.getImageData(0, 0, off.width, off.height).data;
  const inv = 1 / (SS * SS * 255);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let sum = 0;
      for (let dy = 0; dy < SS; dy++) {
        const row = ((y * SS + dy) * off.width + x * SS) * 4 + 3;
        for (let dx = 0; dx < SS; dx++) sum += px[row + dx * 4];
      }
      mask[y * cols + x] = sum * inv;
    }
  }
  return mask;
}
