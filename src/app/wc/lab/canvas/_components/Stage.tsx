'use client';

import { SampleSubject } from './SampleSubject';
import { calmExtras, type CanvasEntry, type PropValues } from './manifest';
import { hexToUnit, type ColorToken, type TokenInk } from './tokenInk';

const MODEL = '/spectre.glb';

/** Shared framing for the object renderers, so switching does not move it. */
const FRAME = {
  src: MODEL,
  orbit: true,
  zoom: false,
  autoRotate: true,
  autoRotateSpeed: 0.6,
  floatIntensity: 1.2,
  rotationIntensity: 0.6,
  floatSpeed: 1.4,
  environmentIntensity: 1.2,
} as const;

/**
 * Colour controls hold a token name, never a literal, so this is where the
 * theme actually reaches the shader. Re-running on every ink change is what
 * makes an effect follow a theme switch instead of freezing at mount.
 */
function resolveProps(entry: CanvasEntry, values: PropValues, ink: TokenInk): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const spec of entry.props) {
    const value = values[spec.name] ?? spec.def;
    if (spec.kind === 'color') {
      const hex = ink[value as ColorToken] || ink[spec.def];
      // Before the palette is read there is nothing honest to pass, so the
      // prop is left off and the component keeps its own default.
      if (hex) out[spec.name] = spec.format === 'rgb01' ? hexToUnit(hex) : hex;
    } else {
      out[spec.name] = value;
    }
  }
  return out;
}

interface StageProps {
  entry: CanvasEntry;
  values: PropValues;
  ink: TokenInk;
  calm: boolean;
  inert: boolean;
}

export function Stage({ entry, values, ink, calm, inert }: StageProps) {
  const { Component } = entry;
  const resolved = { ...(calm ? calmExtras(entry) : {}), ...resolveProps(entry, values, ink) };

  return (
    <div className="relative h-[24rem] overflow-hidden sm:h-[28rem]">
      {inert ? (
        <p className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-[color:var(--bg-overlay)]
                      px-4 py-2 text-center font-mono text-[10px] uppercase
                      tracking-[0.28em] text-[color:var(--accent-warm)]">
          running inert, the content below is the fallback
        </p>
      ) : null}

      {entry.subject === 'page' ? (
        // The wrapper is remounted per component, never reused, so no GL
        // context outlives the component that made it.
        <Component key={entry.id} {...resolved} className="h-full w-full">
          <SampleSubject />
        </Component>
      ) : (
        <Component
          key={entry.id}
          {...FRAME}
          {...resolved}
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
