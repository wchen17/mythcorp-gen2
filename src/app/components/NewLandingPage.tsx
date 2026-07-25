'use client';

// Walkthrough: /wc/learn/landing-flow

import { useEffect, useRef, useState } from 'react';
import { SiteHeader } from './SiteHeader';
import { SkylineBackdrop } from './landing/SkylineBackdrop';
import { HeroTitle } from './landing/HeroTitle';
import { LandingModals } from './landing/LandingModals';

interface NewLandingPageProps {
  onEnterExperience: () => void;
  onReplayIntro?: () => void;
}

export function NewLandingPage({ onEnterExperience, onReplayIntro }: NewLandingPageProps) {
  const [showAlignmentLine, setShowAlignmentLine] = useState(false);
  const [showSecretHint, setShowSecretHint] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Pointer parallax on the WHOLE hero column. Moving only the title made the
  // headline drift against the fixed lines below it, which read as a centering
  // bug rather than as depth. Same lerp and magnitude as before, one subject.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const update = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      hero.style.setProperty('--hero-x', `${currentX.toFixed(2)}px`);
      hero.style.setProperty('--hero-y', `${currentY.toFixed(2)}px`);
      frame =
        Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.1
          ? requestAnimationFrame(update)
          : 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 8;
      targetY = (event.clientY / window.innerHeight - 0.5) * 6;
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
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

      {/* Hero.
          Three elements, not six, and one of them is loud. The previous version
          stacked four uppercase mono lines at a uniform gap, so nothing read as
          primary and two of them were keyboard instructions used as decoration.
          DESIGN.md already calls this: "ALL-CAPS is a spice, not a system."
          The hints moved to the corner rail below, where a hint belongs. */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div
          ref={heroRef}
          className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center
                     motion-safe:transition-transform motion-safe:duration-[var(--motion-base)]
                     motion-safe:ease-[var(--motion-ease)]"
          style={{ transform: 'translate3d(var(--hero-x, 0px), var(--hero-y, 0px), 0)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--fg-subtle)]">
            Signal acquired: Chicago / 2024
          </p>

          <HeroTitle />

          {/* The one action. Reads as a control, not a fourth line of text. */}
          <button
            type="button"
            onClick={onEnterExperience}
            className="themed-button mt-2 px-7 py-3 font-mono text-xs uppercase tracking-[0.3em]"
          >
            enter the 3D experience
          </button>
        </div>
      </main>

      {/* Corner rail. Secondary affordances live here rather than in the hero
          stack: discoverable if you look, silent if you do not.
          Both sit bottom-LEFT on purpose. Splitting them left and right put
          "replay boot" underneath the floating HelpDot, which is fixed to the
          bottom-right on every page. */}
      <div className="fixed bottom-5 left-5 z-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--fg-subtle)]">
        {/* The site-wide WIP marker lives down here rather than in the hero,
            which is the one composition that should not be carrying a status
            label. Same [ name / wip ] convention as every other room. */}
        <span className="text-[color:var(--accent-warm)]">[ mythcorp / wip ]</span>
        <span aria-hidden className="h-3 w-px bg-[color:var(--border)]" />
        <button
          type="button"
          onClick={() => setShowSecretHint(true)}
          className="transition-colors hover:text-[color:var(--accent-soft)]"
        >
          ctrl + G
        </button>
        {onReplayIntro && (
          <>
            <span aria-hidden className="h-3 w-px bg-[color:var(--border)]" />
            <button
              type="button"
              onClick={onReplayIntro}
              className="transition-colors hover:text-[color:var(--accent-soft)]"
            >
              replay boot
            </button>
          </>
        )}
      </div>

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

      <LandingModals
        showSecretHint={showSecretHint}
        onCloseSecretHint={() => setShowSecretHint(false)}
      />
    </div>
  );
}




