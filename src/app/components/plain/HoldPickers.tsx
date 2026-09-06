'use client';

// Walkthrough: /wc/learn/plain-mode

import { DisturbedText, GENTLE } from './DisturbedText';
import { SCHEME_CHOICES, type SchemeChoice } from './holdScheme';
import { HOLD_STYLES, type HoldStyle } from './HoldStage';
import { OVERLAY_STYLES, type OverlayStyle } from './HoldOverlay';
import { MESSAGE_STYLES, type MessageStyle } from './messageStore';

/**
 * The four rows of controls. Split out of PlainHold, which was climbing past
 * the file cap, and they are all the same button wearing different labels.
 */
export function StylePicker({
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

export function MessagePicker({
  message,
  onPick,
}: {
  message: MessageStyle;
  onPick: (m: MessageStyle) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5
                    text-[color:var(--fg-subtle)]">
      <DisturbedText text="words" strength={GENTLE} className="tracking-[0.16em] opacity-70" />
      {MESSAGE_STYLES.map((name) => (
        <PickerButton
          key={name}
          label={name}
          active={name === message}
          onClick={() => onPick(name)}
        />
      ))}
    </div>
  );
}

export function OverlayPicker({
  overlay,
  onPick,
}: {
  overlay: OverlayStyle;
  onPick: (o: OverlayStyle) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5
                    text-[color:var(--fg-subtle)]">
      <DisturbedText text="over" strength={GENTLE} className="tracking-[0.16em] opacity-70" />
      {OVERLAY_STYLES.map((name) => (
        <PickerButton
          key={name}
          label={name}
          active={name === overlay}
          onClick={() => onPick(name)}
        />
      ))}
    </div>
  );
}

export function SchemePicker({
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
      {/* GENTLE, not FULL: the cursor is on this control precisely when its
          label matters, and DisturbedText keeps the real string in the DOM so
          `aria-pressed` still has something honest to name. */}
      <DisturbedText text={label} strength={GENTLE} />
    </button>
  );
}
