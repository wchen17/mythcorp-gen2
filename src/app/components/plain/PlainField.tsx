'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { createAsciiFluid } from './asciiFluid';

/**
 * The one ornament plain mode allows: a character field that the cursor
 * pushes around. Mounted globally, inert on every other theme, and it
 * never mounts at all under prefers-reduced-motion.
 */
export function PlainField() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = theme === 'plain';

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ink = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--plain-ink')
      .trim() || '#111111';

    const field = createAsciiFluid(canvas, { ink });

    const onMove = (e: PointerEvent) => field.pointer(e.clientX, e.clientY);
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      field.destroy();
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
    />
  );
}
