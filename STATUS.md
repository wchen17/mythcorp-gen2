# STATUS

A short note for whoever (you, me, future-Claude on a different machine) picks this up next. Update at the end of each session.

## Last updated
2026-09-04 (branch `plain-mode`, second pass), **plain is now the site's holding mode, and the message is drawn by the simulation rather than written in the DOM.** Every route collapses to a work-in-progress screen; `PLAIN_OPEN_ROUTES` in `holdState.ts` is the allowlist and currently holds only `/contact`. The pre-paint script writes `data-hold` before anything renders and `[data-hold="on"] #page-root { display: none }` removes the content outright, so there is nothing to tab into and nothing for a screen reader to read. `layout.tsx` gained `#page-root` as the wrapper for everything the hold hides; the field, the hold chrome and the terminal sit outside it, and the terminal stays as an escape hatch alongside the explicit "leave plain mode" link.

**The words are dye.** `textMask.ts` renders the message to an offscreen canvas at 4x the grid, box-averages it to one value per cell, and `asciiFluid` adds that mask every frame instead of stamping once. Constant addition against constant decay settles at `gain / (1 - decay)`, about 1.07, so smeared letters heal back rather than blinking. Two vortices on Lissajous paths with no common period keep it moving when nobody touches it. The line breaks by grid aspect: one line on a wide desktop grid, three stacked when narrow. `asciiFluid` was split, with the ramp quantizer moving to `asciiRender.ts`, to stay under the 250-line rule. Also landed ideaboard #65 as `useScramble.ts`, used on the wordmark and on the contact link's hover.

**Three bugs found and fixed, two of them pre-existing and site-wide.** (1) **Every theme on this site was rendering in Times.** The Next font variables were on `<body>` while the theme tokens that reference them are declared on `<html>`, and a custom property resolves where it is declared, so `--font-display: var(--font-cinzel)` computed invalid at the root and inherited that invalidity everywhere. Moving the font classes to `<html>` fixed all four themes; Cinzel headings and Geist body text now actually render. (2) The holding screen flashed the real page: React does not know the stored theme until an effect runs, so for one frame it saw the default theme and cleared the attribute the pre-paint script had just set. `ThemeContext` now exposes `ready` and `PlainHold` waits for it. (3) The first pass's `body > *:not(canvas)` stacking rule also matched the hold layer and replaced its `fixed` with `relative`, collapsing it to a strip at the top; it is now scoped to `#page-root`.

**Verification.** `npm run check` green. Driven in a real Chrome: `/`, `/experience`, `/about` and `/wc/papers/ai-cybercrime` all hold with `#page-root` computed `display: none`, `/contact` renders normally, and the immediate-read probe that caught the flash now comes back clean on all four. The field inks up to a steady 80k painted pixels with no pointer input, and a column histogram of the strong ink shows the gaps between WORK, IN and PROGRESS. All four themes now report their intended font families. The "leave plain mode" link returns to cyberpunk and unmounts the hold. Both browser panes background-throttle rAF and timers, so the loop was driven by a manual frame pump.

**Note for the next session:** running `npm run build` overwrites `.next` and breaks an already-running `npm run dev` (its chunks start 404ing). Restart dev after any build.

### Previously

2026-09-04 (branch `plain-mode`), **shipped a fourth theme, `plain`, and the ASCII fluid field under it.** `plain` sets every Tier-2 token to its null value (0 radius, no shadow, 0ms motion, mono for all three font slots, black on white) so the theme has no ornament CSS can express, then adds one: `src/app/components/plain/asciiFluid.ts`, a semi-Lagrangian advection field rendered as characters in a 2D canvas, stirred by the pointer. No pressure solve (the expensive half of a real fluid step), a four-neighbour blur for viscosity, 0.985 per-frame decay, a ten-step luminance ramp (`' .:-=+*#%@'`) plus alpha for the in-between levels. Cells under 0.045 are skipped, so an idle page draws nothing. `PlainField.tsx` mounts it globally, returns null on the other three themes, and never mounts under `prefers-reduced-motion`; the loop stops on `visibilitychange`. The canvas reads its ink from `--plain-ink` so the theme still owns the colour. Ideaboard #56 and #64 fed this, though it is a 2D-canvas take rather than the WebGL one those describe. Walkthrough at `/wc/learn/plain-mode`, registered in the learn index, sitemap (26 pages), and MAP.md.

**Two bugs caught during verification, both fixed.** (1) A parked cursor injected dye every frame, so the field never settled; injection is now gated on pointer delta. (2) `@theme inline` had `--font-mono: var(--font-mono)`, which is circular, so *every* `font-mono` utility on the site was silently falling back to serif. Now `var(--font-geist-mono)`. That one is pre-existing and site-wide, not plain-mode specific.

