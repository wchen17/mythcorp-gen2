'use client';

import type { HoldStyle } from './HoldStage';
import type { OverlayStyle } from './HoldOverlay';
import type { MessageStyle } from './messageStore';

/**
 * Every visit rolls a different combination, and rolling the three dimensions
 * independently is what made some visits unreadable. Nothing stopped the dice
 * handing out `rain` over `dust` over `swarm`: a full-screen glyph layer on top
 * of two separate particle systems, all moving, with the message somewhere
 * underneath. Each of those is good on its own and the pile is noise.
 *
 * So the roll gets a budget. Each option carries a rough cost in visual noise,
 * the total is capped, and the dimensions are rolled in order of what the
 * screen is actually for: the message first, because it is the only thing this
 * page has to say, then the model, then the overlay, which is decoration and
 * gets whatever is left. That ordering is the whole policy. The message is
 * never quietened to afford an overlay, and an overlay simply does not appear
 * on a visit that already spent its budget.
 *
 * The cursor erosion is not in the budget. It is local to the pointer and only
 * happens while someone is actively moving it, so it cannot pile onto anything
 * without a hand deliberately putting it there.
 */
const MESSAGE_NOISE: Record<MessageStyle, number> = {
  solid: 0,
  field: 1,
  decode: 1,
  // Forty thousand points with their own float and spring. On its own it is
  // the best rendering here, which is exactly why it must not share a screen.
  dust: 3,
};

const STYLE_NOISE: Record<HoldStyle, number> = {
  ascii: 1,
  ink: 1,
  liquid: 2,
  particle: 2,
  swarm: 2,
};

const OVERLAY_NOISE: Record<OverlayStyle, number> = {
  none: 0,
  // The shield is a faint static lattice that only lights where the cursor
  // crosses it, so it costs far less than the rain, which is a screen of
  // falling glyphs casting light on everything.
  shield: 1,
  // Its own drifting geometry, so it survives a transparent backdrop, and it
  // is quiet enough to sit under a moving model.
  fog: 1,
  drops: 2,
  rain: 2,
  // A single beam with a bloom. Quiet enough to sit under anything.
  scan: 1,
};

/**
 * Four. Low enough that `dust` (3) can only ever appear with the cheapest
 * model and no overlay, and high enough that a plain message still affords
 * `rain` over a moving model, which is the combination worth keeping.
 *
 * The first pass priced the shield and the rain a point higher each, and the
 * arithmetic quietly deleted the rain: it survived on two combinations out of
 * sixty, about a three percent chance, which is not a rarer effect but an
 * effect nobody will ever see. Budgets fail that way rather than loudly, so
 * `npm run check:roll` is the thing that keeps this honest.
 */
const BUDGET = 4;

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * The options that still fit, or the cheapest one if none do. Falling back to
 * the cheapest rather than to a fixed default keeps this correct if someone
 * later adds an option or lowers the budget: there is always an answer, and it
 * is always the quietest available one.
 */
function affordable<T extends string>(
  options: readonly T[],
  noise: Record<T, number>,
  left: number,
): readonly T[] {
  const fits = options.filter((o) => noise[o] <= left);
  if (fits.length) return fits;
  const cheapest = [...options].sort((a, b) => noise[a] - noise[b])[0];
  return [cheapest];
}

export type HoldRoll = {
  style: HoldStyle;
  message: MessageStyle;
  overlay: OverlayStyle;
};

export function rollHold(
  styles: readonly HoldStyle[],
  messages: readonly MessageStyle[],
  overlays: readonly OverlayStyle[],
): HoldRoll {
  const message = pick(messages);
  let left = BUDGET - MESSAGE_NOISE[message];

  const style = pick(affordable(styles, STYLE_NOISE, left));
  left -= STYLE_NOISE[style];

  const overlay = pick(affordable(overlays, OVERLAY_NOISE, left));

  return { style, message, overlay };
}

/** Exported for scripts/check-hold-roll.ts, not for the screen. */
export const HOLD_NOISE = { MESSAGE_NOISE, STYLE_NOISE, OVERLAY_NOISE, BUDGET };
