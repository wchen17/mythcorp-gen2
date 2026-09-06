'use client';

/**
 * One pointer, many readers. Six or seven pieces of type on the holding screen
 * want to know where the cursor is, and giving each of them its own
 * `pointermove` listener and its own animation frame would be seven listeners
 * doing identical arithmetic sixty times a second.
 *
 * So the listener is here, once, and the position is published on a frame
 * rather than on the event: a fast mouse fires `pointermove` far more often
 * than the screen refreshes, and every one of those beyond the first per frame
 * is work nobody sees.
 */
export type PointerAt = { x: number; y: number; active: boolean };

const AWAY: PointerAt = { x: -9999, y: -9999, active: false };

let current: PointerAt = AWAY;
let pending: PointerAt | null = null;
let frame = 0;
const listeners = new Set<() => void>();

function flush() {
  frame = 0;
  if (!pending) return;
  current = pending;
  pending = null;
  listeners.forEach((l) => l());
}

function schedule(next: PointerAt) {
  pending = next;
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

function onMove(e: PointerEvent) {
  schedule({ x: e.clientX, y: e.clientY, active: true });
}

/**
 * A pointer that has left the window has to be published as gone, not merely
 * stale. Without this the type stays eroded around wherever the cursor was
 * when it crossed the edge, which reads as a rendering bug rather than as a
 * screen that responds to you.
 */
function onLeave() {
  schedule(AWAY);
}

function start() {
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);
}

function stop() {
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerdown', onMove);
  document.removeEventListener('pointerleave', onLeave);
  window.removeEventListener('blur', onLeave);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  pending = null;
  current = AWAY;
}

/** Listeners are counted, so the window listener exists only while something reads it. */
export function subscribePointer(listener: () => void) {
  if (listeners.size === 0) start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
}

export function getPointer(): PointerAt {
  return current;
}

/** Must be a stable reference or useSyncExternalStore loops forever. */
export function getServerPointer(): PointerAt {
  return AWAY;
}
