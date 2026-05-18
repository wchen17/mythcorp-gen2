# BACKLOG

Pre-formatted issues for the next session (mobile or desktop, you or a fresh agent). Each item is independent. Pick any.

To post all of these to GitHub Issues at once, run:

```powershell
gh auth login         # one time, opens a browser
./tools/post-backlog-to-issues.ps1
```

That script reads every `## #N, ...` heading in this file and creates one Issue per heading on `wchen17/mythcorp-gen2`, applying the labels in the `**Labels:**` line.

---

## #2, /wc/about page (currently 404)

**Labels:** `content`, `next-up`

**Body:**

`/wc` has a card linking to `/wc/about` but the route doesn't exist. Either:
1. Build a real `/wc/about` page with a short bio + project history timeline.
2. Or remove the card from `src/app/wc/page.tsx`'s `sections` array.

Recommendation: build the page. Pattern after `/wc/papers` shape (eyebrow + heading + sections). Content: Will Chen (Weibao Chen), undergrad working on AI safety / cybersecurity adjacent stuff, why this site exists (sandbox + showcase), what's coming next.

---

## #3, Walkthrough: `/wc/learn/landing-flow`

**Labels:** `walkthrough`, `next-up`

**Body:**

Second annotated walkthrough at `src/app/wc/learn/landing-flow/page.tsx`. Subject: how the cinematic boot works.

Cover:
- `LoadingScreen` (cyberpunk binary digit shape) at `src/app/components/LoadingScreen.tsx`.
- `LandingPage` (3D MYTHCORP logo + spectre model) at `src/app/components/LandingPage.tsx`.
- `NewLandingPage` (luxury Chicago skyline reveal) at `src/app/components/NewLandingPage.tsx`.
- The handoff: `useGLTF.preload('/spectre.glb')` at module top, plus mutually-exclusive Canvas mounting in `AppLoader` (only one `<Canvas>` alive at a time, otherwise R3F crashes under StrictMode).
- The session-storage skip: boot only runs on first visit per session.

Use the `Walkthrough`/`Section`/`Code`/`Aside` helpers from `src/app/wc/learn/_components/Walkthrough.tsx`. Add `landing-flow` to `WALKTHROUGHS` in `src/app/wc/learn/page.tsx` and flip its `status` from `soon` to `ready`.

---

## #4, Walkthrough: `/wc/learn/3d-scene`

**Labels:** `walkthrough`, `next-up`

**Body:**

Third walkthrough at `src/app/wc/learn/3d-scene/page.tsx`. Subject: anatomy of `src/app/experience/Simulation.tsx`.

Cover:
- `<Canvas>` + R3F basics
- `ParticleField`: `BufferGeometry` + `Float32Array` for vertex positions and colors
- `Stars` count clamped at `MAX_STARS = 12000` with `STARS_PER_UNIT = 1200` (and *why*: original `5000 * settings.stars` could hit 25k particles)
- `Bloom` post-processing tuning (`luminanceThreshold`, `mipmapBlur`)
- The randomisable `DEFAULTS` settings object and `getRandomSettings()`

---

## #5, More figures for `/wc/papers/ai-cybercrime`

**Labels:** `paper`, `feature`

**Body:**

Two figures shipped (`<BarrierToEntry />`, `<CapabilityRamp />`). The paper has 4-6 more passages that map cleanly to interactive widgets:

- **Expert Debate quadrant**: 2x2 grid (LeCun / Altman / Whittaker / Hinton) with offensive vs defensive impact bars per quadrant. From Tables 6 and 7. Click to focus a quadrant and see argument detail.
- **Attack chain step-through**: a Stuxnet or Hong Kong CFO heist case study as a horizontal step diagram, with each step labeled "still requires human" / "AI does this now" / "AI will do this".
- **Governance trilemma triangle**: open-source vs regulation vs antitrust as a triangle with a draggable point that shows which threat surface each policy blend leaves open.
- **Stage-1-to-4 capability ladder**: vertical infographic of the technical hurdles (planning, error handling, memory, self-improvement, vulnerability discovery, cross-domain synthesis) as a ladder with current/projected positions marked.

