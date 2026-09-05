// Walkthrough: /wc/learn/plain-mode

import { CELL_ASPECT } from './asciiRender';

export type VortexRingSpec = {
  dye: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  cols: number;
  rows: number;
  /** Centre, in grid cells. */
  x: number;
  y: number;
  /** Outer edge, in cell widths. Nothing beyond it is touched. */
  radius: number;
  /** Rotation direction, 1 or -1. */
  spin: number;
  /** Peak tangential speed, cells per frame. */
  swirl: number;
  /** Peak outward speed. Small, or the ring is a blast rather than a roll. */
  push: number;
  /** Peak dye laid down. */
  ink: number;
  /** Dye clamp, matching the solver's. */
  ceiling: number;
};

/**
 * One rotating burst, hollow in the middle.
 *
 * A plain radial blob was the first attempt and it read as a thump rather than
 * a disturbance. Pure outward velocity has no curl in it, so advection carried
 * it straight out and it was over before the eye caught anything, and the dye
 * it dropped sat squarely on top of whatever letter had been pressed. Weighting
 * the whole ring by sin(pi * d / radius) moves the energy into an annulus
 * instead: the centre is left alone, so pressing a letter does not bury it, and
 * the front has something to roll against. Most of the speed is tangential and
 * the radial part only exists to make the ring grow.
 *
 * The distance is measured in screen proportions, not grid indices. A grid cell
 * is CELL_ASPECT times taller than it is wide, so a circle in index space draws
 * as an ellipse stretched by that factor, which on a ring is impossible to miss.
 * Offsets go into screen units before the distance, and the tangential velocity
 * comes back out of them, because the velocity field is in index units.
 */
export function stampVortexRing(s: VortexRingSpec) {
  const { dye, vx, vy, cols, rows, x, y, radius, spin, swirl, push, ink, ceiling } = s;
  if (radius <= 0) return;

  const spanY = radius / CELL_ASPECT;
  const x0 = Math.max(0, Math.floor(x - radius));
  const x1 = Math.min(cols - 1, Math.ceil(x + radius));
  const y0 = Math.max(0, Math.floor(y - spanY));
  const y1 = Math.min(rows - 1, Math.ceil(y + spanY));

  for (let gy = y0; gy <= y1; gy++) {
    const oy = (gy - y) * CELL_ASPECT;
    for (let gx = x0; gx <= x1; gx++) {
      const ox = gx - x;
      const d = Math.sqrt(ox * ox + oy * oy);
      if (d > radius || d < 1e-4) continue;

      const ring = Math.sin(Math.PI * (d / radius));
      const nx = ox / d;
      const ny = oy / d;
      const i = gy * cols + gx;

      vx[i] += (-ny * spin * swirl + nx * push) * ring;
      vy[i] += (nx * spin * swirl + ny * push) * ring / CELL_ASPECT;

      const next = dye[i] + ink * ring;
      dye[i] = next > ceiling ? ceiling : next;
    }
  }
}
