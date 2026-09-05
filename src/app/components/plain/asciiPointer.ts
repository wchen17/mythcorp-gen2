// Walkthrough: /wc/learn/plain-mode

/**
 * A move that arrives more than this long after the previous one is a
 * re-entry rather than a drag, so it carries no delta.
 */
const REENTRY_MS = 120;

/**
 * Two presses closer together than this count as one. Without it a fast
 * tapper stacks impulses faster than the field decays them.
 */
const PRESS_COOLDOWN_MS = 110;

export type PointerState = {
  /** Position in grid cells. */
  x: number;
  y: number;
  /** Movement since the previous sample, in grid cells. Force, once scaled. */
  dx: number;
  dy: number;
  active: boolean;
};

/**
 * Where the pointer is and what it just did, in grid cells.
 *
 * Nearly all of this exists because touch is not a slow mouse. A mouse emits a
 * continuous stream of positions, so subtracting the previous sample is always
 * a real delta. A finger appears somewhere, vanishes, and reappears somewhere
 * else entirely, and the naive subtraction read that teleport as one enormous
 * shove: tap the top left, then the bottom right, and the second touch dumped
 * a full-screen delta into the field at a place the finger had never been. On
 * a phone that was the entire interaction, because there is no hover, so every
 * gesture starts with exactly that discontinuity. A sample now only becomes a
 * delta when it belongs to the same pointer as the last one and arrived soon
 * enough after it.
 *
 * The claim is the other half. While a finger is down it owns the field and
 * moves from any second finger are dropped rather than mixed in. Two fingers
 * dragging in opposite directions used to average out to almost nothing, which
 * looked exactly like the field being broken.
 */
export function createPointerTracker() {
  const state: PointerState = { x: -1, y: -1, dx: 0, dy: 0, active: false };
  let claim: number | null = null;
  let seenAt = 0;
  let pressedAt = 0;

  return {
    state,

    move(x: number, y: number, id?: number) {
      if (claim !== null && id !== undefined && id !== claim) return;
      const now = performance.now();
      const continued = state.active && now - seenAt < REENTRY_MS;
      state.dx = continued ? x - state.x : 0;
      state.dy = continued ? y - state.y : 0;
      state.x = x;
      state.y = y;
      state.active = true;
      seenAt = now;
    },

    /**
     * Take ownership at a position with no delta, and report whether the
     * caller should actually fire an impulse for it.
     */
    press(x: number, y: number, id?: number): boolean {
      const now = performance.now();
      claim = id ?? 0;
      state.x = x;
      state.y = y;
      state.dx = 0;
      state.dy = 0;
      state.active = true;
      seenAt = now;
      if (now - pressedAt < PRESS_COOLDOWN_MS) return false;
      pressedAt = now;
      return true;
    },

    release(id?: number) {
      if (id !== undefined && claim !== null && id !== claim) return;
      claim = null;
      state.dx = 0;
      state.dy = 0;
    },
  };
}
