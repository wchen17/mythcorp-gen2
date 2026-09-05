'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { HOLD_ATTR, isHeld } from './holdState';
import { SCHEME_CHOICES, type SchemeChoice } from './holdScheme';
import { usePlainScheme } from './usePlainScheme';
import { useScramble } from './useScramble';
import { HoldStatus } from './HoldStatus';
import { HoldContact, HoldContactLinks } from './HoldContact';
import { HoldStage, HOLD_STYLES, type HoldStyle } from './HoldStage';

const DEFAULT_STYLE: HoldStyle = 'ascii';

/**
 * The holding screen. There is no way out of it on purpose: no link back into
 * the site, no theme escape. What is in the DOM is the wordmark, the readout,
 * the two pickers and the contact details. The message in the middle is not
 * here at all, it is dye in the field behind this.
 */
export function PlainHold() {
  const { theme, ready } = useTheme();
  const pathname = usePathname() ?? '/';
  const held = isHeld(theme, pathname);
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<HoldStyle>(DEFAULT_STYLE);
  const { choice, scheme, setChoice } = usePlainScheme();

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

      <HoldContact />

      <div className="relative flex items-start justify-between gap-4 font-mono text-xs">
        <span className="tracking-[0.45em] text-[color:var(--fg)]">{wordmark}</span>
        <SchemePicker choice={choice} onPick={setChoice} />
      </div>

      {/* The model owns the middle of the screen. The readout sits inside the
          same box so it stays put when the style changes underneath it. */}
      <div className="pointer-events-none relative -mx-5 flex-1 sm:-mx-8">
        <HoldStage style={style} scheme={scheme} />
        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <div className="pointer-events-auto">
            <HoldStatus style={style} scheme={scheme} />
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 font-mono text-xs sm:flex-row
                      sm:items-end sm:justify-between">
        <StylePicker style={style} onPick={setStyle} />
        <HoldContactLinks />
      </div>
    </div>
  );
}

function StylePicker({
  style,
  onPick,
}: {
  style: HoldStyle;
  onPick: (s: HoldStyle) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {HOLD_STYLES.map((name) => (
        <PickerButton
          key={name}
          label={name}
          active={name === style}
          onClick={() => onPick(name)}
        />
      ))}
    </div>
  );
}

function SchemePicker({
  choice,
  onPick,
}: {
  choice: SchemeChoice;
  onPick: (c: SchemeChoice) => void;
}) {
  return (
    <div className="flex items-center gap-x-3">
      {SCHEME_CHOICES.map((name) => (
        <PickerButton
          key={name}
          label={name}
          active={name === choice}
          onClick={() => onPick(name)}
        />
      ))}
    </div>
  );
}

function PickerButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'tracking-[0.16em] transition-colors',
        active
          ? 'text-[color:var(--fg)] underline underline-offset-4'
          : 'text-[color:var(--fg-subtle)] hover:text-[color:var(--fg)]',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
