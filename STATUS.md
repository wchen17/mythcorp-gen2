# STATUS

A short note for whoever (you, me, future-Claude on a different machine) picks this up next. Update at the end of each session.

## Last updated
2026-05-04, second deep pass on branch `claude/vigilant-golick-c8ff8d`. Theme Tier 2, /wc/papers/ai-cybercrime with two interactive figures, Konami easter egg, camera FOV bridge. Pushed.

## Hard rules (saved to memory at ~/.claude/projects/<this-project>/memory/)

- **No em-dashes (—) anywhere.** Code, copy, comments, commits, markdown. Use commas, periods, semicolons, parentheses, or restructure. The first refresh shipped with em-dashes everywhere and had to be purged. Don't redo that.

## What just shipped
A large refresh that addresses the brief: humanise/whimsical, showcase tech, codebase as a learning artefact, structure for cheap future iteration. Specifically:

- **Theme system** (cyberpunk / luxury / paper) with no-flash bootstrap, `localStorage` persistence, and a header switcher.
- **Cinematic landing flow** unified, LoadingScreen → LandingPage → NewLandingPage handoff, with the routing bug (logo click navigated *and* transitioned) fixed and `spectre.glb` preloaded once for the session.
- **NewLandingPage refactored** from a 333-line monolith into 5 small files under `src/app/components/landing/`. Every audit issue addressed: header `flex` instead of broken `grid`, banner gets serif + glow, hero responsive on mobile, modal styling unified, hard-coded colours migrated to theme tokens, dead disabled links removed, snarky multi-click counter replaced with a single warm popup that points to `/wc/learn`.
- **Shared `<SiteHeader>` and `<ComingSoon>`**, replaces the header that was previously hand-rolled across 5 pages.
- **Subpages migrated**: `/about` (rewritten warmer), `/contact` (now `<ComingSoon>`, the fake `(676) 767-7676` number is gone), `/animals` (kept its personality, ported to theme tokens).
- **`/experience`** cleaned: SETTINGS (WIP) button removed, dead `/bin/animals` and `/dev/chat` "secret routes" replaced with real working links, stars count clamped at 12000 to keep mid-tier GPUs at 60fps.
- **Personal section `/wc`** scaffolded: `/wc`, `/wc/papers`, `/wc/learn`, plus the first real walkthrough `/wc/learn/theme-system`.
- **Whimsical 404** at `src/app/not-found.tsx` and a floating `?` `HelpDot` mounted globally.
- **Cross-session docs**: `MAP.md` (file index), `CLAUDE.md` (conventions), `STATUS.md` (this file).

## Recent rename
`/will` -> `/wc` (initials handle). Internal references updated. Old paths are gone, not redirected.

## Latest: theme Tier 2 + first real paper page

Each theme now picks its own design language, not just its own palette:
- **cyberpunk**: matte surfaces, sharp 1px neon-bordered cards, fast easing, no blur.
- **luxury**: glass-morphism (`backdrop-filter: blur(22px)`), large rounded corners, gradient buttons, soft glows, slower easing.
- **paper**: hard offset shadow like a physical card stamped on a desk, near-zero radius, subtle paper-grain noise (`body::before`), buttons that "press into" the page on hover.

Driven by new tokens in `globals.css` (`--surface-style`, `--radius`, `--surface-shadow`, `--motion-ease`, `--button-bg`, etc) and three reusable utility classes: `.themed-surface`, `.themed-button`, `.themed-pill`. Plus `.themed-heading` for display type with theme-aware text-shadow.

Migrated to the new utilities: Modal, ComingSoon, /wc index cards, /wc/papers cards, /og index cards, /fmhy category grid, /experience MainMenu (cards, CTA, pills).

`/wc/papers/ai-cybercrime` is the first real paper page, with two interactive figures:
- **`<BarrierToEntry />`** (`src/app/wc/papers/ai-cybercrime/_components/`): pre-AI vs post-AI toggle, animated bar chart of layperson capability across six attack types (Tables 1, 3, 5 in the source paper).
- **`<CapabilityRamp />`**: year scrubber 2024-2047 with a 4-stage track (Stages 2-4 visually muted to mark them as projection, not observation). Selecting a stage shows hard requirements + an anchor reference (e.g. Grace et al. 2024 expert survey).

Konami code (↑↑↓↓←→←→ b a) cycles theme + plays a confetti burst. Camera FOV unified at 55° between LandingPage and Simulation so route changes don't snap.

## Next up

In rough priority order. Pick whichever fits the time you have. (Pre-formatted Issue bodies live in `BACKLOG.md`, paste into GitHub Issues, or batch-create via `gh` once it's installed.)

1. **Two more walkthroughs** in `/wc/learn`: `landing-flow` (LoadingScreen to LandingPage to NewLandingPage handoff + GLB preload) and `3d-scene` (anatomy of `Simulation.tsx`).
2. **Wire MDX** for `/wc/papers` so the AI/cybercrime paper can live as a single `.mdx` file with embedded React/3D demos.
3. **Real FMHY backup beyond the iframe**: fetch the upstream markdown at build time so search works against the real catalog (BACKLOG #1).
4. **Theme overhaul Tier 2** (BACKLOG #5) when ready: full design-language swap (glass / matte / paper surface variants).
5. **Camera FOV bridge** between LandingPage (fov=50) and Simulation (fov=60).
6. **Subset `Inter_Bold.json`** (5.2MB for one word).
7. **Pioneer Scholars paper draft** at `/wc/papers/ai-cybercrime` (depends on MDX wiring).
8. **Promote a sketch out of `/og/`** when one matures. `/og/fmhy` already graduated to `/fmhy`.

## Decisions worth remembering

- **No `next-themes`**: the theme system is four files (`globals.css` + `ThemeContext` + `ThemeSwitcher` + bootstrap script in `layout.tsx`). The walkthrough at `/wc/learn/theme-system` explains why.
- **No MDX yet**: the `/wc/papers` index renders from a hard-coded array. Adding `@next/mdx` is on the next-up list, deferred only because the build runs on Cloudflare Workers and I wanted to validate the simple path first.
- **No 3D in `not-found.tsx`**: it's a CSS-only floating glyph instead of mounting another R3F Canvas. Keeps the 404 fast and bypasses any `useGLTF.preload` ordering risk on a route the user shouldn't be on long.
- **`STARS_PER_UNIT = 1200`, `MAX_STARS = 12000`** in Simulation. The original `5000 * settings.stars` could hit 25k particles on a slider tweak. Don't lift the cap without re-benchmarking.
- **`HelpDot` lives in `layout.tsx`**, not in each page. One mount, present everywhere.

## Phone / cross-machine workflow

If you want to pick this up from a phone or a different machine:

1. **Commit / push from here first**, so the branch is on GitHub.
2. **Use `claude.ai/code` from any browser** (including phone). It connects to the GitHub repo and can edit, commit, and push without a local clone.
3. **Read `STATUS.md` and `MAP.md`** in that order, that's the whole context handoff.
4. **For tracked-but-not-yet-started work**: convert the "Next up" list above into GitHub Issues so you can poke them from the GitHub mobile app while waiting for the bus.
