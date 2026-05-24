# STATUS

A short note for whoever (you, me, future-Claude on a different machine) picks this up next. Update at the end of each session.

## Last updated
2026-05-23 (batch 4), **shipped the Calhoun ramble + behavioral-sink sim mode.** New `/og/calhoun` sketch page (DraftBanner, themed, no em-dashes): Universe 25, the four phases A-D, the "beautiful ones," the popular overpopulation reading vs. the true meaning (roles run out, not space/food), then a Merchant of Doubt riff tying doubt-manufacturing and meaning-flattening together as the same move (cutting a claim loose from its evidence). CTA deep-links to `/experience?mode=calhoun`. New `src/app/experience/BehavioralSink.tsx`: a 600-point cloud that loops Calhoun's curve (bloom outward, crowd into a central sink, shed pale withdrawn "beautiful ones" to an outer shell, dim to a still collapse, reset over CYCLE=26s), reporting phase + illustrative population via an `onState` callback throttled to ~5/sec. Wired into `Simulation.tsx` with a minimal footprint: new `initialMode` prop, a "Behavioral sink (Calhoun)" panel toggle, conditional swap of Model+ParticleField for BehavioralSink, and a top-right phase readout (A/B/C/D + pop count). `experience/page.tsx` reads `?mode=calhoun` from `window.location` on mount and drops straight into the sim (no Suspense boundary needed). Added to `/og` SKETCHES, sitemap (22 pages), MAP.md (routes + 3D scene tables). `npm run check` green. Verified in-browser: `/og/calhoun` renders (h1, 4 phase cards, correct CTA href, no console errors); `/experience?mode=calhoun` mounts the canvas with the Calhoun toggle pre-checked. NOTE: the live frame animation + phase readout could not be visually confirmed because the preview harness tab is hidden (`document.hidden=true` throttles requestAnimationFrame, so R3F's useFrame loop and the screenshot both stall). Logic and wiring verified; the readout is gated on `calhoun && sink` where `sink` is set from the frame loop, so it populates as soon as a real (visible) tab runs RAF.

