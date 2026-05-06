'use client';

import Link from 'next/link';
import { SiteHeader } from './SiteHeader';

interface ComingSoonProps {
  title: string;
  /** Sub-line under the title. Soft, honest, no jargon. */
  blurb?: string;
  /** Optional secondary paragraph. */
  detail?: string;
  /** Where the "back" CTA goes. Defaults to home. */
  backHref?: string;
  backLabel?: string;
}

export function ComingSoon({
  title,
  blurb = "Not built yet, but it's on the list.",
  detail,
  backHref = '/',
  backLabel = '← BACK HOME',
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center
                       justify-center px-6 pt-24 pb-16 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ DRAFT ]
        </p>
        <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          {blurb}
        </p>
        {detail && (
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--fg-subtle)]">
            {detail}
          </p>
        )}

        <div className="mt-10 h-px w-32 bg-[color:var(--border)]" />

        <Link
          href={backHref}
          className="mt-10 inline-flex items-center gap-2 rounded
                     border border-[color:var(--border)] bg-[color:var(--bg-overlay)]
                     px-5 py-2.5 font-mono text-xs uppercase tracking-widest
                     text-[color:var(--fg)] transition-all
                     hover:border-[color:var(--border-strong)]
                     hover:text-[color:var(--accent)]"
        >
          {backLabel}
        </Link>
      </main>
    </div>
  );
}
