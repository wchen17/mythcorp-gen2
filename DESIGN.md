# DESIGN.md

What this site feels like, and what it never does. CLAUDE.md tells you *how* to build; this file tells you *what taste to build with*. When a visual decision isn't covered here, ask "would a fictional megacorp's internal terminal do this?" before "would a SaaS landing page do this?"

## What MYTHCORP is

A personal site wearing the costume of a cinematic megacorp. The fiction is the design system: you *boot into* the site, you *enter* the simulation lab, unfinished ideas live in a *back room* (`/og`), and a fake terminal opens on `/`. Every page should feel like a room inside that world, not a page on a portfolio template.

The tone is **whimsical and warm, played straight**. The corporation aesthetic is deadpan; the copy underneath it is human. Never snarky, never "quirky startup".

## The one big rule

**Themes are design languages, not palettes.** Cyberpunk, luxury, and paper each pick their own radius, shadow, blur, easing, and hover physics (see the Tier 2 blocks in `globals.css`). Any new visual component must express itself through those tokens so it *transforms* across themes:

- **cyberpunk**: sharp corners (2-6px), neon edge glow, fast easing, terminal energy.
- **luxury**: big radii (up to 28px), glass blur, slow springy easing, gold on deep violet.
- **paper**: near-square corners, hard offset "stamped" shadows, presses and lifts, grain.

If a component looks identical in all three themes, it's wrong. Test in all three before calling it done.

## Type

Three fonts, closed set: **Cinzel** (display), **Geist** (body), **Geist Mono** (mono). Plus `Inter_Bold.json` for 3D text only.

- Cinzel is the brand. Use it for page titles and moments of ceremony, via `.themed-heading`. Don't dilute it onto every subhead.
- Make the scale jump big: display sizes should feel cinematic next to body text, not one notch up.
- Mono is for terminal, code, readouts, and data (phase readouts, star counts). Never decorative mono paragraphs.
- ALL-CAPS is a spice, not a system. One caps label per section at most.

## Color

Three hues per theme, already chosen: a dominant background family, a foreground family, and one accent (`--accent`, with `-soft` / `-warm` / `-glow` as its tints). **Never add a fourth hue to a page.** Extend with opacity and the existing tint tokens.

Hard bans:

- No purple-to-blue gradients. No lavender. No "AI slop" default palette anywhere.
- No hard-coded colors in components, ever. Tokens only (CLAUDE.md rule, repeated here because it's the whole ballgame).
- No pure `#000` / `#fff` surfaces; the themes already define depth.

## Surfaces and layout

- **Whitespace first, background shift second, elevation third, border last.** Reach for `.themed-surface` when you genuinely need a container, not to decorate.
- No nested cards. If a card contains a card, flatten one.
- No colored left-border accent strips on cards. It is the most reliable generic-AI tell.
- Break the grid once per page, on purpose: an off-center hero, an oversized number, a readout pinned to a corner, a 3D object bleeding past its column. One deliberate oddity beats ten polish passes.
- Never the slop skeleton (centered hero with badge, three feature cards, logo wall, FAQ). This site has no pricing page and no testimonials; it should never look like it might.

## Motion

- Motion is physics, per theme: cyberpunk snaps (120-200ms), luxury glides and overshoots (220-380ms), paper presses and lifts. Use `--motion-ease` / `--motion-fast` / `--motion-base`, never ad-hoc durations.
- Plan a timeline in words before writing GSAP ("header fades, then title tracks in, then banner slides"). "Add a cool animation" is banned as a brief.
- Every animation honors `prefers-reduced-motion` (`motion-safe:` in Tailwind).
- The boot sequence is the ceiling for spectacle. Interior pages stay calmer so the big moments stay big.

## The fiction, applied

- Diegetic beats decorative: prefer readouts, terminals, phase labels, and control panels over badges, blobs, and orbs. A stat should look *measured by the simulation*, not marketed.
- `/og` sketches are visibly rough on purpose (`<DraftBanner />`). Don't polish them into sameness; the draft-ness is the design.
- Microcopy is in-world and warm ("clip wandered off", "replay the boot sequence"). Short. Never snarky.
- Real content only: real figures with sourced numbers (see `/og/doubt`), real screenshots, no stock imagery, no placeholder lorem shipping to prod.

## Hard bans, collected

- Em-dashes. Anywhere. (Copy, code, comments, this file.)
- New fonts, new hues, hard-coded colors, inline global keyframes.
- Glassmorphism outside the luxury theme; glow outside cyberpunk/luxury.
- Gradient orbs, floating blobs, marquee logo strips, emoji-as-icons in headings.
- Components that look the same in all three themes.

## Checklist before shipping visual work

1. Looks intentional in cyberpunk, luxury, *and* paper (switcher on the page, all three checked).
2. Zero hex codes / rgb() in the component; tokens and themed utilities only.
3. Type scale has one clear cinematic jump; at most one caps label per section.
4. Contrast: body text readable in paper (light) as well as the dark themes.
5. One deliberate compositional oddity, and only one.
6. Motion uses theme tokens and respects reduced-motion.