2026-05-23, **post-pivot cleanup + /animals refresh + wow-tier ideaboard.** Removed dead `categoryBySlug()` (and its `Namespace` import) from `fmhy/_data/categories.ts`, left over from the dropped dynamic route. Dropped the unused `GH_TOKEN` env from `.github/workflows/refresh-fmhy.yml`. Marked the stale "PR 1: FMHY mirror" section below as SUPERSEDED so it stops reading as current. Rebuilt `/animals`: migrated to `themed-surface` / `themed-button` / `themed-pill` (BACKLOG #8), added a clickable thumbnail gallery, a graceful "clip wandered off" fallback on image error, and `motion-safe:` on the bounce. Replaced all 5 Giphy clips with content-verified ones (searched Giphy, matched by its own tags/slugs, confirmed each `media.giphy.com` URL returns 200 image/gif and renders in-browser); titles now match what the clips actually show. `npm run check` green. Added 5 practical backlog items #67-#71 (Giphy attribution, self-host clips, one device-capability gate, CI build-guard, /animals favorites) and a new **IDEABOARD** section (#55-#66): drivable 3D portfolio, WebGL fluid cursor, raymarched SDF hero, GPGPU particle morph, scrollytelling paper, procedural Chicago skyline, desktop-OS /wc, displacement gallery, audio-reactive sim, ASCII post-process, text-scramble, live GLSL playground. All buildable on the installed R3F/three/gsap stack.

2026-05-23 (batch 2), **shipped SEO + error boundaries + /wc/about + Giphy attribution.** Added `src/app/sitemap.ts` (hand-maintained route list, base URL via `NEXT_PUBLIC_SITE_URL`, default `mythcorp.dev` from README) and `src/app/robots.ts` (allow-all, points at sitemap). Verified `/sitemap.xml` serves valid XML and `/robots.txt` serves correct text against the dev server (BACKLOG #30). Added `src/app/error.tsx` (themed boundary with reset button + SiteHeader, console.error for field observability) and `src/app/global-error.tsx` (own html/body, inline styles since theme tokens are unavailable when the layout itself fails) (BACKLOG #32). Built the real `/wc/about` page (was a 404 linked from the /wc index), updated the /wc card blurb away from "Coming soon", and added it to the sitemap + MAP.md (BACKLOG #2). Added Giphy attribution to /animals: per-clip "View on GIPHY" source link + "Powered by GIPHY" mark, per their ToS (BACKLOG #67). `npm run check` green, 21 static pages. All four verified in-browser.

2026-05-23 (batch 3), **made the boot replayable + shipped the terminal overlay (#24).** The cinematic LoadingScreen (3D binary-shape boot) only ran once per session, so the effort was rarely seen. `src/app/page.tsx` now honors `?boot=1` (forceBoot in AppLoader) and exposes a `replayIntro()` that clears the `mythcorp-booted` session flag and bumps a `key` on AppLoader to remount + re-run the boot in place. `NewLandingPage` got an optional `onReplayIntro` prop and a "↻ replay the boot sequence" button in the hero. New `src/app/components/TerminalOverlay.tsx` mounted globally in `layout.tsx` (next to HelpDot/KonamiEgg): press `/` anywhere to open a theme-aware fake terminal with `help / ls / cd <route> / whoami / cat readme / theme [name] / boot / date / clear / exit`, command history (up/down), Esc / outside-click to close. `cd` and `boot` actually navigate (`boot` -> `/?boot=1`, tying the two features together). Verified in-browser: terminal opens on `/`, runs commands, switches theme (cyberpunk->luxury), errors on unknown; `?boot=1` confirmed to render the LoadingScreen. Replay button confirmed compiled into the `/` bundle (in-browser click-through blocked by the R3F+GSAP transition being hard to drive programmatically). `npm run check` green.

Previous: 2026-05-18, **pivoted `/fmhy` from full mirror to themed directory.** Per-category / per-post / per-other pages and their snapshot JSONs are gone. The index page keeps the search + category nav + highlight cards, but every card now opens the canonical page on fmhy.net in a new tab. Above the grid: a three-card "official mirrors" row (fmhy.net, fmhy.net/other/backups, github.com/fmhy/edit). Reason: deep-dive pages 404'd in production despite a clean local build, opennextjs static-asset routing for nested dynamic params turned out fragile, and FMHY already maintains a backups page. The honest framing ("here's the map, click through for the real thing") is better than a partially-broken mirror. Dropped routes: `/fmhy/[category]`, `/fmhy/other/[slug]`, `/fmhy/posts/[slug]`. Dropped components: `EntryRow`, `ProsePage`. Dropped dep: `marked`. `scripts/fetch-fmhy.ts` slimmed to only produce `index.json` (counts + 4 highlights per catalog). `.fmhy-prose` CSS block removed from globals.

Previous: 2026-05-06, FMHY mirror + /experience continuity polish landed on branch `claude/vigilant-golick-c8ff8d`. Closes Issue #18 (FMHY) and Issue #13 (Simulation theming).

Previous: 2026-05-05, planning pass. Refreshed `BACKLOG.md` with 22 categorized items + a script to post them all to GitHub Issues with one command.

## What just shipped (PR 2: /experience continuity)

- `SiteHeader` is now mounted once at `src/app/experience/page.tsx` and stays visible across the menu/simulation crossfade. Previously it vanished the moment Simulation mounted, breaking site continuity.
- `MainMenu.tsx` no longer mounts its own SiteHeader.
- 420ms opacity crossfade between MainMenu and Simulation. Only one Canvas alive at a time (StrictMode constraint preserved).
- `Simulation.tsx` control panel migrated from hand-rolled `bg-black/70 text-white border-white/20 accent-cyan-400` to `themed-surface`, `themed-button`, `themed-pill`, `var(--accent)`, `var(--border)`, etc. The panel now respects all three themes.
- Number/text inputs use `var(--bg)` + `var(--border)` and focus to `var(--accent)`.
- Range sliders use `accent-[color:var(--accent)]`.
- Canvas backdrop is theme-aware via `BACKDROP_BY_THEME`. Paper theme no longer flashes black behind the scene.
- Stars density was added as a top-level (non-advanced) control since it was buried in randomize-only territory.
- Theme switcher (in SiteHeader) is now reachable from inside Simulation.

## What just shipped (PR 1: FMHY mirror) [SUPERSEDED by the 2026-05-18 pivot above]

The deep-dive per-category / per-post pages and their per-category JSON files
described below no longer exist. `fetch-fmhy.ts` now writes only `index.json`,
and `/fmhy` is a themed directory that links out to fmhy.net. Kept for history.

- `scripts/fetch-fmhy.ts` pulls each category from `github.com/fmhy/edit/main/docs/<file>.md`, parses to structured JSON via hand-rolled regex (badges, name/url, blurb, resourceLinks). Run via `npm run fetch:fmhy`.
- 24 category metadata entries in `src/app/fmhy/_data/categories.ts` map local slugs to upstream filenames (which diverge: `video` -> `video.md`, `adblockvpnguide` -> `privacy.md`, etc).
- Snapshot committed as one slim 18KB `index.json` (highlights + counts) plus 24 per-category JSON files in `_data/categories/`. Largest category file is ~480KB; total ~5MB stays out of the worker bundle because per-category routes load via `fs.readFile` at SSG time.
- `/fmhy` rewritten: hero + client-side search + theme-aware category chip filter + 22 themed cards each linking to `/fmhy/<slug>`. Iframe and 5s timeout fallback both gone.
- `/fmhy/[category]` pre-renders all 22 non-empty categories. Sections grouped, badges + resource links rendered, breadcrumb back to `/fmhy`, footer pointing at the upstream markdown file.
- `tsx` added as devDependency to run the fetch script.

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

The full backlog is in `BACKLOG.md` (22 items, categorized by label). To post them all as GitHub Issues:

```powershell
gh auth login                          # one time
./tools/post-backlog-to-issues.ps1     # creates one Issue per BACKLOG item, skips dupes
```

The highest-leverage items, in rough order:

1. **#1: Theme-aware Simulation control panel** — the one place still using hardcoded colors. Migrating it propagates the Tier 2 design language everywhere.
2. **#2: Build /wc/about** — currently 404, linked from /wc index.
3. **#3 + #4: Two more walkthroughs** (`landing-flow`, `3d-scene`) — flesh out /wc/learn.
4. **#5: More figures for the AI-cybercrime paper** — Expert Debate quadrant, attack-chain step-through, governance trilemma triangle, capability ladder infographic.
5. **#6: Build-time FMHY catalog fetch** — turns the iframe placeholder into real searchable content.
6. **#7: MDX wiring** — unlocks easier paper authoring for #14.
7. **#8: Migrate /animals + /og/* to themed surfaces** — propagation cleanup.
8. **#9: Mobile QA pass** — never actually verified on a real phone.

Items 9-22 cover performance (font subset, 3D mobile fallback, accessibility), nice-to-haves (time-of-day theme, view transitions, RSS feed, custom domain), and speculative ideas (reading log, now-page, more easter eggs).

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