Each new figure goes in `src/app/wc/papers/ai-cybercrime/_components/` and gets a `<Section>` in the main page. Keep the projection-vs-evidence visual distinction the reviewer asked for.

---

## #7, Wire MDX for `/wc/papers`

**Labels:** `paper`, `infra`

**Body:**

The first paper (`/wc/papers/ai-cybercrime`) is a TSX page right now. That's fine for figure-heavy pages with custom React widgets, but adding MDX support would make future papers easier to author (write `.mdx`, embed React components inline).

Steps:
- `npm install @next/mdx @mdx-js/react remark-gfm rehype-pretty-code shiki`
- Update `next.config.ts` with `pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']` and the `withMDX` wrapper.
- Create `src/app/wc/papers/mdx-components.tsx` exporting `<Figure>`, `<Aside>`, `<Sandbox>` so embedded React/3D demos are easy.
- Verify it builds on Cloudflare Workers (`npm run preview`) before merging. Past us has been bitten by Node-only MDX plugins on the edge runtime.

---

## #8, Migrate `/animals` and remaining `/og/*` to themed surfaces

**Labels:** `polish`, `housekeeping`

**Body:**

Theme Tier 2 utilities (`themed-surface`, `themed-button`, `themed-pill`) now exist but `/animals`, `/og/chat`, and `/og/interactive` haven't been migrated. They still use hand-rolled `border border-[color:var(--border)] bg-[color:var(--bg-elevated)]` patterns.

Replace those with the utility classes so all themes get their proper design language (paper gets the hard-offset shadow, luxury gets glass blur, etc.).

---

## #9, Mobile QA pass

**Labels:** `polish`, `accessibility`

**Body:**

The site has been built with `sm:` breakpoints from day one, but never actually verified on a real phone. Open the deployed branch on iOS Safari and Chrome Android and check:

