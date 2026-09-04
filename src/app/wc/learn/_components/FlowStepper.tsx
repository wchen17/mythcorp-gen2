'use client';

// Walkthrough: /wc/learn/build-a-playground

import { useEffect, useState } from 'react';
import { Code } from './Walkthrough';

interface Stage {
  id: string;
  label: string;
  note: string;
  lines: number[];
}

// The lines array points at the SNIPPET below (1-based), so advancing the
// stepper tints the code that actually drives that transition.
const STAGES: Stage[] = [
  { id: 'loading', label: 'loading', note: 'Binary digits assemble the boot shape. One Canvas alive.', lines: [2] },
  { id: 'landing', label: 'landing', note: 'Boot window elapses, the 3D MYTHCORP title card fades in.', lines: [5, 6] },
  { id: 'entered', label: 'entered', note: 'Click the logo, GSAP fades out, the warm skyline reveal mounts.', lines: [11] },
];

const SNIPPET = `function AppLoader() {
  const [stage, setStage] = useState('loading');

  // boot window elapses, hand off to the title card
  useEffect(() => {
    const t = setTimeout(() => setStage('landing'), 3500);
    return () => clearTimeout(t);
  }, []);

  // click the 3D logo to enter the warm reveal
  const enter = () => setStage('entered');

  return <Stage name={stage} onEnter={enter} />;
}`;

export function FlowStepper() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setI((n) => (n + 1) % STAGES.length), 1600);
    return () => clearInterval(id);
  }, [playing]);

  const stage = STAGES[i];

  return (
    <div className="flex flex-col gap-4">
      {/* Schematic: three nodes, the active one lit. */}
      <div className="flex items-center justify-between gap-2">
        {STAGES.map((s, idx) => (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <button
              onClick={() => { setPlaying(false); setI(idx); }}
              className="flex-1 rounded-md border px-2 py-3 text-center font-mono text-xs
                         uppercase tracking-widest transition-colors"
              style={{
                borderColor: idx === i ? 'var(--accent)' : 'var(--border)',
                background: idx === i ? 'color-mix(in srgb, var(--accent) 14%, transparent)' : 'transparent',
                color: idx === i ? 'var(--accent)' : 'var(--fg-subtle)',
              }}
            >
              {s.label}
            </button>
            {idx < STAGES.length - 1 && (
              <span className="text-[color:var(--fg-subtle)]">&rarr;</span>
            )}
          </div>
        ))}
      </div>

      <p className="min-h-[2.5rem] text-sm text-[color:var(--fg-muted)]">{stage.note}</p>

      <Code filename="src/app/page.tsx" highlight={stage.lines}>{SNIPPET}</Code>

      <div className="flex items-center gap-2">
        <button
          onClick={() => { setPlaying(false); setI((n) => (n - 1 + STAGES.length) % STAGES.length); }}
          className="themed-pill px-3 py-1.5 text-sm text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]"
        >
          &larr; prev
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="themed-button px-4 py-1.5 text-sm"
        >
          {playing ? '❙❙ pause' : '▶ auto-play'}
        </button>
        <button
          onClick={() => { setPlaying(false); setI((n) => (n + 1) % STAGES.length); }}
          className="themed-pill px-3 py-1.5 text-sm text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]"
        >
          next &rarr;
        </button>
      </div>
    </div>
  );
}
