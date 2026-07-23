'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--bg)]
                    text-[color:var(--fg)]">
      <style>{`
        @keyframes float404 {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes flicker404 {
          0%, 100% { opacity: 1; }
          47%      { opacity: 1; }
          48%      { opacity: 0.5; }
          50%      { opacity: 1; }
          52%      { opacity: 0.5; }
          54%      { opacity: 1; }
        }
        .floating-glyph { animation: float404 4s ease-in-out infinite; }
        .flicker-text   { animation: flicker404 4.5s ease-in-out infinite; }
      `}</style>

      {/* Soft ambient glow tied to the active theme. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 55%)',
          opacity: 0.18,
        }}
        aria-hidden
      />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col
                       items-center justify-center px-6 text-center">
        <div className="floating-glyph mb-6 font-serif text-7xl text-[color:var(--accent)] sm:text-8xl"
             style={{ textShadow: '0 0 40px var(--accent-glow-strong)' }}>
          ✦
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent-warm)]">
          [ ERR_NO_PAGE ]
        </p>
        <h1 className="mt-3 font-serif text-5xl font-extrabold tracking-tight sm:text-6xl">
          <span className="flicker-text">404</span>
        </h1>
        <p className="mt-6 max-w-sm text-base text-[color:var(--fg-muted)]">
          The spectre checked every corridor. This page is not on the map.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-[color:var(--accent)] px-5 py-2.5
                       font-bold text-sm tracking-wide text-[color:var(--bg)]
                       transition-all hover:scale-[1.03]
                       hover:shadow-[0_0_24px_var(--accent-glow-strong)]"
          >
            ← BACK HOME
          </Link>
          <Link
            href="/experience"
            className="rounded-md border border-[color:var(--border)]
                       bg-[color:var(--bg-overlay)] px-5 py-2.5
                       font-mono text-xs uppercase tracking-widest
                       text-[color:var(--fg)] transition-all
                       hover:border-[color:var(--border-strong)]
                       hover:text-[color:var(--accent)]"
          >
            INTO THE SIMULATION
          </Link>
        </div>
      </main>
    </div>
  );
}


