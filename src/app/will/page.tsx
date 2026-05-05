'use client';

import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

const sections = [
  {
    href: '/will/learn',
    label: 'LEARN',
    title: 'Annotated walkthroughs',
    blurb: 'Real components from this site, taken apart and explained.',
  },
  {
    href: '/will/papers',
    label: 'PAPERS',
    title: 'Long-form writing',
    blurb: 'Living papers and essays. The first one is on AI + cybercrime capability.',
  },
  {
    href: '/will/about',
    label: 'ABOUT',
    title: 'Who, why',
    blurb: 'Coming soon.',
  },
];

export default function WillIndex() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /WILL ]
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          A small back room
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          MYTHCORP is the front. This is where the personal stuff lives, papers,
          notes, walkthroughs of how the site itself works. If MYTHCORP is the
          theatre, /will is the workshop behind it.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block rounded-xl border border-[color:var(--border)]
                         bg-[color:var(--bg-elevated)] p-5 transition-all
                         hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]
                         hover:shadow-[0_8px_30px_-15px_var(--accent-glow)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
                {s.label}
              </p>
              <h2 className="mt-2 font-serif text-xl font-semibold transition-colors
                             group-hover:text-[color:var(--accent-soft)]">
                {s.title}
              </h2>
              <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{s.blurb}</p>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-xs text-[color:var(--fg-subtle)]">
          Tip: this section reads better in the <em>paper</em> theme, the switcher is in the top-right.
        </p>
      </main>
    </div>
  );
}
