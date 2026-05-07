'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Fallback for browsers without the View Transitions API (Firefox today).
 * On every pathname change, fades a black overlay in then out so the
 * route swap feels intentional instead of a hard cut.
 *
 * Skipped when:
 *  - the browser supports `document.startViewTransition` (real VT runs).
 *  - the user has `prefers-reduced-motion: reduce`.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (typeof document === 'undefined') return;

    const supportsVT =
      typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === 'function';
    if (supportsVT) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const el = overlayRef.current;
    if (!el) return;

    const tl = gsap.timeline();
    tl.set(el, { autoAlpha: 1 })
      .to(el, { autoAlpha: 0, duration: 0.32, ease: 'power2.out' });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] bg-[color:var(--bg)]"
      style={{ opacity: 0, visibility: 'hidden' }}
    />
  );
}
