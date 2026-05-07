'use client';

import { useRef, useState } from 'react';

// Three policy levers as a triangle. Drag the point inside the triangle;
// barycentric coordinates give a "blend" of open-source / regulation /
// antitrust emphasis. The verdict text reads off which threat surfaces
// are still exposed at that blend.

type Vertex = { id: 'open' | 'regulate' | 'antitrust'; label: string; blurb: string; x: number; y: number };

const W = 360;
const H = 320;

const VERTICES: ReadonlyArray<Vertex> = [
  { id: 'open',       label: 'OPEN-SOURCE',  blurb: 'broad access',   x: W / 2,        y: 32 },
  { id: 'regulate',   label: 'REGULATION',   blurb: 'rules + audits', x: 36,           y: H - 36 },
  { id: 'antitrust',  label: 'ANTITRUST',    blurb: 'no concentration', x: W - 36,     y: H - 36 },
];

function barycentric(px: number, py: number) {
  const [a, b, c] = VERTICES;
  const denom = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  const u = ((b.y - c.y) * (px - c.x) + (c.x - b.x) * (py - c.y)) / denom;
  const v = ((c.y - a.y) * (px - c.x) + (a.x - c.x) * (py - c.y)) / denom;
  const w = 1 - u - v;
  return { open: u, regulate: v, antitrust: w };
}

function clampToTriangle(px: number, py: number): { x: number; y: number } {
  const b = barycentric(px, py);
  if (b.open >= 0 && b.regulate >= 0 && b.antitrust >= 0) return { x: px, y: py };
  // Project onto the nearest edge by clamping the smallest barycentric to 0
  // and renormalising. Good enough for a UI handle.
  const u = Math.max(0, b.open);
  const v = Math.max(0, b.regulate);
  const w = Math.max(0, b.antitrust);
  const sum = u + v + w || 1;
  const nu = u / sum;
  const nv = v / sum;
  const nw = w / sum;
  const [a, bb, c] = VERTICES;
  return {
    x: nu * a.x + nv * bb.x + nw * c.x,
    y: nu * a.y + nv * bb.y + nw * c.y,
  };
}

function verdict(b: { open: number; regulate: number; antitrust: number }): string {
  const ranked: Array<[string, number]> = [
    ['open', b.open],
    ['regulate', b.regulate],
    ['antitrust', b.antitrust],
  ];
  ranked.sort((a, c) => c[1] - a[1]);
  const lowest = ranked[2][0];
  if (lowest === 'open') return 'Closed weights leave outsider research blind. Independent audit gets harder.';
  if (lowest === 'regulate') return 'Without rules + audit teeth, frontier capability ships faster than mitigation.';
  return 'Concentration of compute lets a few firms set both threat and defence. Lock-in risk grows.';
}

export function GovernanceTrilemma() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pt, setPt] = useState({ x: W / 2, y: H * 0.55 });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    movePoint(e);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    movePoint(e);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const movePoint = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    setPt(clampToTriangle(x, y));
  };

  const b = barycentric(pt.x, pt.y);

  return (
    <div className="themed-surface mt-6 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        governance trilemma
      </p>
      <p className="mt-1 text-xs text-[color:var(--fg-muted)]">
        drag the point. the verdict reads off which threat surface stays open.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-[auto,1fr]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          role="img"
          aria-label="governance trilemma triangle"
          className="touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <polygon
            points={VERTICES.map((v) => `${v.x},${v.y}`).join(' ')}
            fill="color-mix(in srgb, var(--accent) 8%, transparent)"
            stroke="var(--border-strong)"
            strokeWidth={1.5}
          />
          {VERTICES.map((v) => (
            <g key={v.id}>
              <circle cx={v.x} cy={v.y} r={6} fill="var(--accent)" />
              <text
                x={v.x}
                y={v.y - 14}
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill="var(--fg)"
                textAnchor="middle"
              >
                {v.label}
              </text>
              <text
                x={v.x}
                y={v.y + 22}
                fontFamily="var(--font-mono)"
                fontSize="9"
                fill="var(--fg-subtle)"
                textAnchor="middle"
              >
                {v.blurb}
              </text>
            </g>
          ))}
          <circle cx={pt.x} cy={pt.y} r={10} fill="var(--accent-warm)" stroke="var(--bg)" strokeWidth={2} />
        </svg>

        <div>
          <div className="flex flex-col gap-2">
            <Bar label="open-source"   value={b.open} />
            <Bar label="regulation"    value={b.regulate} />
            <Bar label="antitrust"     value={b.antitrust} />
          </div>
          <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-overlay)] p-4 text-sm leading-relaxed text-[color:var(--fg)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
              verdict
            </p>
            <p className="mt-2">{verdict(b)}</p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-[color:var(--fg-subtle)]">
        Adapted from Section 8 (countermeasures) of the source paper. The blend
        verdict is my reading; reasonable people will disagree.
      </p>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-muted)]">
          {label}
        </span>
        <span className="font-mono text-[10px] text-[color:var(--fg-subtle)]">{pct.toFixed(0)}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--bg)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-warm))',
            transition: 'width 200ms ease',
          }}
        />
      </div>
    </div>
  );
}
