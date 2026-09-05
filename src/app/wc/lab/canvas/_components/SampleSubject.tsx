'use client';

import { useState } from 'react';

/**
 * The block the page-resampling effects are pointed at. It is deliberately
 * ordinary: a heading, a paragraph, a real link, a real control. The library's
 * whole claim is that the DOM underneath stays live while a shader runs over
 * it, and the only way to believe that is to select the text, follow the link,
 * and press the button while the effect is running.
 */
export function SampleSubject() {
  const [pressed, setPressed] = useState(0);

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6 sm:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        specimen 01
      </p>

      <h3 className="themed-heading text-2xl font-semibold sm:text-3xl">
        Still a paragraph underneath
      </h3>

      <p className="max-w-md text-sm leading-relaxed text-[color:var(--fg-muted)]">
        Nothing here is a picture. Drag across this sentence and it selects.
        Tab to the button and it takes focus. Whatever is happening on top is a
        second canvas reading this element every frame, which is the trick the
        whole library is built around.
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <a
          href="/wc/learn/build-a-playground"
          className="text-[color:var(--accent)] underline underline-offset-4
                     hover:text-[color:var(--accent-soft)]"
        >
          A link that still goes somewhere
        </a>

        <button
          type="button"
          onClick={() => setPressed((n) => n + 1)}
          className="themed-pill px-4 py-1.5 text-[color:var(--fg-muted)]
                     hover:text-[color:var(--fg)]"
        >
          Pressed {pressed} {pressed === 1 ? 'time' : 'times'}
        </button>
      </div>
    </div>
  );
}
