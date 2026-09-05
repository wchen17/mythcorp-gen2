// Walkthrough: /wc/learn/plain-mode

/** Luminance ramp, sparse to dense. Index 0 is drawn as nothing. */
export const RAMP = ' .:-=+*#%@';

/** Cell height as a multiple of cell width, so glyphs are not squashed. */
export const CELL_ASPECT = 1.6;

/** Below this, a cell draws nothing, so an idle field costs almost no fills.
 *  It is also what makes the words readable: the vortices smear dye across the
 *  whole grid, and at a low floor that drift draws as loudly as the message.
 *  Cutting it here leaves the re-inked source cells standing alone. */
const FLOOR = 0.3;

export type RenderTarget = {
  ctx: CanvasRenderingContext2D;
  cols: number;
  rows: number;
  cell: number;
  ink: string;
  fontFamily: string;
};

/**
 * Quantize a float dye field into characters. The ramp does the work a
 * gradient would do in a shader; alpha on top buys back the resolution
 * the ten-step ramp throws away.
 */
export function renderField(dye: Float32Array, t: RenderTarget, width: number, height: number) {
  const { ctx, cols, rows, cell, ink, fontFamily } = t;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = ink;
  ctx.font = `${cell}px ${fontFamily}`;
  ctx.textBaseline = 'top';

  const last = RAMP.length - 1;
  const cellH = cell * CELL_ASPECT;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = dye[y * cols + x];
      if (v < FLOOR) continue;
      const level = Math.min(last, Math.floor(v * last) + 1);
      ctx.globalAlpha = Math.min(0.96, 0.1 + v * 0.85);
      ctx.fillText(RAMP[level], x * cell, y * cellH);
    }
  }
  ctx.globalAlpha = 1;
}
