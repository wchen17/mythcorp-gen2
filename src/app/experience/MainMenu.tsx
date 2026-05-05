'use client';

import Link from 'next/link';
import { SkylineBackdrop } from '../components/landing/SkylineBackdrop';
import { SiteHeader } from '../components/SiteHeader';

interface MainMenuProps {
  onStart: () => void;
}

export function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center
                    overflow-hidden font-sans text-[color:var(--fg)]">
      <SkylineBackdrop parallax={false} />

      <SiteHeader tagline="SIMULATION LAB" />

      <main className="relative z-10 flex flex-col items-center px-4 pt-24 text-center">
        <div className="w-full max-w-md rounded-xl border border-[color:var(--border)]
                        bg-[color:var(--bg-overlay)] p-6 backdrop-blur-md sm:p-8
                        shadow-[0_0_60px_-20px_var(--accent-glow)]">

          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ ENTER ]
          </p>
          <h1 className="mt-3 font-serif text-4xl font-extrabold leading-tight
                         tracking-tight text-[color:var(--accent-soft)] sm:text-5xl"
              style={{ textShadow: '0 0 24px var(--accent-glow-strong)' }}>
            3D EXPERIENCE
          </h1>
          <div className="mx-auto mt-3 h-px w-1/2 bg-[color:var(--border-strong)]" />

          <p className="mt-4 font-mono text-xs tracking-widest text-[color:var(--fg-muted)]">
            a small interactive scene you can poke at
          </p>

          <button
            onClick={onStart}
            className="mt-8 w-full rounded-md bg-[color:var(--accent)] py-3
                       text-sm font-bold tracking-wide text-[color:var(--bg)]
                       transition-all hover:scale-[1.02]
                       hover:shadow-[0_0_28px_var(--accent-glow-strong)]"
          >
            ENTER SIMULATION
          </button>

          <p className="mt-3 text-xs text-[color:var(--fg-subtle)]">
            tweak the controls inside — there&rsquo;s a randomize button
          </p>

          {/* Real working secondary links, replacing the dead SECRET ROUTES list */}
          <details className="mt-6 border-t border-[color:var(--border)] pt-4 text-left">
            <summary className="cursor-pointer rounded px-2 py-1 font-mono text-xs
                                tracking-widest text-[color:var(--accent)]
                                transition-colors hover:bg-[color:var(--bg-elevated)]">
              ✦ ELSEWHERE
            </summary>
            <div className="mt-2 flex flex-col">
              <Link
                href="/animals"
                className="rounded px-3 py-2 font-mono text-sm
                           text-[color:var(--accent-warm)] transition-colors
                           hover:bg-[color:var(--bg-elevated)]"
              >
                /animals — palate cleanser
              </Link>
              <Link
                href="/will/learn"
                className="rounded px-3 py-2 font-mono text-sm
                           text-[color:var(--accent-soft)] transition-colors
                           hover:bg-[color:var(--bg-elevated)]"
              >
                /will/learn — how this scene works
              </Link>
            </div>
          </details>
        </div>
      </main>
    </div>
  );
}
