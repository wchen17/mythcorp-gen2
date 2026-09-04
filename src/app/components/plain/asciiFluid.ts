// Walkthrough: /wc/learn/plain-mode

import { CELL_ASPECT, renderField, type RenderTarget } from './asciiRender';

export type AsciiFluidOptions = {
  /** Pixel size of one character cell at CSS scale. Smaller = denser, costlier. */
  cell?: number;
  /** Ink colour for the glyphs. Read from a CSS variable by the caller. */
  ink?: string;
  /** Per-frame multiplier on dye and velocity. Below 1, so the field settles. */
  decay?: number;
  /** Low-amplitude wandering vortices, so an untouched field is still alive. */
  ambient?: boolean;
  /**
   * Called after every resize with the new grid. Return a per-cell mask to
   * re-ink every frame (this is how the wordmark survives being smeared),
   * or null for a field that only responds to the pointer.
   */
  source?: (cols: number, rows: number) => Float32Array | null;
  /** Per-frame gain on the source mask. Steady-state dye is gain / (1 - decay). */
  sourceGain?: number;
};

type Field = Float32Array;

const DEFAULTS = {
  cell: 11,
  ink: '#111111',
  decay: 0.985,
  ambient: false,
  sourceGain: 0.014,
};

export function createAsciiFluid(canvas: HTMLCanvasElement, options: AsciiFluidOptions = {}) {
  const opts = { ...DEFAULTS, ...options };
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { destroy() {}, pointer() {}, restamp() {} };

  let cols = 0;
  let rows = 0;
  let dye: Field = new Float32Array(0);
  let dyeNext: Field = new Float32Array(0);
  let vx: Field = new Float32Array(0);
  let vy: Field = new Float32Array(0);
  let vxNext: Field = new Float32Array(0);
  let vyNext: Field = new Float32Array(0);
  let source: Field | null = null;
  let fontFamily = 'ui-monospace, monospace';
  let raf = 0;
  let running = false;
  let clock = 0;

  const pointer = { x: -1, y: -1, dx: 0, dy: 0, active: false };
  const idx = (x: number, y: number) => y * cols + x;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;

    // ctx.font does not resolve CSS custom properties, so read the family
    // the element actually computed to and hand the canvas a real stack.
    const computed = window.getComputedStyle(canvas).fontFamily;
    fontFamily = computed ? `${computed}, ui-monospace, monospace` : fontFamily;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.max(2, Math.ceil(w / opts.cell));
    rows = Math.max(2, Math.ceil(h / (opts.cell * CELL_ASPECT)));
    const n = cols * rows;
    dye = new Float32Array(n);
    dyeNext = new Float32Array(n);
    vx = new Float32Array(n);
    vy = new Float32Array(n);
    vxNext = new Float32Array(n);
    vyNext = new Float32Array(n);
    source = opts.source ? opts.source(cols, rows) : null;
  }

  /** Bilinear sample of a field at fractional grid coordinates. */
  function sample(field: Field, x: number, y: number): number {
    const cx = Math.min(cols - 1.001, Math.max(0, x));
    const cy = Math.min(rows - 1.001, Math.max(0, y));
    const x0 = Math.floor(cx);
    const y0 = Math.floor(cy);
    const fx = cx - x0;
    const fy = cy - y0;
    const x1 = Math.min(cols - 1, x0 + 1);
    const y1 = Math.min(rows - 1, y0 + 1);
    const a = field[idx(x0, y0)] * (1 - fx) + field[idx(x1, y0)] * fx;
    const b = field[idx(x0, y1)] * (1 - fx) + field[idx(x1, y1)] * fx;
    return a * (1 - fy) + b * fy;
  }

  function splat(px: number, py: number, radius: number, dyeAdd: number, fx: number, fy: number) {
    for (let y = Math.max(0, Math.floor(py - radius)); y <= Math.min(rows - 1, py + radius); y++) {
      for (let x = Math.max(0, Math.floor(px - radius)); x <= Math.min(cols - 1, px + radius); x++) {
        const d = Math.hypot(x - px, y - py);
        if (d > radius) continue;
        const falloff = 1 - d / radius;
        const i = idx(x, y);
        if (dyeAdd) dye[i] = Math.min(1.4, dye[i] + falloff * dyeAdd);
        vx[i] += fx * falloff;
        vy[i] += fy * falloff;
      }
    }
  }

  function inject() {
    if (!pointer.active) return;
    const force = Math.min(6, Math.hypot(pointer.dx, pointer.dy));
    // A parked cursor must inject nothing, or the field never settles.
    if (force < 0.02) {
      pointer.dx = 0;
      pointer.dy = 0;
      return;
    }
    splat(pointer.x, pointer.y, 3, 0.06 + force * 0.16, pointer.dx * 0.55, pointer.dy * 0.55);
    // Consume the delta so one move is one push, not a held one.
    pointer.dx *= 0.55;
    pointer.dy *= 0.55;
  }

  /**
   * Two vortices wandering on incommensurable Lissajous paths. Their periods
   * do not share a common multiple, so the pattern never actually repeats.
   */
  function ambient() {
    if (!opts.ambient) return;
    clock += 0.006;
    for (let k = 0; k < 2; k++) {
      const p = clock * (k ? 0.73 : 1);
      const cx = (0.5 + 0.34 * Math.sin(p * 1.0 + k * 2.1)) * cols;
      const cy = (0.5 + 0.30 * Math.sin(p * 1.37 + k * 0.7)) * rows;
      const a = p * (k ? -1.9 : 1.3);
      splat(cx, cy, 7, 0, Math.cos(a) * 0.05, Math.sin(a) * 0.05);
    }
  }

  function step() {
    // Advect every field backwards along its own velocity, then blur the
    // result slightly. Tracing backwards can only read values that already
    // exist, which is what makes this unconditionally stable.
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = idx(x, y);
        const sx = x - vx[i];
        const sy = y - vy[i];
        dyeNext[i] = sample(dye, sx, sy) * opts.decay;
        vxNext[i] = sample(vx, sx, sy) * opts.decay;
        vyNext[i] = sample(vy, sx, sy) * opts.decay;
      }
    }
    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        const i = idx(x, y);
        const n = dyeNext[i - 1] + dyeNext[i + 1] + dyeNext[i - cols] + dyeNext[i + cols];
        dyeNext[i] = dyeNext[i] * 0.72 + n * 0.07;
      }
    }
    [dye, dyeNext] = [dyeNext, dye];
    [vx, vxNext] = [vxNext, vx];
    [vy, vyNext] = [vyNext, vy];

    // Re-ink the source last. Constant addition against constant decay
    // settles at gain / (1 - decay), so the mark heals after every smear
    // instead of blinking back all at once.
    if (source) {
      for (let i = 0; i < dye.length; i++) {
        if (source[i] > 0) dye[i] = Math.min(1.4, dye[i] + source[i] * opts.sourceGain);
      }
    }
  }

  const target = (): RenderTarget => ({ ctx: ctx!, cols, rows, cell: opts.cell, ink: opts.ink, fontFamily });

  function frame() {
    if (!running) return;
    inject();
    ambient();
    step();
    renderField(dye, target(), canvas.clientWidth, canvas.clientHeight);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function onVisibility() {
    // A hidden tab throttles rAF to a crawl anyway; stopping outright means
    // the field is not integrating garbage timesteps on return.
    if (document.hidden) stop();
    else start();
  }

  const onResize = () => resize();

  resize();
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  start();

  return {
    /** Feed a client-space pointer position. Deltas become force. */
    pointer(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      const gx = (clientX - rect.left) / opts.cell;
      const gy = (clientY - rect.top) / (opts.cell * CELL_ASPECT);
      if (pointer.active) {
        pointer.dx = gx - pointer.x;
        pointer.dy = gy - pointer.y;
      }
      pointer.x = gx;
      pointer.y = gy;
      pointer.active = true;
    },
    /** Rebuild the source mask, e.g. after the text it renders changes. */
    restamp() {
      source = opts.source ? opts.source(cols, rows) : null;
    },
    destroy() {
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
