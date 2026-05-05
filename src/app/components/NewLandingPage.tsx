'use client';

// Walkthrough: /wc/learn/landing-flow

import { useEffect, useState } from 'react';
import { SiteHeader } from './SiteHeader';
import { SkylineBackdrop } from './landing/SkylineBackdrop';
import { HeroTitle } from './landing/HeroTitle';
import { EnterBanner } from './landing/EnterBanner';
import { LandingModals } from './landing/LandingModals';

interface NewLandingPageProps {
  onEnterExperience: () => void;
  onEnterInteractive: () => void;
}

export function NewLandingPage({ onEnterExperience, onEnterInteractive }: NewLandingPageProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showMisalignedNote, setShowMisalignedNote] = useState(false);
  const [showAlignmentLine, setShowAlignmentLine] = useState(false);
  const [showSecretHint, setShowSecretHint] = useState(false);

  // Banner reveals after the entrance settles.
  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Toggle the playful "see the misalignment" overlay via keyboard for power users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowAlignmentLine((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans
                    text-[color:var(--fg)]">
      <SkylineBackdrop />

      <SiteHeader logoIsLink={false} />

      {/* Hero */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
          <HeroTitle onClick={() => setShowMisalignedNote(true)} />

          <div className="flex items-center gap-4 text-[color:var(--fg-muted)]">
            <span className="block h-px w-16 bg-[color:var(--border-strong)] sm:w-24" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] sm:text-xs">
              EST. 2024
            </span>
            <span className="block h-px w-16 bg-[color:var(--border-strong)] sm:w-24" />
          </div>

          {/* Inline keyboard hint, replacing the snarky dropdown egg. */}
          <button
            type="button"
            onClick={() => setShowSecretHint(true)}
            className="font-mono text-[10px] uppercase tracking-[0.3em]
                       text-[color:var(--fg-subtle)] transition-colors
                       hover:text-[color:var(--accent-soft)]"
          >
            press ⌘/ctrl + G to peek the alignment grid
          </button>
        </div>
      </main>

      {/* Self-aware alignment guide. Pure visual joke that doubles as a dev aid. */}
      {showAlignmentLine && (
        <div
          className="fixed inset-0 z-20 cursor-pointer"
          onClick={() => setShowAlignmentLine(false)}
          aria-hidden
        >
          <div
            className="absolute bottom-0 top-0 left-1/2 w-px"
            style={{
              transform: 'translateX(-50%)',
              background:
                'linear-gradient(to bottom, transparent, var(--accent) 30%, var(--accent-warm) 70%, transparent)',
              boxShadow: '0 0 14px var(--accent-glow-strong)',
            }}
          />
        </div>
      )}

      <EnterBanner
        show={showBanner}
        onEnterExperience={onEnterExperience}
        onEnterInteractive={onEnterInteractive}
      />

      <LandingModals
        showMisalignedNote={showMisalignedNote}
        onCloseMisalignedNote={() => setShowMisalignedNote(false)}
        showSecretHint={showSecretHint}
        onCloseSecretHint={() => setShowSecretHint(false)}
      />
    </div>
  );
}
