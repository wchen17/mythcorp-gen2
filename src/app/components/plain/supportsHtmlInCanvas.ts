'use client';

type PaintableCanvas = HTMLCanvasElement & { requestPaint?: unknown };
type ElementImageContext = CanvasRenderingContext2D & { drawElementImage?: unknown };

/**
 * The same probe every Canvas UI component runs, lifted out so the holding
 * screen can label which effects will actually do something for this visitor
 * instead of offering three that silently no-op.
 */
export function supportsHtmlInCanvas(): boolean {
  if (typeof document === 'undefined') return false;
  const probe = document.createElement('canvas') as PaintableCanvas;
  const ctx = probe.getContext('2d') as ElementImageContext | null;
  return Boolean(
    ctx
      && typeof ctx.drawElementImage === 'function'
      && typeof probe.requestPaint === 'function',
  );
}
