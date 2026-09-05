'use client';

// Walkthrough: /wc/learn/plain-mode

import dynamic from 'next/dynamic';
import type { Scheme } from './holdScheme';
import { SCHEME_INK } from './holdScheme';

/**
 * Four ways to render one model, loaded one at a time. Each vendored
 * component is a megabyte of WebGL and its own copy of the loader stack, so
 * they are dynamic imports: the holding screen ships none of them until a
 * style is picked, and switching fetches exactly that chunk. ssr:false because
 * every one of them reaches for a canvas on mount. The options object has to
 * be an inline literal: next/dynamic reads it at compile time, so hoisting it
 * to a shared const fails the build.
 */
const AsciiObject = dynamic(() => import('../canvasui/AsciiObject').then((m) => m.AsciiObject), { ssr: false });
const InkObject = dynamic(() => import('../canvasui/InkObject').then((m) => m.InkObject), { ssr: false });
const ParticleObject = dynamic(() => import('../canvasui/ParticleObject').then((m) => m.ParticleObject), { ssr: false });
const LiquidObject = dynamic(() => import('../canvasui/LiquidObject').then((m) => m.LiquidObject), { ssr: false });

/**
 * Four, not the seven the registry offers. The dither and glass variants were
 * tried and cut: both quantize or refract whatever is behind the model, and
 * here that is transparency, so the spectre simply vanished. Giving them an
 * opaque backdrop would have worked and would also have painted a rectangle
 * over the middle of the field, which is the one thing this screen cannot
 * afford.
 */
export const HOLD_STYLES = ['ascii', 'ink', 'particle', 'liquid'] as const;

export type HoldStyle = (typeof HOLD_STYLES)[number];

const MODEL = '/spectre.glb';
const FILL = 'absolute inset-0 h-full w-full';

/** Shared framing, so switching style does not also move the model. */
const FRAME = {
  src: MODEL,
  scale: 2.6,
  floatIntensity: 1.4,
  rotationIntensity: 0.8,
  floatSpeed: 1.6,
  orbit: false,
  zoom: false,
  autoRotate: true,
  autoRotateSpeed: 0.6,
  environmentIntensity: 1.2,
} as const;

/**
 * The model never leaves. Background stays unset on every one of these, which
 * the components read as transparent, so the fluid field keeps showing through
 * and the words go on inking behind it.
 *
 * Every colour below drags the component back to monochrome: the library ships
 * blue, neon and iridescence by default, which is the one thing plain mode
 * cannot have.
 */
export function HoldStage({ style, scheme }: { style: HoldStyle; scheme: Scheme }) {
  const { ink, highlight } = SCHEME_INK[scheme];

  switch (style) {
    case 'ink':
      return (
        <InkObject
          {...FRAME}
          className={FILL}
          inkColor={ink}
          lineSpacing={5}
          strokeWeight={0.8}
          bleed={0.25}
          grain={0.3}
          contrast={1.2}
          invert={scheme === 'dark'}
          highlight={highlight}
        />
      );

    case 'particle':
      return (
        <ParticleObject
          {...FRAME}
          className={FILL}
          color={ink}
          count={26000}
          size={1.4}
          swirl={0.5}
          drift={0.3}
        />
      );

    case 'liquid':
      return (
        <LiquidObject
          {...FRAME}
          className={FILL}
          tint={ink}
          saturation={0}
          iridescence={0}
          aberration={0}
          sheen={0.4}
          grain={0.2}
          highlight={highlight}
        />
      );

    case 'ascii':
    default:
      return (
        <AsciiObject
          {...FRAME}
          className={FILL}
          cellSize={11}
          colored={false}
          color={ink}
          contrast={1.35}
          edgeContrast={3.2}
          highlight={highlight}
        />
      );
  }
}
