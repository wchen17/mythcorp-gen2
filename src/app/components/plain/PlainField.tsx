'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { createAsciiFluid } from './asciiFluid';
import { renderTextMask } from './textMask';
import { isHeld } from './holdState';
import { publishMetrics, resetMetrics } from './fieldMetrics';

/**
 * The grid is wide and short on a desktop viewport, so two stacked lines end
 * up height-constrained and small. One line fills it; stack only when the
 * viewport is narrow enough that a single line would be squeezed instead.
 */
function holdLines(cols: number, rows: number): string[] {
  return cols / rows > 2.2 ? ['WORK IN PROGRESS'] : ['WORK', 'IN', 'PROGRESS'];
}

/**
 * The one ornament plain mode allows. On a held route it also carries the
 * message: the words are dye in the field rather than DOM text, so they
 * smear when you push through them and re-ink themselves afterwards.
 */
export function PlainField() {
  const { theme } = useTheme();
  const pathname = usePathname() ?? '/';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = theme === 'plain';
  const held = isHeld(theme, pathname);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rootStyle = window.getComputedStyle(document.documentElement);
    const ink = rootStyle.getPropertyValue('--plain-ink').trim() || '#111111';
    const fontFamily = window.getComputedStyle(canvas).fontFamily || 'monospace';

    const field = createAsciiFluid(canvas, {
      ink,
      ambient: true,
      sourceGain: 0.016,
      onMetrics: publishMetrics,
      source: held
        ? (cols, rows) =>
            renderTextMask(holdLines(cols, rows), cols, rows, {
              fontFamily,
              centre: 0.46,
              fill: 0.86,
            })
        : undefined,
    });

    const onMove = (e: PointerEvent) => field.pointer(e.clientX, e.clientY);
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      field.destroy();
      resetMetrics();
    };
  }, [active, held]);

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
