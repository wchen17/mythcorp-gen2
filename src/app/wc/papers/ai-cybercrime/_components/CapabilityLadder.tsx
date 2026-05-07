'use client';

// Vertical Stage 1-4 ladder. Each rung lists the technical hurdles a model
// has to clear to operate at that stage and the open-questions that gate
// the next rung. Stages 3 and 4 are projection and visually muted to keep
// evidence and forecast distinguishable, per the reviewer's note.

type Stage = {
  id: 1 | 2 | 3 | 4;
  title: string;
  blurb: string;
  hurdles: string[];
  status: 'observed' | 'partial' | 'projection';
  yearWindow: string;
};

const STAGES: ReadonlyArray<Stage> = [
  {
    id: 1,
    title: 'Assistant',
    blurb: 'Useful in the hands of an operator. No initiative.',
    hurdles: ['plain-language code generation', 'pattern recognition over short context'],
    status: 'observed',
    yearWindow: 'today',
  },
  {
    id: 2,
    title: 'Operator',
    blurb: 'Multi-step tasks under supervision; brittle on novelty.',
    hurdles: ['tool use', 'short-horizon planning', 'reliable retry'],
    status: 'partial',
    yearWindow: '2024-2026',
  },
  {
    id: 3,
    title: 'Agent',
    blurb: 'Cross-domain reasoning, persistent memory, novel attacks.',
    hurdles: ['long-horizon planning', 'memory + state', 'cross-tool synthesis'],
    status: 'projection',
    yearWindow: '2027-2030',
  },
  {
    id: 4,
    title: 'Self-improving',
    blurb: 'Discovers vulnerabilities and trains successors. Speculative.',
    hurdles: ['self-evaluation', 'novel vulnerability discovery', 'self-modification'],
    status: 'projection',
    yearWindow: '2030+',
  },
];

const STATUS_TONE: Record<Stage['status'], { dot: string; label: string }> = {
  'observed':   { dot: 'var(--accent)',      label: 'observed' },
  'partial':    { dot: 'var(--accent-warm)', label: 'partial / emerging' },
  'projection': { dot: 'var(--fg-subtle)',   label: 'projection' },
};

export function CapabilityLadder() {
  return (
    <div className="themed-surface mt-6 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        four-stage capability ladder
      </p>
      <p className="mt-1 text-xs text-[color:var(--fg-muted)]">
        observed evidence at the bottom, projection at the top. dot colour marks status.
      </p>

      <ol className="mt-6 flex flex-col-reverse gap-3">
        {STAGES.map((s) => {
          const tone = STATUS_TONE[s.status];
          const muted = s.status === 'projection';
          return (
            <li
              key={s.id}
              className="relative grid grid-cols-[auto,1fr] gap-4 rounded-md border p-4"
              style={{
                borderColor: 'var(--border)',
                opacity: muted ? 0.78 : 1,
                background: muted
                  ? 'repeating-linear-gradient(135deg, transparent 0 8px, color-mix(in srgb, var(--bg-elevated) 40%, transparent) 8px 16px)'
                  : 'transparent',
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-bold"
                  style={{
                    background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                  }}
                >
                  {s.id}
                </span>
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ background: tone.dot, boxShadow: `0 0 12px ${tone.dot}` }}
                  title={tone.label}
                />
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-serif text-lg font-semibold text-[color:var(--fg)]">
                    {s.title}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
                    {s.yearWindow}
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: tone.dot }}
                  >
                    {tone.label}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--fg-muted)]">{s.blurb}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {s.hurdles.map((h) => (
                    <li
                      key={h}
                      className="rounded-full border px-2 py-0.5 font-mono text-[10px] text-[color:var(--fg-muted)]"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 text-xs text-[color:var(--fg-subtle)]">
        Year windows are anchored to Grace et al. 2024 expert survey (median of
        2,000+ AI researchers). Stage 4 has no median estimate; the window is
        speculative.
      </p>
    </div>
  );
}
