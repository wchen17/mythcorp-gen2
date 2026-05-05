'use client';

import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';

const PAPERS = [
  {
    slug: 'ai-cybercrime',
    title: 'AI and the Layman&rsquo;s Cybercrime Capability',
    status: 'in progress',
    blurb:
      'Living version of the original Pioneer Scholars paper. Will be expanded over time and posted as an arXiv preprint when it stabilises.',
  },
];

export default function PapersIndex() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /WILL/PAPERS ]
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Papers
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          Living documents. Expect them to grow, get rewritten, and occasionally
          spawn interactive demos.
        </p>

        <ul className="mt-10 flex flex-col gap-4">
          {PAPERS.map((p) => (
            <li
              key={p.slug}
              className="rounded-xl border border-[color:var(--border)]
                         bg-[color:var(--bg-elevated)] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h2
                  className="font-serif text-lg font-semibold"
                  dangerouslySetInnerHTML={{ __html: p.title }}
                />
                <span className="rounded-full border border-[color:var(--accent-warm)]/40
                                 bg-[color:var(--accent-warm)]/10 px-2.5 py-0.5
                                 font-mono text-[10px] uppercase tracking-widest
                                 text-[color:var(--accent-warm)]">
                  {p.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{p.blurb}</p>
              <p className="mt-4 text-xs text-[color:var(--fg-subtle)]">
                Draft page coming soon at <code className="font-mono">/will/papers/{p.slug}</code>.
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs text-[color:var(--fg-subtle)]">
          ← Back to <Link href="/will" className="text-[color:var(--accent)] underline underline-offset-4">/will</Link>
        </p>
      </main>
    </div>
  );
}
