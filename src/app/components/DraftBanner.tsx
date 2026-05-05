'use client';

import Link from 'next/link';

/**
 * Soft "this is a sketch, not a finished page" banner used on /og/* routes.
 * Honest about the state without being sad about it.
 */
export function DraftBanner({ note }: { note?: string }) {
  return (
    <div className="mb-6 rounded-lg border border-[color:var(--accent-warm)]/40
                    bg-[color:var(--accent-warm)]/8 px-4 py-3 text-sm
                    text-[color:var(--fg-muted)]">
      <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-warm)]">
        [ sketch ]
      </span>
      {note ?? 'This page is a back-room idea, not a finished feature.'}
      {' '}
      <Link href="/og" className="text-[color:var(--accent-warm)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">
        See the others
      </Link>
      .
    </div>
  );
}