- Boot flow doesn't break (LoadingScreen + LandingPage 3D)
- Hamburger menu opens cleanly with one finger
- Theme switcher reachable
- `/wc/papers/ai-cybercrime` figures (BarrierToEntry, CapabilityRamp) work with touch
- Hero "DISCOVER YOUR POTENTIAL" doesn't wrap weirdly
- /experience MainMenu CTA is thumb-reachable
- /fmhy iframe behaves on mobile (likely doesn't render at all)

Document issues in a follow-up comment, fix in a follow-up PR.

---

## #10, 3D experience mobile fallback

**Labels:** `feature`, `performance`

**Body:**

`/experience` and `/` both render heavy R3F scenes that target desktop GPUs. On a low-end Android, the fan spins up immediately. Add a check (UA sniff or `navigator.hardwareConcurrency < 4`) and either:

1. Render a static screenshot of the scene with a "your device might not love this; tap to render anyway" overlay, or
2. Drop particle counts and disable `<Bloom>` postprocessing on mobile.

The MainMenu tease bar (`~12k particles`) becomes a knob, not just decoration.

---

## #11, Accessibility pass

**Labels:** `accessibility`, `polish`

**Body:**

`prefers-reduced-motion` is already honored for the theme transition curtain. Extend to:
- LoadingScreen 3D animation (skip the binary digit fly-in if reduce)
- LandingPage 3D logo (static pose if reduce)
- HelpDot panel entrance
- Konami egg confetti
- AnimatedHeading shadows
- Banner pulse glow

Also: keyboard navigation through the SiteHeader menu, focus rings everywhere, ARIA labels on the BarrierToEntry toggle and CapabilityRamp slider, alt text for the skyline image.

---

## #12, Subset `Inter_Bold.json`

**Labels:** `polish`, `performance`

**Body:**

`public/fonts/Inter_Bold.json` is 5.2MB but `<Text3D>` only renders the word "MYTHCORP" (8 unique characters). Use `facetype.js` to subset:

```bash
npx facetype.js Inter-Bold.ttf --chars MYTHCORP > public/fonts/Inter_Bold.json
```

Should drop ~5MB off the initial boot. Only `src/app/components/LandingPage.tsx` uses it.

---

## #13, Camera FOV polish: GSAP transition between routes

**Labels:** `polish`, `3d`

**Body:**

LandingPage and Simulation now both use `fov={55}` so there's no zoom snap, but the route change is still a hard cut. A GSAP-tween across the transition (fade out + slight zoom in + fade in new scene) would feel more cinematic.

Probably best wrapped in a `<RouteTransition>` HOC that uses Next.js's `useRouter` events.

---

## #14, Pioneer Scholars paper continuation

**Labels:** `paper`, `content`

**Body:**

`/wc/papers/ai-cybercrime` shipped sections 1, 2, "why this matters", "reviewer feedback", "where this goes next". The original paper has more chapters worth converting:

- **Pre-AI baseline** (Section 3): Table 1 details + nation-state resource framing
- **Present threat landscape** (Section 5): malware case studies (GoldFactory trojan, etc.) as small inline diagrams
- **Future horizon 2025-2030** (Section 6): per-stage hard requirements as a checklist visualization
- **Expert debate** (Section 7): tied to BACKLOG #5 expert-quadrant figure
- **Countermeasures** (Section 8): governance trilemma figure (also #5)
- **Conclusion**: short call-to-action paragraph

Each lands as a new `<Section>` in `src/app/wc/papers/ai-cybercrime/page.tsx`. Tighten the prose vs the original PDF.

---

## #15, Time-of-day auto theme

**Labels:** `feature`, `nice-to-have`

**Body:**

Add an "auto" theme option that picks based on local time:
- 06:00-11:00: `paper` (morning reading)
- 11:00-19:00: `luxury` (afternoon warmth)
- 19:00-06:00: `cyberpunk` (night)

Stored as `mythcorp-theme=auto` in localStorage. The ThemeSwitcher gets a fourth option "auto" with a sun/moon glyph that flips based on time.

---

## #16, View Transitions API for route changes

**Labels:** `feature`, `nice-to-have`

**Body:**

Next.js 15 has experimental View Transitions support. Enable it for cross-fade between routes (e.g. `/` to `/wc` or `/wc/papers/ai-cybercrime`). Combined with `view-transition-name` on the SiteHeader logo, the logo would morph instead of re-rendering.

Reference: https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition

---

## #17, RSS / Atom feed for `/wc/papers`

**Labels:** `feature`, `nice-to-have`

**Body:**

Add `/wc/papers/feed.xml` (or `.atom`) so people can subscribe. Static generation: read the `PAPERS` array, emit the feed at build time. Once MDX is wired (BACKLOG #7), each paper has a date + title + summary that maps cleanly to feed entries.

---

## #18, Real WebSocket chat (promote `/og/chat`)

**Labels:** `feature`, `nice-to-have`

**Body:**

`/og/chat` is a local-only chat sandbox. Wire a Cloudflare Durable Object (or Workers KV) backend so messages persist + sync across users. Then promote out of `/og`:

1. Move `src/app/og/chat` to `src/app/chat`.
2. Drop `<DraftBanner />` and the local-only label.
3. Update MAP.md routes table.
4. Remove from `SKETCHES` in `src/app/og/page.tsx`.

---

## #19, Visitor guestbook on `/wc/about`

**Labels:** `feature`, `nice-to-have`

**Body:**

After #2 (build the about page), add a tiny KV-backed comment/guestbook box at the bottom. Cloudflare Workers KV is free at small scale. Moderation: simple word filter + manual review.

---

## #20, Custom domain

**Labels:** `infra`, `nice-to-have`

**Body:**

The site is currently on a `workers.dev` subdomain. Buy a custom domain (mythcorp.dev? mythcorp.app? wc.dev if available?) and point it at the Cloudflare Workers deployment. Configure in Cloudflare dashboard.

Bonus: set up `wc.<domain>` as an alias to `/wc/*` so the personal section has its own "subdomain" feel.

---

## #21, Cloudflare branch preview deploys

**Labels:** `infra`

**Body:**

Right now Cloudflare deploys only when `npm run deploy` is run manually. Configure Cloudflare Workers preview branch deploys so each PR gets its own URL. This makes mobile QA (BACKLOG #9) trivial: open the preview URL on a phone.

---

## #22, Cool-stuff sticky-note (low priority, future)

**Labels:** `nice-to-have`

**Body:**

Speculative ideas worth keeping around:

- **Reading log**: a `/wc/reads` page listing books / papers the author has been through, with a one-line take on each.
- **Page-level search** with Pagefind (works on static export, no backend).
- **Now-page** (à la sive.rs/now): what the author is currently working on, updated monthly.
- **3D scene presets** picker on /experience MainMenu (default / aurora / minimal / chaos).
- **Boot screen variety**: more loading shapes (helix, tunnel, particle storm) + per-theme variants (paper boot uses ink particles instead of cyan binary).
- **Spotify or Last.fm "now playing"** widget if the author has either.
- **GitHub contributions chart** auto-pulled to /wc/about.

---

## #23, Chomik: Digital Pet Hamster (standalone project or site feature)

**Labels:** `feature`, `fun`, `new-project`

**Body:**

A digital hamster (guinea pig? hamster? both?) that lives on the page and eats UI elements. Inspired by Desktop Goose, Shimeji, and the classic "neko" cat cursor chaser.

**Core concept:**
- A small animated sprite (pixel art or SVG) that roams around the viewport
- "Eats" UI elements it collides with: buttons, icons, nav items shrink/crumble/get chomped
- Gets fatter/happier as it eats more
- Poops little pellets after eating
- Falls asleep if idle, wakes up when the user interacts
- Has a small hunger meter; if not fed (no clicks/interaction) it starts nibbling on its own

**Scope options:**
1. **Site-wide overlay on mythcorp** -- toggled from a button in the footer or via easter egg (type "chomik"). Lives as a `<PetOverlay />` component that floats above all content with `pointer-events: none` except on the pet itself.
2. **Standalone GitHub repo** (`wchen17/chomik`) -- a tiny JS library anyone can drop onto a page. `<script src="chomik.js"></script>` and it just works. Has its own GitHub Pages demo site.
3. **Both** -- build standalone first, then embed it on mythcorp as a dependency.

**Technical approach (standalone):**
- Single `<canvas>` overlay, fixed position, full viewport
- Sprite sheet animation (walk, eat, sleep, poop, idle)
- Simple physics: gravity, ground = bottom of viewport, can climb on DOM elements
- DOM collision detection via `document.elementsFromPoint()` to find "edible" elements
- When eating: shrinks the target element with a CSS transition, plays chomp animation
- State machine: idle -> walking -> found-food -> eating -> satisfied -> walking -> sleepy -> sleeping
- Configurable: speed, appetite, which selectors are "edible", sprite theme

**For the GitHub Pages demo:**
- Landing page showing Chomik in action on a fake UI
- "Add to your site" instructions
- Configuration playground

---

## #24, Fake Terminal Overlay (press `/` anywhere)

**Labels:** `feature`, `easter-egg`

**Body:**

Press `/` anywhere on the site to open a translucent terminal overlay. It looks real but is purely cosmetic/fun -- no actual shell access.

**Behavior:**
- Slides down from top (or fades in) as a full-width panel, ~60% viewport height
- Monospace font, green-on-black or theme-appropriate (paper theme gets sepia terminal)
- Shows a fake prompt: `visitor@mythcorp ~ $`
- User can type anything. Responses are canned/funny:
  - `ls` -> lists the site routes
  - `cd /experience` -> actually navigates there
  - `whoami` -> "a curious visitor"
  - `sudo rm -rf /` -> "nice try. chomik has been alerted."
  - `help` -> lists available fake commands
  - `cat README` -> shows a short blurb about the site
  - `exit` or `Esc` -> closes the overlay
  - Anything else -> "command not found: <input>. try 'help'"
- History with up/down arrow keys
- Closes on `Esc` or clicking outside

**Implementation:**
- `src/app/components/TerminalOverlay.tsx` -- client component
- Mounted in the root layout, listens for `/` keydown (but not when an input is focused)
- Uses `useRouter()` for commands that navigate
- Store open/closed state in a context or simple useState in layout
- Theme-aware: cyberpunk gets green phosphor glow, luxury gets amber, paper gets typewriter feel

---

## #25, Fix /animals GIF content (quick)

**Labels:** `bug`, `content`

**Body:**

The Giphy URLs on `/animals` all return HTTP 200 but the GIF IDs were never verified to match their titles. "Happy Guinea Pig Munching Lettuce" probably shows something random. Fix:

1. Go to giphy.com, search for real guinea pig / hamster / bunny eating GIFs
2. Replace the 5 URLs with verified, correct ones
3. Or better: self-host 5-8 short `.webm` clips in `public/animals/` for reliability (no Giphy dependency, no hotlink breakage)
4. Consider adding more variety (10-15 clips) and a "favorites" localStorage feature

---

## #26, Comprehensive Simulator Upgrades

**Labels:** `feature`, `3d`

**Body:**

The `/experience` 3D scene is polished but could go deeper. Ideas for a "v2" pass:

**Scene presets:**
- Named presets on MainMenu: "Aurora" (greens/purples, slow drift), "Minimal" (white, few stars, no bloom), "Chaos" (max particles, fast rotation, strobing), "Deep Space" (dark blue, dense stars, no model)
- Save/load custom presets to localStorage
- Share presets via URL params (`/experience?preset=aurora`)

**New elements:**
- Audio-reactive mode: connects to mic or plays a built-in ambient track, particles pulse to frequency
- Environment options: nebula backdrop, grid floor, fog
- More models: allow switching between spectre.glb and 2-3 other models (geometric shapes, user's own upload via drag-and-drop)
- Particle behaviors: flocking, orbiting, exploding on click, trailing the cursor in 3D

**Controls polish:**
- Keyboard shortcuts (R = randomize, Space = pause rotation, 1-4 = presets)
- Screenshot button (exports canvas to PNG)
- Fullscreen toggle
- FPS counter (toggleable)

**Performance:**
- Auto-detect GPU tier and default to appropriate preset
- Progressive enhancement: start minimal, add bloom/particles as frame budget allows

---

## #27, GitHub Profile Page (wchen17.github.io)

**Labels:** `new-project`, `nice-to-have`

**Body:**

A personal GitHub Pages site at `wchen17.github.io` that serves as a landing/portfolio page. Could be:

1. **Minimal redirect** -- just points to mythcorp.org with a cool loading animation
2. **Standalone portfolio** -- separate from mythcorp, more professional/resume-oriented
3. **Project showcase** -- cards linking to repos (mythcorp, chomik, papers, etc.) with live previews

**If standalone:**
- Static HTML/CSS or a tiny Astro/Vite build
- Dark theme, terminal-inspired aesthetic
- Sections: intro, projects (with screenshots/demos), papers, contact
- GitHub contribution graph pulled via API
- Links to mythcorp.org for the full experience

**Repo:** `wchen17/wchen17.github.io` (or `wchen17/wchen17` for the profile README that shows on your GitHub profile page)

---

## #28, Site-wide Command Palette (Cmd+K / Ctrl+K)

**Labels:** `feature`, `nice-to-have`

**Body:**

In addition to (or instead of) the `/` terminal, a modern command palette like VS Code / Linear / Raycast:

- `Cmd+K` or `Ctrl+K` opens a search modal
- Fuzzy-matches all routes, actions, and theme options
- Items: "Go to /fmhy", "Go to /experience", "Switch to cyberpunk theme", "Open terminal", "Randomize simulation"
- Recent items shown by default
- Keyboard navigable (arrow keys + Enter)

Lighter than the terminal overlay, more "productivity tool" than "easter egg."
