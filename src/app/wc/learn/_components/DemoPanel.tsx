'use client';

// Walkthrough: /wc/learn/build-a-playground

import { type ReactNode } from 'react';

interface DemoPanelProps {
  code: ReactNode;
  demo: ReactNode;
  label?: string;
}

/**
 * Side-by-side shell: source on the left, a live demo on the right at md+,
 * stacked on mobile. It breaks out of the article's max-w-2xl reading column
 * into a wider centered band so the two halves have room, without Walkthrough
 * or any existing page having to change. The demo half carries a mono "LIVE"
 * pill so a reader can tell at a glance which side actually runs.
 */
export function DemoPanel({ code, demo, label = 'LIVE' }: DemoPanelProps) {
  return (
    <div className="my-8 md:relative md:left-1/2 md:w-[min(56rem,92vw)] md:-translate-x-1/2">
      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <div className="min-w-0">{code}</div>
        <div className="relative min-w-0 rounded-lg border border-[color:var(--border)]
                        bg-[color:var(--bg-elevated)] p-4">
          <span className="absolute right-3 top-3 z-10 flex items-center gap-1.5
                           rounded-full border border-[color:var(--accent)]/40
                           bg-[color:var(--accent)]/10 px-2 py-0.5 font-mono
                           text-[10px] uppercase tracking-widest text-[color:var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]
                             motion-safe:animate-pulse" />
            {label}
          </span>
          {demo}
        </div>
      </div>
    </div>
  );
}
