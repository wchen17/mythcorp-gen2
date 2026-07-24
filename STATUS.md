# STATUS

## Upload conventions pass, 2026-07-24
Aligned the image host with what long-standing hosts do. Three decisions worth not re-litigating:

1. **The view page is `/a/<id>`, not `/i/<key>.png`.** An `i` host plus a file extension means raw bytes everywhere else on the internet, and `i.mythcorp.dev` is the planned R2 custom domain, so serving HTML from `/i/` was training people to expect the wrong thing. `/i/[key]` now 308s to the new route. The id is the object key minus its extension, looked up by KV prefix, and `isObjectId` hard-validates the 22-character shape first because an unvalidated prefix scan is an enumeration hole.
2. **Uploads return a delete token** (`mcd_`, hashed in KV, raw value shown once) alongside the direct and embed links, so a keyholder can remove their own image without an admin. Redeeming it is `POST /api/delete`; the `/d/<token>` page only renders. A GET must never delete, because link unfurlers and browser prefetch issue GETs and the first Discord preview would destroy the image. `.sxcu` now carries `DeletionURL` and `ThumbnailURL`.
3. **Assets are noindex, not robots-disallowed.** Discordbot and Twitterbot obey robots.txt but ignore the noindex meta tag, so a `Disallow: /a` would have killed rich embeds while doing nothing search engines would not do anyway. `/d` and `/upload` ARE disallowed. Delete pages should never be crawled at all.

Still open from the earlier review: `/api/upload` takes raw binary only, so the universal `curl -F 'file=@x.png'` idiom does not work, and nothing expires under the 9 GB ceiling.

## Upload Phase 3b and 3c, 2026-07-24
Added admin rich-embed editing for image views. Embed title and description are trimmed and length-limited, accent colors require a six-digit hex value on write and before metadata emission, and the gallery editor saves through the admin-gated PATCH endpoint. Updated the public view to use the saved title, description, and theme color.

## Upload Phase 3a, 2026-07-24
Added the public `/i/[key]` image view. It reads the KV object record, returns a real 404 for unknown keys, and uses Next Metadata for escaped OpenGraph and Twitter image metadata pinned to the stored public URL. Upload responses now include a rich embed URL alongside the direct public link.

## Upload Phase 2b, 2026-07-24
Converted the admin object list into a responsive gallery. Added useObjects for loading and deletion, ObjectTile for thumbnails, public-link copy, and two-step inline deletion, plus a themed storage meter that switches to the warm accent at 80 percent. Production build and TypeScript checks pass.

## Upload Phase 2a, 2026-07-24
Split /upload into a thin page shell, DropConsole, UploadResult, and useUpload. Added fragment-only key prefill with URL stripping, paste-to-upload, accepted/rejected drag states, local object URL previews with cleanup, XHR byte progress and speed readout, and self-resetting public-link copy feedback. TypeScript passes. The Next build is currently blocked in this workspace because Wrangler cannot write its logs and registry under C:\Users\wayba\.wrangler, outside the writable workspace.

A short note for whoever (you, me, future-Claude on a different machine) picks this up next. Update at the end of each session.

