# STATUS

A short note for whoever (you, me, future-Claude on a different machine) picks this up next. Update at the end of each session.

## Last updated
2026-05-04, site refresh sweep on branch `claude/vigilant-golick-c8ff8d`. Pushed to GitHub (open the branch in `claude.ai/code` or pull locally).

## What just shipped
A large refresh that addresses the brief: humanise/whimsical, showcase tech, codebase as a learning artefact, structure for cheap future iteration. Specifically:

- **Theme system** (cyberpunk / luxury / paper) with no-flash bootstrap, `localStorage` persistence, and a header switcher.
- **Cinematic landing flow** unified, LoadingScreen → LandingPage → NewLandingPage handoff, with the routing bug (logo click navigated *and* transitioned) fixed and `spectre.glb` preloaded once for the session.
- **NewLandingPage refactored** from a 333-line monolith into 5 small files under `src/app/components/landing/`. Every audit issue addressed: header `flex` instead of broken `grid`, banner gets serif + glow, hero responsive on mobile, modal styling unified, hard-coded colours migrated to theme tokens, dead disabled links removed, snarky multi-click counter replaced with a single warm popup that points to `/will/learn`.
- **Shared `<SiteHeader>` and `<ComingSoon>`**, replaces the header that was previously hand-rolled across 5 pages.
- **Subpages migrated**: `/about` (rewritten warmer), `/contact` (now `<ComingSoon>`, the fake `(676) 767-7676` number is gone), `/animals` (kept its personality, ported to theme tokens).
- **`/experience`** cleaned: SETTINGS (WIP) button removed, dead `/bin/animals` and `/dev/chat` "secret routes" replaced with real working links, stars count clamped at 12000 to keep mid-tier GPUs at 60fps.
- **Personal section `/will`** scaffolded: `/will`, `/will/papers`, `/will/learn`, plus the first real walkthrough `/will/learn/theme-system`.
- **Whimsical 404** at `src/app/not-found.tsx` and a floating `?` `HelpDot` mounted globally.
- **Cross-session docs**: `MAP.md` (file index), `CLAUDE.md` (conventions), `STATUS.md` (this file).

## Next up

In rough priority order. Pick whichever fits the time you have. (Pre-formatted Issue bodies live in `BACKLOG.md`, paste into GitHub Issues, or batch-create via `gh` once it's installed.)

1. **Two more walkthroughs** in `/will/learn`: `landing-flow` (LoadingScreen→LandingPage→NewLandingPage handoff + GLB preload) and `3d-scene` (anatomy of `Simulation.tsx`, particles, bloom, settings).
2. **Wire MDX** for `/will/papers` so the AI/cybercrime paper can live as a single `.mdx` file with embedded React/3D demos. `@next/mdx` + `remark-gfm` + `rehype-pretty-code` + `shiki`. Verify it works on Cloudflare Workers before committing.
3. **Camera FOV bridge**: LandingPage uses fov=50, Simulation uses fov=60, consider a smoother handoff (single shared fov, or GSAP-tween across the route change with a transition animation).
4. **Subset `Inter_Bold.json`**: it's 5.2MB but only one word is rendered. A subset font would shave ~5MB off the boot.
5. **`/about` content**: still pretty short. A small "what I built and why" timeline might fit here once the project has more shipped pieces.
6. **Pioneer Scholars paper draft** at `/will/papers/ai-cybercrime`, the actual content. Long-term project.
7. **Promote a sketch out of `/og/`**: when one of `/og/chat`, `/og/fmhy`, `/og/interactive` matures, move the folder up out of `/og`, drop the `<DraftBanner />`, remove from `SKETCHES`. (See MAP.md "How to add X".)

## Decisions worth remembering

- **No `next-themes`**: the theme system is four files (`globals.css` + `ThemeContext` + `ThemeSwitcher` + bootstrap script in `layout.tsx`). The walkthrough at `/will/learn/theme-system` explains why.
- **No MDX yet**: the `/will/papers` index renders from a hard-coded array. Adding `@next/mdx` is on the next-up list, deferred only because the build runs on Cloudflare Workers and I wanted to validate the simple path first.
- **No 3D in `not-found.tsx`**: it's a CSS-only floating glyph instead of mounting another R3F Canvas. Keeps the 404 fast and bypasses any `useGLTF.preload` ordering risk on a route the user shouldn't be on long.
- **`STARS_PER_UNIT = 1200`, `MAX_STARS = 12000`** in Simulation. The original `5000 * settings.stars` could hit 25k particles on a slider tweak. Don't lift the cap without re-benchmarking.
- **`HelpDot` lives in `layout.tsx`**, not in each page. One mount, present everywhere.

## Phone / cross-machine workflow

If you want to pick this up from a phone or a different machine:

1. **Commit / push from here first**, so the branch is on GitHub.
2. **Use `claude.ai/code` from any browser** (including phone). It connects to the GitHub repo and can edit, commit, and push without a local clone.
3. **Read `STATUS.md` and `MAP.md`** in that order, that's the whole context handoff.
4. **For tracked-but-not-yet-started work**: convert the "Next up" list above into GitHub Issues so you can poke them from the GitHub mobile app while waiting for the bus.
