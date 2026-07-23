'use client';

import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

type Sketch = {
  href: string;
  label: string;
  title: string;
  blurb: string;
  status: 'sketch' | 'graduated' | 'parked';
};

const SKETCHES: ReadonlyArray<Sketch> = [
  {
    href: '/og/animals',
    label: 'INTERMISSION',
    title: 'Animal Break Time',
    blurb: 'A live GIPHY intermission, pulled back to rebuild with licensed cute anime or animal art instead.',
    status: 'parked',
  },
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
    blurb: 'Started here as a placeholder shell. Now a real backup-sites directory at /fmhy: mirrors pulled from the fmhy/edit backups list, for the days fmhy.net is down.',
    status: 'graduated',
  },
];

const STATUS_CLASS: Record<Sketch['status'], string> = {
  sketch: 'border-[color:var(--border)] bg-[color:var(--bg-overlay)] text-[color:var(--fg-subtle)]',
  graduated: 'border-[color:var(--accent-soft)]/40 bg-[color:var(--accent-soft)]/10 text-[color:var(--accent-soft)]',
  parked: 'border-[color:var(--accent-warm)]/40 bg-[color:var(--accent-warm)]/10 text-[color:var(--accent-warm)]',
};

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
          Pages that started as ideas and aren&rsquo;t finished. They live here on purpose,
          so they don&rsquo;t clutter the main map but don&rsquo;t get lost either.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {SKETCHES.map((sketch) => (
            <li key={sketch.href}>
              <Link
                href={sketch.href}
                className="themed-surface themed-surface-interactive group block p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
                    {sketch.label}
                  </p>
                  <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STATUS_CLASS[sketch.status]}`}>
                    {sketch.status}
                  </span>
                </div>
                <h2 className="mt-2 font-serif text-lg font-semibold transition-colors group-hover:text-[color:var(--accent-soft)]">
                  {sketch.title}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{sketch.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs text-[color:var(--fg-subtle)]">
          Back <Link href="/" className="text-[color:var(--accent)] underline underline-offset-4">home</Link>
        </p>
      </main>
    </div>
  );
}
