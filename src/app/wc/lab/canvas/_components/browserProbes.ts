'use client';

import { useEffect, useState } from 'react';
import { supportsHtmlInCanvas } from '../../../../components/plain/supportsHtmlInCanvas';

/**
 * The flag probe is the plain theme's, not a second copy of it. That file was
 * written for the holding screen, went unused when the screen stopped needing
 * the flag, and is exactly the same twelve lines the lab needs, so the lab
 * imports it rather than carrying a duplicate that can drift.
 */
export { supportsHtmlInCanvas };

/**
 * Null until the probe has run. The roster reads three states, not two: we do
 * not know yet, supported, absent. Guessing during the first paint would flash
 * a wrong label at everyone.
 */
export function useHtmlInCanvas(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => setOk(supportsHtmlInCanvas()), []);
  return ok;
}

/** Live, because the setting can change while the page is open. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}
