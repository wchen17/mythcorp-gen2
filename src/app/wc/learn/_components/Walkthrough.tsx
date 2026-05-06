'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { SiteHeader } from '../../../components/SiteHeader';

interface WalkthroughProps {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}

/**
 * Shared layout for /wc/learn/* pages. Reading-room defaults: narrow
 * column, tall line-height, theme-aware accents.
 */
export function Walkthrough({ eyebrow, title, intro, children }: WalkthroughProps) {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <article className="mx-auto max-w-2xl px-6 pt-24 pb-24">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        <div className="mt-4 text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          {intro}
        </div>

        <div className="mt-10 flex flex-col gap-8 text-[color:var(--fg)]">
          {children}
        </div>

        <div className="mt-16 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)]">
          ← Back to <Link href="/wc/learn" className="text-[color:var(--accent)] underline underline-offset-4">/wc/learn</Link>
        </div>
      </article>
    </div>
  );
}

/** Section heading inside a walkthrough. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-serif text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-[color:var(--fg-muted)]">
        {children}
      </div>
    </section>
  );
}

/** Inline code block. Tiny, no syntax highlighting yet, just monospace + theme-aware. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-[color:var(--border)]
                    bg-[color:var(--bg-elevated)] p-4 font-mono text-[13px]
                    leading-relaxed text-[color:var(--fg)]">
      <code>{children}</code>
    </pre>
  );
}

/** Inline annotation pull-quote / sidenote. */
export function Aside({ children }: { children: ReactNode }) {
  return (
    <aside className="rounded-lg border-l-2 border-[color:var(--accent)]
                      bg-[color:var(--bg-elevated)] px-4 py-3
                      text-sm leading-relaxed text-[color:var(--fg-muted)]">
      {children}
    </aside>
  );
}
