'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { HOLD_ATTR, isHeld } from './holdState';
import { usePlainScheme } from './usePlainScheme';
import { useScramble } from './useScramble';
import { HoldStatus } from './HoldStatus';
import { HoldContact, HoldContactLinks } from './HoldContact';
import { HoldMessage } from './HoldMessage';
import { DisturbedText } from './DisturbedText';
import {
  MESSAGE_STYLES, getMessageStyle, getServerMessageStyle, setMessageStyle,
  subscribeMessageStyle,
} from './messageStore';
import { HoldStage, HOLD_STYLES, type HoldStyle } from './HoldStage';
import { HoldOverlay, OVERLAY_STYLES, type OverlayStyle } from './HoldOverlay';
import { StylePicker, MessagePicker, OverlayPicker, SchemePicker } from './HoldPickers';
import { rollHold } from './holdRoll';

const DEFAULT_STYLE: HoldStyle = 'ascii';
const DEFAULT_OVERLAY: OverlayStyle = 'none';

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
  const [overlay, setOverlay] = useState<OverlayStyle>(DEFAULT_OVERLAY);
  const { choice, scheme, setChoice } = usePlainScheme();
  const message = useSyncExternalStore(
    subscribeMessageStyle, getMessageStyle, getServerMessageStyle,
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

  // Every visit opens on a different combination, but a budgeted one: rolling
  // the three independently used to stack a full-screen overlay on top of two
  // particle systems, and the message lost. See holdRoll for the policy.
  //
  // It has to happen in an effect: rolling it during render would give the
  // server one answer and the client another, and the page would flicker
  // through the mismatch.
  useEffect(() => {
    if (!held) return;
    const roll = rollHold(HOLD_STYLES, MESSAGE_STYLES, OVERLAY_STYLES);
    setStyle(roll.style);
    setOverlay(roll.overlay);
    setMessageStyle(roll.message);
  }, [held]);

  const wordmark = useScramble('MYTHCORP', { active: held && mounted });

  if (!held) return null;

  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-between p-5 sm:p-8">
      <h1 className="sr-only">Mythcorp, work in progress</h1>

      <HoldOverlay overlay={overlay} scheme={scheme} />
      <HoldMessage style={message} scheme={scheme} />
      <HoldContact />

      <div className="relative flex items-start justify-between gap-4 font-mono text-xs">
        <DisturbedText
          text={wordmark}
          className="tracking-[0.45em] text-[color:var(--fg)]"
        />
        <SchemePicker choice={choice} onPick={setChoice} />
      </div>

      {/* The model owns the middle of the screen. The readout sits inside the
          same box so it stays put when the style changes underneath it. */}
      <div className="pointer-events-none relative -mx-5 flex-1 sm:-mx-8">
        <HoldStage style={style} scheme={scheme} />
        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <div className="pointer-events-auto">
            <HoldStatus
              style={style}
              scheme={scheme}
              message={message}
              overlay={overlay}
            />
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 font-mono text-xs sm:flex-row
                      sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <StylePicker style={style} onPick={setStyle} />
          <MessagePicker message={message} onPick={setMessageStyle} />
          <OverlayPicker overlay={overlay} onPick={setOverlay} />
        </div>
        <HoldContactLinks />
      </div>
    </div>
  );
}
