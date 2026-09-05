'use client';

/**
 * The message, drawn to a PNG data URL so it can be fed to the same object
 * pipeline that renders the spectre. Those components fetch their `src` and
 * sniff the bytes, and a data: URI satisfies both, so the words can become a
 * particle cloud without shipping an asset or a second code path.
 *
 * The sampler keys on alpha, so this draws solid white on transparent and
 * lets the component tint it.
 */
const WIDTH = 1400;
const PAD = 0.06;

let cache: { key: string; url: string } | null = null;

export function renderMessageImage(
  lines: readonly string[],
  fontFamily: string,
): string | null {
  if (typeof document === 'undefined' || lines.length === 0) return null;

  const key = `${lines.join('|')}::${fontFamily}`;
  if (cache && cache.key === key) return cache.url;

  const probe = document.createElement('canvas').getContext('2d');
  if (!probe) return null;

  const REF = 100;
  probe.font = `700 ${REF}px ${fontFamily}`;
  const widest = Math.max(...lines.map((l) => probe.measureText(l).width), 1);
  const size = (WIDTH * (1 - PAD * 2)) / widest * REF;
  const lineHeight = size * 1.12;
  const height = Math.ceil(lineHeight * lines.length + size * PAD * 2);

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.font = `700 ${size}px ${fontFamily}`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const top = (height - lineHeight * (lines.length - 1)) / 2;
  lines.forEach((line, i) => ctx.fillText(line, WIDTH / 2, top + i * lineHeight));

  const url = canvas.toDataURL('image/png');
  cache = { key, url };
  return url;
}
