'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  getMetrics,
  getServerMetrics,
  subscribeMetrics,
} from './fieldMetrics';

const BAR_CELLS = 28;

/** Module scope, so switching style (which remounts the panel) does not
 *  restart the clock. It is time on the page, not time since this mount. */
const OPENED_AT = Date.now();

/**
 * The readout. Every number here is measured rather than decorative: the grid
 * really is that size, the meter really is the field's mean dye, and the clock
 * really is how long you have been on the page.
 */
export function HoldStatus({ style, scheme, message }: { style: string; scheme: string; message: string }) {
  const metrics = useSyncExternalStore(subscribeMetrics, getMetrics, getServerMetrics);
  const elapsed = useElapsed();

  // The meter reads low even when the screen looks busy, so give it a curve
  // that spends its range where the values actually live.
  const level = Math.min(1, Math.sqrt(metrics.ink * 6));
  const filled = Math.round(level * BAR_CELLS);
  const bar = '#'.repeat(filled) + '.'.repeat(BAR_CELLS - filled);

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 font-mono text-[11px]
                   uppercase tracking-[0.18em] text-[color:var(--fg-muted)]">
      <Row label="status" value="building" />
      <Row label="elapsed" value={elapsed} />
      <Row label="field" value={metrics.cols ? `${metrics.cols} x ${metrics.rows} cells` : 'idle'} />
      <Row label="render" value={style} />
      <Row label="scheme" value={scheme} />
      <Row label="words" value={message} />
      <Row
        label="ink"
        value={
          <span className="text-[color:var(--fg)]">
            [{bar}] {String(Math.round(level * 100)).padStart(3, ' ')}%
          </span>
        }
      />
    </dl>
  );
}

/**
 * Every value in this panel is client state: the clock, the measured grid, the
 * visitor's own colour scheme. The server cannot know any of it, so the text it
 * renders is a placeholder by definition rather than a mismatch to fix.
 */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-[color:var(--fg-subtle)]">{label}</dt>
      <dd className="whitespace-pre" suppressHydrationWarning>{value}</dd>
    </>
  );
}

/** mm:ss on the page. Ticks on a timer, not a frame loop. */
function useElapsed() {
  const [seconds, setSeconds] = useState(() => Math.floor((Date.now() - OPENED_AT) / 1000));
  useEffect(() => {
    const id = setInterval(
      () => setSeconds(Math.floor((Date.now() - OPENED_AT) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
