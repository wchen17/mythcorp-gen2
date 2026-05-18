'use client';

import { useEffect, useState } from 'react';

// Data lifted from Tables 1, 3, 5 of the source paper. Each metric is
// scored 0-10 where 10 = trivially accessible to a layperson, 0 = needs
// nation-state resources. Bar widths animate when toggled.

type Row = { label: string; pre: number; post: number; note: string };

const ROWS: ReadonlyArray<Row> = [
  { label: 'Spear-phishing campaign', pre: 1, post: 8, note: 'natural-language LLM writes the lure; voice clone tools add a phone call' },
  { label: 'Custom malware variant',  pre: 2, post: 7, note: 'code models generate working payloads with light prompting' },
  { label: 'Strategic info ops',      pre: 1, post: 8, note: 'multimodal models + ElevenLabs-class voice = persona at scale' },
  { label: 'Zero-day exploit',        pre: 1, post: 3, note: 'still requires real expertise; AI helps with surface area, not the vuln itself' },
  { label: 'Botnet / C2 infra',       pre: 2, post: 4, note: 'tooling is more accessible; operating it well is still a craft' },
  { label: 'Deepfake video heist',    pre: 1, post: 7, note: 'reference: Hong Kong CFO, $25M, single video call' },
];

export function BarrierToEntry() {
  const [mode, setMode] = useState<'pre' | 'post'>('pre');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="themed-surface mt-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
            layperson capability
          </p>
          <p className="mt-1 text-xs text-[color:var(--fg-muted)]">
            higher bar = the attack is more accessible to a non-expert
          </p>
        </div>
        <div className="themed-surface flex p-0.5 text-xs font-mono uppercase tracking-widest">
          <button
            type="button"
            onClick={() => setMode('pre')}
            aria-pressed={mode === 'pre'}
            className={[
              'rounded px-3 py-1.5 transition-colors',
              mode === 'pre'
                ? 'bg-[color:var(--accent)] text-[color:var(--bg)]'
                : 'text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]',
            ].join(' ')}
          >
            pre-AI
          </button>
          <button
            type="button"
            onClick={() => setMode('post')}
            aria-pressed={mode === 'post'}
            className={[
              'rounded px-3 py-1.5 transition-colors',
              mode === 'post'
                ? 'bg-[color:var(--accent)] text-[color:var(--bg)]'
                : 'text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]',
            ].join(' ')}
          >
            post-AI
          </button>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {ROWS.map((r) => {
          const value = mode === 'pre' ? r.pre : r.post;
          const widthPct = (value / 10) * 100;
          return (
            <li key={r.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-sm sm:text-base">{r.label}</span>
                <span className="font-mono text-xs text-[color:var(--fg-muted)]">{value}/10</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[color:var(--bg)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: mounted ? `${widthPct}%` : '0%',
                    background: mode === 'pre'
                      ? 'var(--fg-muted)'
                      : 'linear-gradient(90deg, var(--accent), var(--accent-warm))',
                    transition: 'width 700ms cubic-bezier(0.34, 1.2, 0.4, 1), background 400ms ease',
                  }}
                />
              </div>
              <p className="mt-1.5 text-xs text-[color:var(--fg-subtle)]">{r.note}</p>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-[color:var(--fg-subtle)]">
        Sources: Tables 1, 3, 5 of the source paper. Hong Kong reference:{' '}
        <a
          href="https://www.cnn.com/2024/02/04/asia/deepfake-cfo-scam-hong-kong-intl-hnk/index.html"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-[color:var(--accent)]"
        >
          CNN, Feb 2024
        </a>
        .
      </p>
    </div>
  );
}
