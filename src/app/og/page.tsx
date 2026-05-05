'use client';

import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

const SKETCHES = [
  {
    href: '/og/interactive',
    label: 'INTERACTIVE',
    title: '"W I P" sideways text',
    blurb:
      'CSS-only isometric 3D type. Probably becomes the home for an actual interactive demo (R3F shader playground? scene picker?) later.',
  },
  {
    href: '/og/chat',
    label: 'CHAT',
    title: 'Local-only chat sandbox',
    blurb:
      'A real UI with no real backend. Useful as a placeholder for the day a WebSocket layer makes sense.',
  },
  {
    href: '/og/fmhy',
    label: 'FMHY',
    title: 'Backup archive sketch',
    blurb:
      'Searchable / filterable list with placeholder data. The intent is an FMHY-style backup hub, replace the dummy items when the real source is wired up.',
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
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Back-room sketches
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          Pages that started as ideas but aren&rsquo;t finished. They&rsquo;re here on
          purpose, kept around to come back to, not deleted. Each is harmless as-is
          and could grow into something real.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {SKETCHES.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group block rounded-xl border border-[color:var(--border)]
                           bg-[color:var(--bg-elevated)] p-5 transition-all
                           hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]
                           hover:shadow-[0_8px_30px_-15px_var(--accent-glow)]"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
                  {s.label}
                </p>
                <h2 className="mt-2 font-serif text-lg font-semibold transition-colors
                               group-hover:text-[color:var(--accent-soft)]">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{s.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs text-[color:var(--fg-subtle)]">
          ← Back <Link href="/" className="text-[color:var(--accent)] underline underline-offset-4">home</Link>
        </p>
      </main>
    </div>
  );
}
