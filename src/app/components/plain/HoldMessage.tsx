'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useState } from 'react';
import { MESSAGE_LINES, type MessageStyle } from './messageStore';
import { useScramble } from './useScramble';

/**
 * The two DOM renderings of the message. The third, and the default, is not
 * here at all: it is dye in the fluid field, drawn by the canvas behind
 * everything. These are for when you want the words to simply be words.
 */
export function HoldMessage({ style }: { style: MessageStyle }) {
  const run = useDecodeCycle(style === 'decode');

  if (style === 'field') return null;

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
