'use client';

// Walkthrough: /og/doubt
// Two small, honest figures: the solar module learning curve (log scale) and
// the global EV share scrubber. Numbers are approximate anchors, sourced in
// the essay; the point is the shape of the curve, not three-digit precision.

import { useMemo, useState } from 'react';

// --- Solar module price, USD per watt (approximate anchors) ---
// 1977 ~ $76.67/W, 2014 ~ $0.36/W, 2023 ~ $0.22/W, early 2024 ~ $0.11/W.
const SOLAR = [
  { year: 1977, usd: 76.67 },
  { year: 2014, usd: 0.36 },
  { year: 2023, usd: 0.22 },
  { year: 2024, usd: 0.11 },
] as const;

const W = 640;
const H = 280;
const PAD = { l: 52, r: 16, t: 16, b: 34 };

function SolarCurve() {
  const [hover, setHover] = useState<number | null>(null);

  // xOf is not returned: it is only needed to build pts inside the memo, while
  // yOf is also used outside for the gridlines.
  const { pts, yOf } = useMemo(() => {
    const years = SOLAR.map((d) => d.year);
    const minY = Math.min(...years);
    const maxY = Math.max(...years);
    // log10 price domain: ~1.885 (76.67) down to ~-0.96 (0.11)
    const logMax = Math.log10(100);
    const logMin = Math.log10(0.1);
    const xOf = (yr: number) =>
      PAD.l + ((yr - minY) / (maxY - minY)) * (W - PAD.l - PAD.r);
    const yOf = (usd: number) => {
      const t = (Math.log10(usd) - logMin) / (logMax - logMin);
      return PAD.t + (1 - t) * (H - PAD.t - PAD.b);
    };
    const pts = SOLAR.map((d) => ({ ...d, x: xOf(d.year), y: yOf(d.usd) }));
    return { pts, yOf };
  }, []);

  const gridUsd = [100, 10, 1, 0.1];

  return (
    <figure className="themed-surface p-5">
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-soft)]">
        solar module price, USD / watt (log scale)
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img"
           aria-label="Solar module price falling from about 77 dollars per watt in 1977 to about 0.11 dollars per watt in 2024">
        {gridUsd.map((u) => (
          <g key={u}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yOf(u)} y2={yOf(u)}
                  stroke="var(--border)" strokeWidth={1} strokeDasharray="2 4" />
            <text x={PAD.l - 8} y={yOf(u) + 3} textAnchor="end"
                  className="fill-[color:var(--fg-subtle)]" style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>
              ${u}
            </text>
          </g>
        ))}
        <polyline
          points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none" stroke="var(--accent)" strokeWidth={2.5}
          style={{ filter: 'drop-shadow(0 0 6px var(--accent-glow))' }}
        />
        {pts.map((p) => (
          <g key={p.year} onMouseEnter={() => setHover(p.year)} onMouseLeave={() => setHover(null)}>
            <circle cx={p.x} cy={p.y} r={hover === p.year ? 6 : 4}
                    fill="var(--accent-soft)" stroke="var(--bg)" strokeWidth={1.5} />
            <text x={p.x} y={H - 10} textAnchor="middle"
                  className="fill-[color:var(--fg-muted)]" style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>
              {p.year}
            </text>
            {hover === p.year && (
              <text x={p.x} y={p.y - 12} textAnchor="middle"
                    className="fill-[color:var(--fg)]" style={{ fontSize: 12, fontWeight: 600 }}>
                ${p.usd}/W
              </text>
            )}
          </g>
        ))}
      </svg>
      <p className="mt-2 text-xs text-[color:var(--fg-subtle)]">
        Swanson&rsquo;s law: roughly 23% cheaper per doubling of cumulative volume, about a 75% drop per decade.
        Hover a point. Values approximate.
      </p>
    </figure>
  );
}

// --- Global EV share of new car sales (approximate anchors) ---
const EV_ANCHORS: Record<number, number> = {
  2013: 0.3, 2018: 2, 2020: 4.2, 2022: 14, 2023: 18, 2024: 21,
};
const EV_YEARS = Object.keys(EV_ANCHORS).map(Number).sort((a, b) => a - b);

function evShareAt(year: number): number {
  if (EV_ANCHORS[year] != null) return EV_ANCHORS[year];
  let lo = EV_YEARS[0];
  let hi = EV_YEARS[EV_YEARS.length - 1];
  for (let i = 0; i < EV_YEARS.length - 1; i++) {
    if (year >= EV_YEARS[i] && year <= EV_YEARS[i + 1]) {
      lo = EV_YEARS[i]; hi = EV_YEARS[i + 1]; break;
    }
  }
  const t = (year - lo) / (hi - lo || 1);
  return EV_ANCHORS[lo] + (EV_ANCHORS[hi] - EV_ANCHORS[lo]) * t;
}

function EvAdoption() {
  const [year, setYear] = useState(2024);
  const share = evShareAt(year);

  return (
    <figure className="themed-surface p-5">
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-soft)]">
        global EV share of new car sales
      </figcaption>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-serif text-5xl font-semibold text-[color:var(--accent-soft)]"
              style={{ textShadow: '0 0 16px var(--accent-glow)' }}>
          {share.toFixed(share < 1 ? 1 : 0)}%
        </span>
        <span className="font-mono text-sm text-[color:var(--fg-muted)]">in {year}</span>
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[color:var(--bg)] border border-[color:var(--border)]">
        <div
          className="h-full rounded-full bg-[color:var(--accent)]"
          style={{ width: `${share}%`, transition: 'width 200ms var(--motion-ease)' }}
        />
      </div>

      <input
        type="range" min={2013} max={2024} step={1} value={year}
        onChange={(e) => setYear(parseInt(e.target.value, 10))}
        className="mt-4 w-full accent-[color:var(--accent)]"
        aria-label="Year"
      />
      <div className="flex justify-between font-mono text-[10px] text-[color:var(--fg-subtle)]">
        <span>2013</span><span>2024</span>
      </div>
      <p className="mt-2 text-xs text-[color:var(--fg-subtle)]">
        From a rounding error to one in five cars in about a decade. In-between years interpolated; anchors approximate.
      </p>
    </figure>
  );
}

export function ProgressFigures() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <SolarCurve />
      <EvAdoption />
    </div>
  );
}
