// Walkthrough: /wc/learn/plain-mode

export type AsciiFluidOptions = {
  /** Pixel size of one character cell at CSS scale. Smaller = denser, costlier. */
  cell?: number;
  /** Luminance ramp, sparse to dense. Index 0 is drawn as nothing. */
  ramp?: string;
  /** Ink colour for the glyphs. Read from a CSS variable by the caller. */
  ink?: string;
  /** Per-frame multiplier on dye and velocity. Below 1, so the field settles. */
  decay?: number;
};

type Field = Float32Array;

const DEFAULTS = {
  cell: 11,
  ramp: ' .:-=+*#%@',
  ink: '#111111',
  decay: 0.985,
};

/**
 * A semi-Lagrangian advection field rendered as text. Not a full
 * Navier-Stokes solve: no pressure projection, which is the expensive
 * half. Advection plus a diffusion blur plus decay already produces the
 * smearing, curling motion people read as fluid, at a fraction of the cost.
 */
export function createAsciiFluid(canvas: HTMLCanvasElement, options: AsciiFluidOptions = {}) {
  const opts = { ...DEFAULTS, ...options };
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { destroy() {}, setInk() {}, pointer() {} };

  let cols = 0;
  let rows = 0;
  let dye: Field = new Float32Array(0);
  let dyeNext: Field = new Float32Array(0);
  let vx: Field = new Float32Array(0);
  let vy: Field = new Float32Array(0);
  let vxNext: Field = new Float32Array(0);
  let vyNext: Field = new Float32Array(0);
  let ink = opts.ink;
  let fontFamily = 'ui-monospace, monospace';
  let raf = 0;
  let running = false;

  // Pointer state in grid coordinates, plus the delta that becomes force.
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
    // A serif fallback here would be very obvious, so keep a mono tail.
    fontFamily = computed ? `${computed}, ui-monospace, monospace` : fontFamily;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.max(2, Math.ceil(w / opts.cell));
    rows = Math.max(2, Math.ceil(h / (opts.cell * 1.6)));
    const n = cols * rows;
    dye = new Float32Array(n);
    dyeNext = new Float32Array(n);
    vx = new Float32Array(n);
    vy = new Float32Array(n);
    vxNext = new Float32Array(n);
    vyNext = new Float32Array(n);
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

  function inject() {
    if (!pointer.active) return;
    const force = Math.min(6, Math.hypot(pointer.dx, pointer.dy));
    // A parked cursor must inject nothing, or the field never settles.
    if (force < 0.02) {
      pointer.dx = 0;
      pointer.dy = 0;
      return;
    }
    const px = pointer.x;
    const py = pointer.y;
    const radius = 3;
    for (let y = Math.max(0, Math.floor(py - radius)); y <= Math.min(rows - 1, py + radius); y++) {
      for (let x = Math.max(0, Math.floor(px - radius)); x <= Math.min(cols - 1, px + radius); x++) {
        const d = Math.hypot(x - px, y - py);
        if (d > radius) continue;
        const falloff = 1 - d / radius;
        const i = idx(x, y);
        dye[i] = Math.min(1.4, dye[i] + falloff * (0.06 + force * 0.16));
        vx[i] += pointer.dx * falloff * 0.55;
        vy[i] += pointer.dy * falloff * 0.55;
      }
    }
    // Consume the delta so a parked cursor stops pushing.
    pointer.dx *= 0.55;
    pointer.dy *= 0.55;
  }

  function step() {
    // Advect every field backwards along its own velocity, then blur the
    // result slightly. The blur stands in for viscosity and keeps the
    // grid from turning into per-cell noise.
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
        const neighbours =
          dyeNext[i - 1] + dyeNext[i + 1] + dyeNext[i - cols] + dyeNext[i + cols];
        dyeNext[i] = dyeNext[i] * 0.72 + neighbours * 0.07;
      }
    }
    [dye, dyeNext] = [dyeNext, dye];
    [vx, vxNext] = [vxNext, vx];
    [vy, vyNext] = [vyNext, vy];
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx!.clearRect(0, 0, w, h);
    ctx!.fillStyle = ink;
    ctx!.font = `${opts.cell}px ${fontFamily}`;
    ctx!.textBaseline = 'top';

    const ramp = opts.ramp;
    const last = ramp.length - 1;
    const cellH = opts.cell * 1.6;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = dye[idx(x, y)];
        if (v < 0.045) continue;
        const level = Math.min(last, Math.floor(v * last) + 1);
        ctx!.globalAlpha = Math.min(0.85, 0.18 + v * 0.7);
        ctx!.fillText(ramp[level], x * opts.cell, y * cellH);
      }
    }
    ctx!.globalAlpha = 1;
  }

  function frame() {
    if (!running) return;
    inject();
    step();
    draw();
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
    // A hidden tab throttles rAF to a crawl anyway; stopping outright
    // means the field is not integrating garbage timesteps on return.
    if (document.hidden) stop();
    else start();
  }

  const onResize = () => {
    resize();
  };

  resize();
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  start();

  return {
    /** Feed a client-space pointer position. Deltas become force. */
    pointer(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      const gx = (clientX - rect.left) / opts.cell;
      const gy = (clientY - rect.top) / (opts.cell * 1.6);
      if (pointer.active) {
        pointer.dx = gx - pointer.x;
        pointer.dy = gy - pointer.y;
      }
      pointer.x = gx;
      pointer.y = gy;
      pointer.active = true;
    },
    setInk(next: string) {
      ink = next;
    },
    destroy() {
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