**Verification.** `npm run check` green, 26 static pages. The solver was probed headlessly in Node against a stub canvas (dye grows along a drag, decays to zero glyphs about 60 frames after input stops, 0.12 ms/frame for the solve at a 110x40 grid). The live page was then driven in a real Chrome: painted pixels went 40 to 5862 across a drag and back to 0 after settling, and the canvas font resolves to Geist Mono with equal `i`/`W` advance widths. Both checks needed a manual frame pump, since a background tab pauses rAF and the component correctly stops itself when `document.hidden`.

### Previously

2026-05-23 (batch 6), **shipped the Manufactured Doubt ramble + tied it to Calhoun, and fixed the build-script recursion.** New `/og/doubt` (DraftBanner, themed, no em-dashes): Merchant of Doubt playbook (doubt as the product, delay as the win condition) into the honest counter, the solar and EV learning curves that moved regardless. Two interactive figures in `src/app/og/doubt/_components/ProgressFigures.tsx`: a log-scale solar $/W curve (anchors ~$76.67/W 1977 to ~$0.11/W 2024, Swanson's law caption) with hover points, and an EV-share scrubber (2013 ~0.3% to 2024 ~21%, anchors approximate, in-between interpolated). Numbers verified via web search (Our World in Data / IRENA / Swanson's law; IEA Global EV Outlook) and labelled approximate, since the essay is about not being sloppy with data. Added a "Roles, not room" human-parallel section to `/og/calhoun` (abundance outpacing roles, the human echo of the beautiful ones, deliberately resisting the doomer reading) and cross-linked the two rambles both ways. Registered `/og/doubt` in the `/og` SKETCHES, sitemap (26 pages), and MAP.md. Also fixed the build script: the merge had left `build: opennextjs-cloudflare build`, which recurses (opennextjs-cloudflare runs `npm run build` internally), restored `build: next build --no-lint` and added a `cf:build` for the explicit worker build; deploy/preview already wrap opennextjs-cloudflare. `npm run check` green. Verified in-browser: both figures render (solar SVG polyline, EV slider at 21%), cross-links resolve, no console errors. (Figures are SVG/DOM, so they render even with the preview tab hidden, unlike the R3F Calhoun sim.)

2026-05-23 (batch 5), **merged the remote `cloudflare-fmhy-backup-fixes` line into the Calhoun work.** origin/main had diverged from `41e1340` with a parallel line (PR #37): FMHY narrowed to a backup-sites directory + server component, new `landing-flow` and `3d-scene` walkthroughs, a Cloudflare build-script fix, and removal of the GitHub Actions workflows + issue templates. Reconciled by merge, favoring the remote where the same feature was redone, keeping unique local work. Took: remote FMHY (`backup-sites.json`, `fetch-fmhy.ts` fetching `backups.md`, server-component `/fmhy`), remote `/wc/about` (server component with `metadata` + timeline + GitHub link), remote walkthroughs and the Cloudflare build fix, the workflow/template removals. Kept: the local `/animals` refresh (thumbnail gallery, graceful fallback, Giphy attribution), `sitemap.ts`/`robots.ts`, the error boundaries, the replayable boot + terminal overlay, and all the Calhoun work. The old `/fmhy/[category]` mirror stays deleted (local pivot), so its `_components`/`_data` helpers are now orphaned and pending cleanup.

2026-05-23 (batch 4), **shipped the Calhoun ramble + behavioral-sink sim mode.** New `/og/calhoun` sketch page (DraftBanner, themed, no em-dashes): Universe 25, the four phases A-D, the "beautiful ones," the popular overpopulation reading vs. the true meaning (roles run out, not space/food), then a Merchant of Doubt riff tying doubt-manufacturing and meaning-flattening together as the same move (cutting a claim loose from its evidence). CTA deep-links to `/experience?mode=calhoun`. New `src/app/experience/BehavioralSink.tsx`: a 600-point cloud that loops Calhoun's curve (bloom outward, crowd into a central sink, shed pale withdrawn "beautiful ones" to an outer shell, dim to a still collapse, reset over CYCLE=26s), reporting phase + illustrative population via an `onState` callback throttled to ~5/sec. Lives in its own scene, `src/app/experience/CalhounSimulation.tsx` (own Canvas, own controls + top-right A/B/C/D + pop readout), kept fully separate from the spectre `Simulation` (which is byte-identical to its pre-Calhoun form again). `experience/page.tsx` now has three distinct views (`menu` / `simulation` / `calhoun`) that never co-mount; it reads `?mode=calhoun` from `window.location` on mount and routes straight to the Calhoun scene (no Suspense boundary needed). (An earlier pass had Calhoun as a toggle inside `Simulation`; that was split out into its own scene.) Added to `/og` SKETCHES, sitemap (22 pages), MAP.md (routes + 3D scene tables). `npm run check` green. Verified in-browser: `/og/calhoun` renders (h1, 4 phase cards, correct CTA href, no console errors); `/experience?mode=calhoun` mounts the canvas with the Calhoun toggle pre-checked. NOTE: the live frame animation + phase readout could not be visually confirmed because the preview harness tab is hidden (`document.hidden=true` throttles requestAnimationFrame, so R3F's useFrame loop and the screenshot both stall). Logic and wiring verified; the readout is gated on `calhoun && sink` where `sink` is set from the frame loop, so it populates as soon as a real (visible) tab runs RAF.

