'use client';

// Walkthrough: /wc/learn/plain-mode

import dynamic from 'next/dynamic';
import type { Scheme } from './holdScheme';

/**
 * The two Canvas UI effects that draw their own geometry rather than
 * resampling the page, which is why they are the only ones from that half of
 * the library that survive here: they need no Chrome flag and look the same
 * for everyone. They run as a full-screen layer over the field and under the
 * chrome, so they compose with whatever the spectre and the message are doing
 * instead of replacing either.
 */
const GlyphRain = dynamic(() => import('../canvasui/GlyphRain').then((m) => m.GlyphRain), { ssr: false });
const ForceField = dynamic(() => import('../canvasui/ForceField').then((m) => m.ForceField), { ssr: false });

export const OVERLAY_STYLES = ['none', 'rain', 'shield'] as const;

export type OverlayStyle = (typeof OVERLAY_STYLES)[number];

/**
 * Both of these bind pointer listeners inside their own subtree, so the
 * `pointer-events-none` layer below was disabling the half of each effect that
 * responds to you: the rain's `stir`, and, more embarrassingly, the shield's
 * `gridReveal="hover"`, which means the lattice only lights where the cursor
 * crosses it. That one was not a missing flourish, it was the entire mechanic.
 *
 * Re-enabling hit testing here is safe because the layer sits at `-z-10`.
 * Anything painted above it, which is every picker and every link, is hit
 * first, and the overlay only picks up pointers over otherwise empty screen.
 */
const FILL = 'h-full w-full pointer-events-auto';

export function HoldOverlay({
  overlay,
  scheme,
}: {
  overlay: OverlayStyle;
  scheme: Scheme;
}) {
  if (overlay === 'none') return null;

  // Monochrome, and dark mode has to lift the ink off black rather than sink
  // it into the page.
  const ink: [number, number, number] = scheme === 'dark'
    ? [0.82, 0.82, 0.82]
    : [0.1, 0.1, 0.1];
  const edge: [number, number, number] = scheme === 'dark'
    ? [0.55, 0.55, 0.55]
    : [0.25, 0.25, 0.25];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {overlay === 'rain' ? (
        <GlyphRain
          className={FILL}
          charset="01<>[]{}/\\=+*#%@ANDBUILDINGPROGRESS"
          cell={14}
          color={ink}
          headColor={scheme === 'dark' ? [1, 1, 1] : [0, 0, 0]}
          speed={0.2}
          density={0.14}
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
          <></>
        </GlyphRain>
      ) : (
        <ForceField
          className={FILL}
          shape="hexagon"
          color={ink}
          edgeColor={edge}
          opacity={0.7}
          cellScale={18}
          gridOpacity={0.16}
          gridReveal="hover"
          edgeGlow={0.15}
        >
          <></>
        </ForceField>
      )}
    </div>
  );
}