## Last updated
2026-07-21 (batch 7), **bugfixes, an interactive /wc/learn upgrade, and a humanizing copy pass.** Three workstreams. (1) Bugs: fixed the Simulation reset aliasing (`resetToDefaults` handed `setSettings` the module-level `DEFAULTS`, sharing `DEFAULTS.position` by reference, so editing a Position slider mutated the defaults and a second reset was a React bail-out; added `getDefaultSettings = () => ({ ...DEFAULTS, position: [...DEFAULTS.position] })` and reset through it; kept `DEFAULTS` for the `keyof` type and left the random-on-mount initial state alone). Deleted the FMHY orphans left over from the mirror pivot (`_components/CategoryNav`, `_components/SearchBox`, `_data/categories.ts`, `_data/index.json`, `_lib/types.ts`); verified `fmhy/page.tsx` imports only `SiteHeader` + `backup-sites.json` and `fetch-fmhy.ts` writes only `backup-sites.json` before removing. **Calhoun render CONFIRMED (the thing batch 4 could not verify):** drove `/experience?mode=calhoun` in the preview, the point cloud animated from phase A (tight founders) to phase B "Exploit" with population climbing to ~2,017 and the phase readout populating; no console errors; the `/og/calhoun` CTA links correctly to `/experience?mode=calhoun`. (The background-tab RAF throttle still freezes the frame loop and times out screenshots, but forward progress was captured across two reads, so the scene is confirmed working.) (2) `/wc/learn` is now interactive: five new primitives in `_components/` (DemoPanel, TokenPlayground, MiniStarField + MiniStarFieldDemo, FlowStepper) plus a `Code` upgrade (`filename` + `highlight?: number[]` line tinting). theme-system gained a live TokenPlayground ("now break it"), 3d-scene gained a pocket R3F star field and a show-the-bug diff of the exact reset aliasing above, landing-flow gained the FlowStepper, and a fourth walkthrough `/wc/learn/build-a-playground` documents the primitives by embedding each as its own live example. Snippet strings for 3d-scene and landing-flow were extracted to sibling `_snippets.ts` to stay under the ~250-line ceiling. Verified in-browser: TokenPlayground override sets an inline `--accent`, switching theme clears it and leaves localStorage holding only a valid theme; the mini canvas mounts via `ssr:false` with no hydration warnings; the highlight prop renders tinted lines. (3) Humanizing pass over site copy guided by the Weibao voice doc (v1.80) + Online Presence Strategy: the four AI tells (uniform sentence length, hedging, signposting, meta-commentary) and no em dashes. Finding: the existing copy was already written in-voice, so the honest pass left most of it alone rather than manufacturing changes. The one substantive fix was the stale `/og` FMHY blurb (it described "category links and a live embed" that the mirror pivot removed); the wc/learn blurbs were refreshed to sell the new interactivity. Both essays (`/og/calhoun`, `/og/doubt`) passed the four-tells checklist and were left intact. `npm run check` green, 26 pages.

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

UPDATE (batch 7, 2026-07-21): this is now fully resolved. The `/fmhy/[category]` routes were
removed in the pivot, and their orphaned helpers (`_components/CategoryNav`, `_components/SearchBox`,
`_data/categories.ts`, `_data/index.json`, `_lib/types.ts`) are now deleted. `/fmhy` reads only
`_data/backup-sites.json`. No `[category]` routes or per-category JSON remain.

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

- **`PLAN.md` added (2026-07-21)**: sequences the backlog into phases (stabilize, safety net, performance, reach, content, one flagship). Pick work from it top to bottom; BACKLOG.md stays the item-level detail.

- **`DESIGN.md` added (2026-07-20)**: locks visual taste (theme-as-design-language rule, type/color limits, anti-generic bans, pre-ship checklist). Read it before any UI work; CLAUDE.md points to it.

- **No `next-themes`**: the theme system is four files. See `/wc/learn/theme-system`.
- **FMHY data**: only `_data/backup-sites.json` remains; the `[category]` routes and per-category JSON are gone (removed in the pivot, orphans deleted batch 7). `/fmhy` is a backup-sites directory.
- **Custom playgrounds over Sandpack (batch 7)**: `/wc/learn` interactivity is hand-built primitives (DemoPanel, TokenPlayground, MiniStarField, FlowStepper), not `@codesandbox/sandpack-react`. A live demo that drives the real component can't drift from it, weighs almost nothing, and needs no bundler on the edge. BACKLOG #39 (Sandpack) is deferred by this decision, not pending.
- **TokenPlayground override-and-clear model (batch 7)**: it edits real CSS variables via inline `setProperty` (which outranks the `[data-theme]` block), but tracks every token it sets in a ref and `removeProperty`s exactly those on reset, unmount, and theme change. It never writes localStorage or `dataset.theme`, so it can recolor the live page without corrupting the persisted theme.
- **Fourth walkthrough is self-referential (batch 7)**: `/wc/learn/build-a-playground` documents the playground primitives by embedding each as its own live example (the playground that explains playgrounds is itself a playground).
- **`STARS_PER_UNIT = 1200`, `MAX_STARS = 12000`** in Simulation. Don't lift without benchmarking.
- **`HelpDot` lives in `layout.tsx`**, not per page.

2026-07-23: Codex brief pass in progress. /about and /contact are slim WIP stubs. /animals is parked at /og/animals for a rebuild using licensed or clearly attributed cute anime or animal art instead of GIPHY embeds. /og is being soft-hidden from search while remaining reachable by URL.

## Codex brief completion, 2026-07-24
Completed the storefront/workshop cleanup: about and contact remain slim WIP pages, animals lives at `/og/animals` as a parked sketch, the hero experiment has its own `/og/hero-lab` route, and the landing keeps one reduced-motion-safe reactive title. The workshop is noindexed and disallowed in robots while remaining reachable through its single Sketches door. Repointed the experience palate-cleanser link and removed the stale EnterBanner map row.