2026-05-23, **post-pivot cleanup + /animals refresh + wow-tier ideaboard.** Removed dead `categoryBySlug()` (and its `Namespace` import) from `fmhy/_data/categories.ts`, left over from the dropped dynamic route. Dropped the unused `GH_TOKEN` env from `.github/workflows/refresh-fmhy.yml`. Marked the stale "PR 1: FMHY mirror" section below as SUPERSEDED so it stops reading as current. Rebuilt `/animals`: migrated to `themed-surface` / `themed-button` / `themed-pill` (BACKLOG #8), added a clickable thumbnail gallery, a graceful "clip wandered off" fallback on image error, and `motion-safe:` on the bounce. Replaced all 5 Giphy clips with content-verified ones (searched Giphy, matched by its own tags/slugs, confirmed each `media.giphy.com` URL returns 200 image/gif and renders in-browser); titles now match what the clips actually show. `npm run check` green. Added 5 practical backlog items #67-#71 (Giphy attribution, self-host clips, one device-capability gate, CI build-guard, /animals favorites) and a new **IDEABOARD** section (#55-#66): drivable 3D portfolio, WebGL fluid cursor, raymarched SDF hero, GPGPU particle morph, scrollytelling paper, procedural Chicago skyline, desktop-OS /wc, displacement gallery, audio-reactive sim, ASCII post-process, text-scramble, live GLSL playground. All buildable on the installed R3F/three/gsap stack.

2026-05-23 (batch 2), **shipped SEO + error boundaries + /wc/about + Giphy attribution.** Added `src/app/sitemap.ts` (hand-maintained route list, base URL via `NEXT_PUBLIC_SITE_URL`, default `mythcorp.dev` from README) and `src/app/robots.ts` (allow-all, points at sitemap). Verified `/sitemap.xml` serves valid XML and `/robots.txt` serves correct text against the dev server (BACKLOG #30). Added `src/app/error.tsx` (themed boundary with reset button + SiteHeader, console.error for field observability) and `src/app/global-error.tsx` (own html/body, inline styles since theme tokens are unavailable when the layout itself fails) (BACKLOG #32). Built the real `/wc/about` page (was a 404 linked from the /wc index), updated the /wc card blurb away from "Coming soon", and added it to the sitemap + MAP.md (BACKLOG #2). Added Giphy attribution to /animals: per-clip "View on GIPHY" source link + "Powered by GIPHY" mark, per their ToS (BACKLOG #67). `npm run check` green, 21 static pages. All four verified in-browser.

2026-05-23 (batch 3), **made the boot replayable + shipped the terminal overlay (#24).** The cinematic LoadingScreen (3D binary-shape boot) only ran once per session, so the effort was rarely seen. `src/app/page.tsx` now honors `?boot=1` (forceBoot in AppLoader) and exposes a `replayIntro()` that clears the `mythcorp-booted` session flag and bumps a `key` on AppLoader to remount + re-run the boot in place. `NewLandingPage` got an optional `onReplayIntro` prop and a "↻ replay the boot sequence" button in the hero. New `src/app/components/TerminalOverlay.tsx` mounted globally in `layout.tsx` (next to HelpDot/KonamiEgg): press `/` anywhere to open a theme-aware fake terminal with `help / ls / cd <route> / whoami / cat readme / theme [name] / boot / date / clear / exit`, command history (up/down), Esc / outside-click to close. `cd` and `boot` actually navigate (`boot` -> `/?boot=1`, tying the two features together). Verified in-browser: terminal opens on `/`, runs commands, switches theme (cyberpunk->luxury), errors on unknown; `?boot=1` confirmed to render the LoadingScreen. Replay button confirmed compiled into the `/` bundle (in-browser click-through blocked by the R3F+GSAP transition being hard to drive programmatically). `npm run check` green.

Previous: 2026-05-18, **pivoted `/fmhy` from full mirror to themed directory.** Per-category / per-post / per-other pages and their snapshot JSONs are gone. The index page keeps the search + category nav + highlight cards, but every card now opens the canonical page on fmhy.net in a new tab. Above the grid: a three-card "official mirrors" row (fmhy.net, fmhy.net/other/backups, github.com/fmhy/edit). Reason: deep-dive pages 404'd in production despite a clean local build, opennextjs static-asset routing for nested dynamic params turned out fragile, and FMHY already maintains a backups page. The honest framing ("here's the map, click through for the real thing") is better than a partially-broken mirror. Dropped routes: `/fmhy/[category]`, `/fmhy/other/[slug]`, `/fmhy/posts/[slug]`. Dropped components: `EntryRow`, `ProsePage`. Dropped dep: `marked`. `scripts/fetch-fmhy.ts` slimmed to only produce `index.json` (counts + 4 highlights per catalog). `.fmhy-prose` CSS block removed from globals.

Previous: 2026-05-06, FMHY mirror + /experience continuity polish landed on branch `claude/vigilant-golick-c8ff8d`. Closes Issue #18 (FMHY) and Issue #13 (Simulation theming).

## What just shipped (Cloudflare / FMHY backup fixes)

- **FMHY scope narrowed**: `/fmhy` is now a lightweight backup-sites directory sourced from
  `docs/other/backups.md` (14 sites, 2 groups). The old full-catalog mirror (30 categories,
  5MB+ JSON) was the primary Cloudflare build-weight concern.
- **`fmhy/page.tsx` converted to server component**: removes the `'use client'` directive and
  the 39KB `index.json` from the client JS bundle. `metadata` export now works correctly.
- **`scripts/fetch-fmhy.ts` simplified**: was fetching the entire FMHY docs tree via GitHub API
  (30+ files). Now only fetches `docs/other/backups.md` and outputs `backup-sites.json`.
- **`refresh-fmhy.yml` updated**: `add-paths` now tracks `backup-sites.json` only, and the
  workflow passes `GITHUB_TOKEN` to the fetch script for rate-limit headroom.
- **`/wc/about` page created** (closes issue #14): bio, timeline, GitHub link.
- **`/animals` themed surfaces** (issue #19): card uses `themed-surface themed-surface-interactive`,
  button uses `themed-button`, back link uses `themed-surface themed-surface-interactive`.
- **`/og/chat` themed surfaces** (issue #19): message container, send button, and attachment
  button migrated to `themed-surface` / `themed-button`.

The existing per-category JSON files in `_data/categories/` and the `index.json` are untouched.
The `/fmhy/[category]` routes still work with existing data; they are just no longer promoted
from the index page.

## Previous: 2026-05-06, FMHY mirror + /experience continuity polish
(branch `claude/vigilant-golick-c8ff8d`, closes Issue #18 and Issue #13)

## What shipped in that session (PR 2: /experience continuity)

- `SiteHeader` is now mounted once at `src/app/experience/page.tsx` and stays visible across the menu/simulation crossfade.
- `MainMenu.tsx` no longer mounts its own SiteHeader.
- 420ms opacity crossfade between MainMenu and Simulation. Only one Canvas alive at a time (StrictMode constraint preserved).
- `Simulation.tsx` control panel migrated from hand-rolled colors to themed tokens.
- Canvas backdrop is theme-aware via `BACKDROP_BY_THEME`.
- Theme switcher reachable from inside Simulation.

## What just shipped (PR 1: FMHY mirror) [SUPERSEDED, see the 2026-05-23 merge above]

The deep-dive per-category / per-post pages and their per-category JSON files
described below no longer exist. `/fmhy` is now a backup-sites directory sourced
from `backups.md` via `backup-sites.json`. Kept for history.

- `scripts/fetch-fmhy.ts` + per-category JSON snapshot committed.
- `/fmhy` rewritten: hero + client-side search + theme-aware category chip filter + 22 themed cards.
- `/fmhy/[category]` pre-renders all 22 non-empty categories.

## Hard rules (saved to memory at ~/.claude/projects/<this-project>/memory/)

- **No em-dashes (--) anywhere.** Code, copy, comments, commits, markdown. Use commas, periods, semicolons, parentheses, or restructure.

## Next up

The full backlog is in `BACKLOG.md` (24+ items). High-leverage next steps:

1. **#13: Theme-aware Simulation control panel** (if not already done via PR 2 above).
2. **#15 / #16: Walkthroughs** (`landing-flow`, `3d-scene`).
3. **#30: More paper figures** for `ai-cybercrime`.
4. **#31: Mobile QA pass** (never verified on a real phone).
5. **#21: Subset `Inter_Bold.json`** (5.2MB font, only 8 chars needed).

## Decisions worth remembering

- **No `next-themes`**: the theme system is four files. See `/wc/learn/theme-system`.
- **FMHY data**: `_data/categories/*.json` and `index.json` remain in the repo and the `[category]` routes still work; only the index page changed.
- **`STARS_PER_UNIT = 1200`, `MAX_STARS = 12000`** in Simulation. Don't lift without benchmarking.
- **`HelpDot` lives in `layout.tsx`**, not per page.
