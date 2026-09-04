'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { SiteHeader } from './components/SiteHeader';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The 3D scenes can throw on weak GPUs (shader compile, lost context, OOM).
    // Surface it in the console so it is at least observable in the field.
    console.error('Route error boundary caught:', error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 55%)',
          opacity: 0.16,
        }}
        aria-hidden
      />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col
                       items-center justify-center px-6 text-center">
        <div
          className="mb-6 font-serif text-7xl text-[color:var(--accent-warm)] sm:text-8xl"
          style={{ textShadow: '0 0 40px var(--accent-glow-strong)' }}
          aria-hidden
        >
          ◴
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent-warm)]">
          [ ERR_RUNTIME ]
        </p>
        <h1 className="mt-3 font-serif text-4xl font-extrabold tracking-tight sm:text-5xl">
          A signal came loose
        </h1>
        <p className="mt-6 max-w-sm text-base text-[color:var(--fg-muted)]">
          A piece of the scene needs a moment. Try the signal again, or head back to familiar ground.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-[color:var(--fg-subtle)]">
            ref: {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="themed-button px-5 py-2.5 text-sm uppercase tracking-wide"
          >
            ↻ Try again
          </button>
          <Link
            href="/"
            className="themed-pill px-5 py-2.5 font-mono text-xs uppercase tracking-widest
                       text-[color:var(--fg)] transition-colors hover:text-[color:var(--accent)]"
          >
            ← Back home
          </Link>
        </div>
      </main>
    </div>
  );
}
