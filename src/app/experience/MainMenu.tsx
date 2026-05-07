'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SkylineBackdrop } from '../components/landing/SkylineBackdrop';
import { SiteHeader } from '../components/SiteHeader';
import { SCENE_PRESETS, type ScenePreset } from './scenePresets';

interface MainMenuProps {
  onStart: (preset: ScenePreset) => void;
}

const TEASES = [
  { label: 'particles', count: '~12k', note: 'a star field with bloom' },
  { label: 'spectre', count: '1', note: 'a glowing rotating model' },
  { label: 'controls', count: '9', note: 'sliders + a randomize button' },
];

export function MainMenu({ onStart }: MainMenuProps) {
  const [presetId, setPresetId] = useState<ScenePreset['id']>('random');
  const selected = SCENE_PRESETS.find((p) => p.id === presetId) ?? SCENE_PRESETS[0];

  return (
    <div className="relative flex min-h-screen w-full flex-col
                    overflow-hidden font-sans text-[color:var(--fg)]">
      <SkylineBackdrop parallax />

      <SiteHeader tagline="SIMULATION LAB" />

      {/* Soft accent glow centred behind the hero, theme-aware. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center 60%, var(--accent-glow) 0%, transparent 45%)',
          opacity: 0.22,
        }}
      />

      <main className="relative z-10 flex flex-1 flex-col items-center
                       justify-center px-4 pt-24 pb-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">

          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[color:var(--accent)]">
            [ ENTER ]
          </p>

          <h1 className="themed-heading mt-3 text-5xl font-extrabold leading-[0.95]
                         text-[color:var(--fg)] sm:text-7xl">
            <span className="text-[color:var(--accent-soft)]">3D</span>{' '}
            EXPERIENCE
          </h1>

          <div
            aria-hidden
            className="mt-5 h-px w-40 bg-[color:var(--border-strong)]"
            style={{ boxShadow: '0 0 14px var(--accent-glow)' }}
          />

          <p className="mt-5 max-w-md text-base text-[color:var(--fg-muted)] sm:text-lg">
            A small interactive scene you can poke at. Bring headphones if
            you&rsquo;ve got them. Bring a fast machine if you don&rsquo;t.
          </p>

          {/* Tease bar: tells the user what's inside without spoiling it. */}
          <ul className="mt-10 grid w-full grid-cols-3 gap-3">
            {TEASES.map((t) => (
              <li
                key={t.label}
                className="themed-surface p-3 text-left"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--fg-subtle)]">
                  {t.label}
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-[color:var(--accent-soft)]"
                   style={{ textShadow: '0 0 12px var(--accent-glow)' }}>
                  {t.count}
                </p>
                <p className="mt-0.5 text-[11px] text-[color:var(--fg-muted)]">
                  {t.note}
                </p>
              </li>
            ))}
          </ul>

          {/* Scene preset picker. Each preset is a Partial<SceneSettings> patch. */}
          <fieldset className="mt-10 w-full max-w-sm">
            <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--fg-subtle)]">
              preset
            </legend>
            <div className="flex flex-wrap justify-center gap-2">
              {SCENE_PRESETS.map((p) => {
                const active = p.id === presetId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPresetId(p.id)}
                    aria-pressed={active}
                    className={[
                      'themed-pill px-3 py-1.5 font-mono text-[11px] tracking-widest transition-colors',
                      active
                        ? 'border-[color:var(--accent)] text-[color:var(--accent)]'
                        : 'text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]',
                    ].join(' ')}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Primary CTA: bigger, framed, with hover that mimics opening a door. */}
          <button
            onClick={() => onStart(selected)}
            className="themed-button group relative mt-6 w-full max-w-sm overflow-hidden
                       py-4 text-base tracking-[0.2em]"
          >
            <span className="relative z-10">ENTER SIMULATION</span>
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-0 bg-[color:var(--accent-soft)]
                         transition-all duration-500 group-hover:w-full"
              style={{ borderRadius: 'inherit' }}
            />
          </button>

          <p className="mt-3 text-xs text-[color:var(--fg-subtle)]">
            {selected.id === 'random'
              ? 'randomized on entry. tweak it inside, or hit reset for the defaults.'
              : `preset: ${selected.label}, ${selected.blurb}. tweak it inside.`}
          </p>

          <div className="mt-12 flex w-full items-center gap-4
                          text-[color:var(--fg-subtle)]">
            <span className="block h-px flex-1 bg-[color:var(--border)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em]">
              ELSEWHERE
            </span>
            <span className="block h-px flex-1 bg-[color:var(--border)]" />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/wc/learn"
              className="themed-pill px-4 py-1.5
                         font-mono text-xs text-[color:var(--accent-soft)]
                         hover:text-[color:var(--accent)]"
            >
              how the scene works
            </Link>
            <Link
              href="/animals"
              className="themed-pill px-4 py-1.5 font-mono text-xs
                         text-[color:var(--accent-warm)]
                         hover:text-[color:var(--accent)]"
            >
              palate cleanser
            </Link>
            <Link
              href="/fmhy"
              className="themed-pill px-4 py-1.5 font-mono text-xs
                         text-[color:var(--fg-muted)]
                         hover:text-[color:var(--accent)]"
            >
              fmhy backup
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
