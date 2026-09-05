// Walkthrough: /wc/learn/plain-mode

/**
 * Vorticity confinement, which buys back some of what advection eats.
 *
 * Semi-Lagrangian advection is stable precisely because it is a blur: every
 * step reads a bilinear average, so small eddies lose amplitude every frame
 * and the motion goes soft within a second. Confinement measures the curl that
 * is left, finds which way the curl is getting stronger, and nudges each cell
 * along that direction so a dying eddy is pushed back up instead of flattening.
 *
 * Three guards keep it from being an energy pump. The force is clamped per
 * cell, which bounds the steady state: with the solver decaying velocity by
 * `decay` every frame, a cap of C settles at C / (1 - decay) rather than
 * climbing, so an untouched field still settles instead of feeding itself. The
 * gradient is normalised before use, so the direction comes from the curl field
 * but the magnitude comes only from the local curl and the strength constant;
 * an early version skipped that and the force scaled with the square of the
 * curl, which turned single-cell noise into permanent speckle. And curl below
 * QUIET is left alone, which is both the honest thing to do, since at that
 * amplitude it is rounding error rather than an eddy, and by far the largest
 * saving here: the field is mostly still most of the time, and skipping those
 * cells before the square root takes the pass from 0.68ms to 0.10ms on a
 * 320 x 112 grid.
 */

/** Curl below this is numerical noise, not rotation worth confining. */
const QUIET = 2e-4;
export type VorticityPass = (
  vx: Float32Array,
  vy: Float32Array,
  cols: number,
  rows: number,
  strength: number,
  cap: number,
) => void;

export function createVorticityPass(): VorticityPass {
  let curl = new Float32Array(0);

  return (vx, vy, cols, rows, strength, cap) => {
    if (strength <= 0 || cols < 5 || rows < 5) return;
    const n = cols * rows;
    // The borders are never written, so a fresh array leaves them at zero and
    // they stay there. That is deliberate: a curl value invented at the edge
    // would drive a permanent jet along the frame.
    if (curl.length !== n) curl = new Float32Array(n);

    for (let y = 1; y < rows - 1; y++) {
      const row = y * cols;
      for (let x = 1; x < cols - 1; x++) {
        const i = row + x;
        curl[i] = (vy[i + 1] - vy[i - 1] - vx[i + cols] + vx[i - cols]) * 0.5;
      }
    }

    for (let y = 2; y < rows - 2; y++) {
      const row = y * cols;
      for (let x = 2; x < cols - 2; x++) {
        const i = row + x;
        const w = curl[i];
        if (w < QUIET && w > -QUIET) continue;
        const gx = Math.abs(curl[i + 1]) - Math.abs(curl[i - 1]);
        const gy = Math.abs(curl[i + cols]) - Math.abs(curl[i - cols]);
        const len = Math.sqrt(gx * gx + gy * gy);
        if (len < 1e-7) continue;
        const s = (strength * w) / len;
        let fx = gy * s;
        let fy = -gx * s;
        if (fx > cap) fx = cap;
        else if (fx < -cap) fx = -cap;
        if (fy > cap) fy = cap;
        else if (fy < -cap) fy = -cap;
        vx[i] += fx;
        vy[i] += fy;
      }
    }
  };
}
