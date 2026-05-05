'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Floating "?" anywhere on the site. Click → tiny "what is this place"
 * panel that defuses the corporate-MYTHCORP feel and points the curious
 * to /will/learn. Theme-aware, keyboard-friendly.
 */
export function HelpDot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="What is this place?"
        aria-expanded={open}
        className="fixed bottom-4 right-4 z-[60] flex h-10 w-10 items-center
                   justify-center rounded-full border border-[color:var(--border-strong)]
                   bg-[color:var(--bg-overlay)] font-serif text-base
                   text-[color:var(--accent)] backdrop-blur-md transition-all
                   hover:scale-105 hover:shadow-[0_0_24px_var(--accent-glow-strong)]"
      >
        ?
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[59]"
            aria-hidden
          />
          <div
            role="dialog"
            aria-label="What is this place?"
            className="fixed bottom-16 right-4 z-[61] w-[min(20rem,calc(100vw-2rem))]
                       rounded-xl border border-[color:var(--border-strong)]
                       bg-[color:var(--bg-overlay)] p-4 shadow-2xl backdrop-blur-md
                       help-dot-panel"
          >
            <style>{`
              @keyframes helpDotIn {
                from { opacity: 0; transform: translateY(8px) scale(0.96); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
              }
              .help-dot-panel { animation: helpDotIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1); }
            `}</style>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
              [ what is this ]
            </p>
            <h3 className="mt-1.5 font-serif text-base font-semibold">A small site, made by Will.</h3>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--fg-muted)]">
              MYTHCORP is the front, a stage to try things. The personal stuff lives in{' '}
              <Link href="/will" className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">/will</Link>.
              The components are explained in{' '}
              <Link href="/will/learn" className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">/will/learn</Link>.
            </p>
            <p className="mt-3 text-xs text-[color:var(--fg-subtle)]">
              The theme switcher is in the top-right.
            </p>
          </div>
        </>
      )}
    </>
  );
}
