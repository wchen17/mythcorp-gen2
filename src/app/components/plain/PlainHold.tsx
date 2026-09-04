'use client';

// Walkthrough: /wc/learn/plain-mode

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { HOLD_ATTR, isHeld } from './holdState';
import { useScramble } from './useScramble';
import { HoldStatus } from './HoldStatus';
import { HoldStage, HOLD_EFFECTS, NEEDS_HTML_IN_CANVAS, type HoldEffect } from './HoldStage';
import { supportsHtmlInCanvas } from './supportsHtmlInCanvas';

const DEFAULT_EFFECT: HoldEffect = 'rain';

/**
 * The holding screen. The wordmark in the middle is not here: it is dye in the
 * field behind this, drawn by the theme's own canvas. What lives in the DOM is
 * the readout, the two links, and the effect picker.
 */
export function PlainHold() {
  const { theme, ready, setTheme } = useTheme();
  const pathname = usePathname() ?? '/';
  const held = isHeld(theme, pathname);
  const [mounted, setMounted] = useState(false);
  const [effect, setEffect] = useState<HoldEffect>(DEFAULT_EFFECT);

  const native = useSyncExternalStore(
    subscribeNothing,
    supportsHtmlInCanvas,
    () => false,
  );

  // The pre-paint script sets this attribute so the page never flashes its
  // real content. React only takes ownership once the stored theme has been
  // read back: acting a frame earlier would clear it on the default theme
  // and reveal the very page the script just hid.
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (held) root.setAttribute(HOLD_ATTR, 'on');
    else root.removeAttribute(HOLD_ATTR);
    setMounted(true);
    return () => {
      root.removeAttribute(HOLD_ATTR);
    };
  }, [held, ready]);

  const wordmark = useScramble('MYTHCORP', { active: held && mounted });

  if (!held) return null;

  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-between p-5 sm:p-8">
      <h1 className="sr-only">Mythcorp, work in progress</h1>

      <div className="flex items-start justify-between gap-4 font-mono text-xs">
        <span className="tracking-[0.45em] text-[color:var(--fg)]">{wordmark}</span>
        <button
          type="button"
          onClick={() => setTheme('cyberpunk')}
          className="uppercase tracking-[0.2em] text-[color:var(--fg-subtle)]
                     underline underline-offset-4 transition-colors
                     hover:text-[color:var(--fg)]"
        >
          leave plain mode
        </button>
      </div>

      {/* The stage takes the middle of the screen so an effect that follows the
          cursor has somewhere to happen, while the links above and below stay
          outside it and never get encrypted or dithered. */}
      <div className="pointer-events-none relative -mx-5 flex-1 sm:-mx-8">
        <HoldStage effect={effect}>
          <div className="flex h-full w-full items-end justify-center pb-8">
            <div className="pointer-events-auto">
              <HoldStatus effect={effect} />
            </div>
          </div>
        </HoldStage>
      </div>

      <div className="flex flex-col gap-3 font-mono text-xs sm:flex-row sm:items-end sm:justify-between">
        <EffectPicker effect={effect} onPick={setEffect} native={native} />
        <HoldLink href="/contact" label="CONTACT" />
      </div>
    </div>
  );
}

function EffectPicker({
  effect,
  onPick,
  native,
}: {
  effect: HoldEffect;
  onPick: (e: HoldEffect) => void;
  native: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {HOLD_EFFECTS.map((name) => {
          const inert = !native && NEEDS_HTML_IN_CANVAS.has(name);
          const active = name === effect;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onPick(name)}
              title={inert ? 'Needs the html-in-canvas flag to do anything' : undefined}
              className={[
                'tracking-[0.16em] transition-colors',
                active
                  ? 'text-[color:var(--fg)] underline underline-offset-4'
                  : 'text-[color:var(--fg-subtle)] hover:text-[color:var(--fg)]',
              ].join(' ')}
            >
              {name}
              {inert && <span aria-hidden className="ml-0.5 align-super text-[9px]">*</span>}
            </button>
          );
        })}
      </div>
      {!native && (
        <p className="max-w-md text-[10px] leading-relaxed tracking-wide text-[color:var(--fg-subtle)]">
          * redraws the live page, so it needs
          chrome://flags/#canvas-draw-element. Without that the starred ones
          are inert and the page shows through unchanged.
        </p>
      )}
    </div>
  );
}

/** A link that re-decodes its own label on hover. */
function HoldLink({ href, label }: { href: string; label: string }) {
  const [hot, setHot] = useState(false);
  const text = useScramble(label, { active: hot, frames: 20 });
  return (
    <Link
      href={href}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      className="self-start border-b border-[color:var(--fg)] pb-0.5 tracking-[0.3em]
                 text-[color:var(--fg)] sm:self-auto"
    >
      {text}
    </Link>
  );
}

function subscribeNothing() {
  return () => {};
}
