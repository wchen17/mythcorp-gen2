# STATUS

A short note for whoever (you, me, future-Claude on a different machine) picks this up next. Update at the end of each session.

## Last updated
2026-05-04, site refresh sweep on branch `claude/vigilant-golick-c8ff8d`. Pushed to GitHub (open the branch in `claude.ai/code` or pull locally).

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
