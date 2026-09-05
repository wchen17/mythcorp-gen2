'use client';

// Walkthrough: /wc/learn/plain-mode

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { MESSAGE_LINES, type MessageStyle } from './messageStore';
import { SCHEME_INK, type Scheme } from './holdScheme';
import { renderMessageImage } from './messageImage';
import { useScramble } from './useScramble';

const ParticleObject = dynamic(
  () => import('../canvasui/ParticleObject').then((m) => m.ParticleObject),
  { ssr: false },
);

/**
 * The two DOM renderings of the message. The third, and the default, is not
 * here at all: it is dye in the fluid field, drawn by the canvas behind
 * everything. These are for when you want the words to simply be words.
 */
export function HoldMessage({ style, scheme }: { style: MessageStyle; scheme: Scheme }) {
  const run = useDecodeCycle(style === 'decode');
  const printable = useMessageImage(style === 'dust');

  if (style === 'field') return null;

  // The words rebuilt as the same particle cloud the spectre uses, by handing
  // the component a PNG of the type instead of a model. The cursor scatters
  // them and they spring back, so the message is something you can put your
  // hand through. No autoRotate: a spinning word stops being a word.
  if (style === 'dust') {
    if (!printable) return null;
    return (
      <div className="pointer-events-none absolute inset-x-0 top-[6%] h-[34%]">
        <ParticleObject
          className="absolute inset-0 h-full w-full"
          src={printable}
          color={SCHEME_INK[scheme].ink}
          count={40000}
          size={1.5}
          radius={0.22}
          strength={1.6}
          swirl={0.7}
          spring={0.05}
          damping={0.86}
          drift={0.12}
          scale={5.2}
          floatIntensity={0.5}
          rotationIntensity={0.15}
          floatSpeed={1.1}
          orbit={false}
          zoom={false}
          autoRotate={false}
          cameraDistance={3.6}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[11%] flex flex-col
                 items-center gap-[0.04em] font-mono font-bold leading-[0.95]
                 text-[color:var(--fg)]"
    >
      {MESSAGE_LINES.map((line) => (
        <span key={line} className="text-[8.5vw] tracking-[0.02em]">
          {style === 'decode'
            ? <DecodingLine key={run} text={line} />
            : line}
        </span>
      ))}
    </div>
  );
}

/**
 * The type has to be rasterized on the client, after fonts are ready, or the
 * cloud is built from a fallback face. Null until then, which reads as one
 * empty frame rather than the wrong letterforms.
 */
function useMessageImage(active: boolean): string | null {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active) return;
    let live = true;
    const done = () => { if (live) setReady(true); };
    document.fonts?.ready.then(done) ?? done();
    return () => { live = false; };
  }, [active]);

  return useMemo(() => {
    if (!active || !ready) return null;
    const family = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace';
    return renderMessageImage(MESSAGE_LINES, family);
  }, [active, ready]);
}

/** A counter that remounts the lines, because useScramble runs once per mount. */
function useDecodeCycle(active: boolean): number {
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setRun((n) => n + 1), 5200);
    return () => clearInterval(id);
  }, [active]);
  return run;
}

function DecodingLine({ text }: { text: string }) {
  return <>{useScramble(text, { active: true, frames: 34 })}</>;
}
