'use client';

// Walkthrough: /wc/learn/plain-mode

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

/**
 * The Canvas UI effects, loaded one at a time. Each vendored component is tens
 * of kilobytes of WebGL, so they are dynamic imports: the holding screen ships
 * none of them until you pick one, and switching fetches exactly that chunk.
 * ssr:false because every one of them reaches for a canvas on mount. The
 * options object has to be an inline literal: next/dynamic reads it at compile
 * time, so hoisting it to a shared const fails the build.
 */
const GlyphRain = dynamic(() => import('../canvasui/GlyphRain').then((m) => m.GlyphRain), { ssr: false });
const Asciify = dynamic(() => import('../canvasui/Asciify').then((m) => m.Asciify), { ssr: false });
const DecryptReveal = dynamic(() => import('../canvasui/DecryptReveal').then((m) => m.DecryptReveal), { ssr: false });
const RetroDither = dynamic(() => import('../canvasui/RetroDither').then((m) => m.RetroDither), { ssr: false });
const ForceField = dynamic(() => import('../canvasui/ForceField').then((m) => m.ForceField), { ssr: false });
const Glitch = dynamic(() => import('../canvasui/Glitch').then((m) => m.Glitch), { ssr: false });

export const HOLD_EFFECTS = [
  'rain',
  'asciify',
  'decrypt',
  'dither',
  'shield',
  'glitch',
  'none',
] as const;

export type HoldEffect = (typeof HOLD_EFFECTS)[number];

/** Effects that resample the page, so they do nothing without html-in-canvas. */
export const NEEDS_HTML_IN_CANVAS: ReadonlySet<HoldEffect> = new Set([
  'asciify',
  'decrypt',
  'dither',
  'glitch',
]);

const FILL = 'h-full w-full';

/**
 * Every option below drags the component back to monochrome. The library ships
 * blue and neon by default, which is the one thing plain mode cannot have.
 */
export function HoldStage({ effect, children }: { effect: HoldEffect; children: ReactNode }) {
  switch (effect) {
    case 'rain':
      return (
        <GlyphRain
          className={FILL}
          charset="01<>[]{}/\\=+*#%@ANDBUILDINGPROGRESS"
          cell={14}
          color={[0.1, 0.1, 0.1]}
          headColor={[0, 0, 0]}
          speed={0.2}
          density={0.18}
          trail={0.8}
          glow={0.35}
          mutate={0.6}
          flicker={0.12}
          layers={2}
          dim={0.06}
          light={0.5}
          lightRadius={200}
          relief={0.02}
          stir={0.8}
        >
          {children}
        </GlyphRain>
      );

    case 'asciify':
      return (
        <Asciify
          className={FILL}
          charset="ascii"
          scale={3}
          spacing={1}
          radius={0.45}
          softness={0.9}
          background="auto"
          backgroundOpacity={1}
          contrast={1.15}
          glow={0}
          aberration={0}
          baseStrength={0.12}
        >
          {children}
        </Asciify>
      );

    case 'decrypt':
      return (
        <DecryptReveal
          className={FILL}
          cell={12}
          aspect={0.62}
          charset="01<>[]{}/\\=+*#%@$&"
          colored={0}
          color="#111111"
          background="#ffffff"
          brightness={1.1}
          legibility={0.35}
          scramble={0.45}
          scrambleSpeed={12}
          radius={190}
          edgeGlow={1.2}
          aberration={0}
          passthrough={0.15}
        >
          {children}
        </DecryptReveal>
      );

    case 'dither':
      return (
        <RetroDither
          className={FILL}
          pixelSize={3}
          levels={3}
          darkColor={[0, 0, 0]}
          lightColor={[1, 1, 1]}
          colorize={0}
          contrast={0.7}
          scanlines={0.12}
          radius={0.55}
          strength={0.85}
          baseStrength={0.1}
        >
          {children}
        </RetroDither>
      );

    case 'shield':
      return (
        <ForceField
          className={FILL}
          shape="hexagon"
          color={[0.07, 0.07, 0.07]}
          edgeColor={[0.25, 0.25, 0.25]}
          opacity={0.8}
          cellScale={18}
          gridOpacity={0.18}
          gridReveal="hover"
          edgeGlow={0.15}
        >
          {children}
        </ForceField>
      );

    case 'glitch':
      return (
        <Glitch
          className={FILL}
          intensity={0.85}
          interval={4}
          duration={0.35}
          slices={20}
          shift={24}
          rgbShift={0}
          blocks={0.4}
          noise={0.25}
        >
          {children}
        </Glitch>
      );

    case 'none':
    default:
      return <div className={FILL}>{children}</div>;
  }
}
