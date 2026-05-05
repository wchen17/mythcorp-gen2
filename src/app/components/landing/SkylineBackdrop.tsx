'use client';

import { useEffect, useRef } from 'react';

/**
 * Themed skyline background. Two CSS overlays + the image, with a tiny
 * mouse-parallax for warmth. Reusable between NewLandingPage and MainMenu.
 */
export function SkylineBackdrop({ parallax = true }: { parallax?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parallax) return;
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currX = 0;
    let currY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 12;
      targetY = (e.clientY / window.innerHeight - 0.5) * 8;
    };
    const tick = () => {
      currX += (targetX - currX) * 0.06;
      currY += (targetY - currY) * 0.06;
      if (ref.current) {
        ref.current.style.transform =
          `scale(1.1) translate3d(${currX.toFixed(2)}px, ${currY.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [parallax]);

  return (
    <>
      <div
        ref={ref}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          filter: 'blur(var(--skyline-blur)) brightness(0.85)',
          transform: 'scale(1.1)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, var(--skyline-tint-a), var(--skyline-tint-b) 60%, var(--bg) 95%)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--bg) 0%, transparent 50%, transparent 100%)',
        }}
        aria-hidden
      />
    </>
  );
}
