'use client';

/**
 * A one-value store so the holding screen can read what the field is actually
 * doing. The field publishes; the panel subscribes. Throttled at the source,
 * because a React render per animation frame would be absurd for four numbers.
 */
export type FieldMetrics = {
  cols: number;
  rows: number;
  /** Mean dye across the grid, 0 to 1. Rises when the field is stirred. */
  ink: number;
};

const EMPTY: FieldMetrics = { cols: 0, rows: 0, ink: 0 };

let current: FieldMetrics = EMPTY;
const listeners = new Set<() => void>();

export function publishMetrics(next: FieldMetrics) {
  current = next;
  listeners.forEach((l) => l());
}

export function resetMetrics() {
  current = EMPTY;
  listeners.forEach((l) => l());
}

export function subscribeMetrics(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getMetrics(): FieldMetrics {
  return current;
}

/** Server snapshot. Must be a stable reference or React loops forever. */
export function getServerMetrics(): FieldMetrics {
  return EMPTY;
}
