'use client';

import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

type Sketch = {
  href: string;
  label: string;
  title: string;
  blurb: string;
  status: 'sketch' | 'graduated';
  external?: boolean;
};

const SKETCHES: ReadonlyArray<Sketch> = [
  {
    href: '/og/doubt',
    label: 'DOUBT',
    title: 'Manufactured Doubt',
    blurb: 'How doubt gets manufactured to delay action (tobacco to climate), and the one honest reason for optimism it could not stop. Interactive solar + EV curves. Companion to the Calhoun ramble.',
    status: 'sketch',
  },
  {
    href: '/og/calhoun',
    label: 'CALHOUN',
    title: 'The Calhoun Effect',
    blurb: 'A ramble on Universe 25, what the mouse-utopia experiment is taken to mean vs. what it meant, and the doubt/slogan machinery in between. Links to a behavioral-sink mode in the lab.',
    status: 'sketch',
  },
  {
    href: '/og/interactive',
    label: 'INTERACTIVE',
    title: '"W I P" sideways type',
    blurb: 'CSS-only isometric 3D type. Placeholder for an actual interactive demo (R3F shader playground? scene picker?).',
    status: 'sketch',
  },
  {
    href: '/og/chat',
    label: 'CHAT',
    title: 'Local-only chat sandbox',
    blurb: 'A real chat UI with no backend. Useful as a placeholder until a WebSocket layer makes sense.',
    status: 'sketch',
  },
  {
    href: '/fmhy',
    label: 'FMHY',
    title: 'FMHY backup (graduated)',
    blurb: 'Used to live here as a placeholder shell. Now a real backup mirror at /fmhy with category links and a live embed when it loads.',
    status: 'graduated',
  },
];

export default function OgIndex() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /OG ]
        </p>
        <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-5xl">
          Back-room sketches
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          Pages that started as ideas and aren&rsquo;t finished. They live here
          on purpose, so they don&rsquo;t clutter the main map but don&rsquo;t
          get lost either. A sketch graduates by getting a real implementation
          and moving up out of <code className="font-mono text-[color:var(--accent-soft)]">/og</code>.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {SKETCHES.map((s) => {
            const graduated = s.status === 'graduated';
            return (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="themed-surface themed-surface-interactive group block p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
                      {s.label}
                    </p>
                    <span
                      className={
                        graduated
                          ? 'rounded-full border border-[color:var(--accent-soft)]/40 bg-[color:var(--accent-soft)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent-soft)]'
                          : 'rounded-full border border-[color:var(--border)] bg-[color:var(--bg-overlay)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]'
                      }
                    >
                      {s.status}
                    </span>
                  </div>
                  <h2 className="mt-2 font-serif text-lg font-semibold transition-colors
                                 group-hover:text-[color:var(--accent-soft)]">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{s.blurb}</p>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-xs text-[color:var(--fg-subtle)]">
          ← Back <Link href="/" className="text-[color:var(--accent)] underline underline-offset-4">home</Link>
        </p>
      </main>
    </div>
  );
}
