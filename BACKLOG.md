# BACKLOG

Pre-formatted issues, ready to paste into GitHub Issues (or batch-create via `gh issue create` once `gh` is installed: `winget install GitHub.cli`, then `gh auth login`).

Each item is independent. Pick any.

---

## #1, Real FMHY backup at `/fmhy` (or `/og/fmhy` promoted)

**Labels:** `feature`, `next-up`

**Body:**

The original intent of `/fmhy` was a self-hosted backup of [r/freemediaheckyeah](https://fmhy.net/). Right now the page is a UI shell with placeholder data. To make it real:

- The FMHY content is open source on GitHub: https://github.com/fmhy/edit (markdown wiki) and the self-hosting guide is at https://fmhy.net/other/selfhosting.
- Two viable approaches:
  1. **Static fetch**: pull the markdown from the GitHub repo at build time, parse into the same `ContentItem` shape, render with the existing UI.
  2. **Iframe / mirror**: embed an existing FMHY mirror inside the page with a thin chrome.
- Option 1 is more work but means the page is genuinely useful and theme-aware.
- When ready, promote `/og/fmhy` out of `/og/` (see MAP.md "How to add X") and rename to `/fmhy`.

---

## #2, Walkthrough: `/will/learn/landing-flow`

**Labels:** `walkthrough`, `next-up`

**Body:**

Write the second annotated walkthrough at `src/app/will/learn/landing-flow/page.tsx`, explaining:

- `LoadingScreen` (cyberpunk binary digit shape) at `src/app/components/LoadingScreen.tsx`.
- `LandingPage` (3D MYTHCORP logo + spectre model) at `src/app/components/LandingPage.tsx`.
- `NewLandingPage` (luxury Chicago skyline reveal) at `src/app/components/NewLandingPage.tsx`.
- The handoff: `useGLTF.preload('/spectre.glb')` at module top so the model is fetched once for the session, plus the mutually-exclusive Canvas mounting in `AppLoader` (only one `<Canvas>` alive at a time, otherwise R3F crashes under StrictMode).
- The session-storage skip: the boot only runs on first visit per session; refreshes within the session jump straight to the landing.

Use the `Walkthrough`/`Section`/`Code`/`Aside` helpers from `src/app/will/learn/_components/Walkthrough.tsx`. Add `landing-flow` to `WALKTHROUGHS` in `src/app/will/learn/page.tsx` and flip its `status` from `soon` to `ready`.

---

## #3, Walkthrough: `/will/learn/3d-scene`

**Labels:** `walkthrough`, `next-up`

**Body:**

Write the third walkthrough at `src/app/will/learn/3d-scene/page.tsx`. Subject: anatomy of `src/app/experience/Simulation.tsx`. Cover:

- `<Canvas>` + R3F basics
- `ParticleField`: `BufferGeometry` + `Float32Array` for vertex positions and colours
- `Stars` count clamped at `MAX_STARS = 12000` with `STARS_PER_UNIT = 1200` (and *why*: the original `5000 * settings.stars` could hit 25k particles)
- `Bloom` post-processing tuning (`luminanceThreshold`, `mipmapBlur`)
- The randomisable `DEFAULTS` settings object and `getRandomSettings()`

---

## #4, Wire MDX for `/will/papers`

**Labels:** `paper`, `infra`

**Body:**

Right now `src/app/will/papers/page.tsx` renders from a hard-coded array. To make papers easy to write:

- `npm install @next/mdx @mdx-js/react remark-gfm rehype-pretty-code shiki`
- Update `next.config.ts` with `pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']` and the `withMDX` wrapper.
- Create `src/app/will/papers/mdx-components.tsx` exporting custom `<Figure>`, `<Aside>`, `<Sandbox>` so embedded React/3D demos are easy.
- Verify it builds on Cloudflare Workers (`npm run preview`) before merging. Past us has been bitten by Node-only MDX plugins on the edge runtime.

---

## #5, Theme overhaul Tier 2: full design-language swap

**Labels:** `design`, `feature`

**Body:**

Today the theme system swaps colours and fonts. The intent is bigger: each theme should change the whole *design language*. Concrete next moves:

- Add `--surface-style: glass | matte | paper` and `--radius` and `--shadow-style` tokens.
- Build component variants that read those tokens. Examples:
  - `glass` (luxury): backdrop-blur, soft inner glow, rounded corners, no hard borders.
  - `matte` (cyberpunk): sharp 1px borders, neon stroke, no blur, terminal vibe.
  - `paper` (writing): warm textured background, serif body, drop-cap support, no shadows, ink-like accent.
- Maybe theme-swap also changes the cursor, typography weights, motion easing.
- Consider `view-transition-name` for cross-fade between themes that animates more than just colour.

This is bigger than current Tier 1 but doable incrementally: start by giving 2 components the surface-variant treatment, see how it lands, then propagate.

---

## #6, More entry loading screens, picker

**Labels:** `feature`, `polish`

**Body:**

`LoadingScreen` already randomises between sphere/cube/torus shapes. Push further:

- Add more shapes: tetrahedron, helix, tunnel, particle storm.
- Optional "loading screen mood" picker in settings (lets user pick which mood the boot uses).
- Theme-aware: if the user has `paper` theme, the boot screen should match (cream, soft serif, ink particles instead of cyberpunk binary).

---

## #7, Camera FOV bridge (LandingPage to Simulation)

**Labels:** `polish`, `3d`

**Body:**

`src/app/components/LandingPage.tsx` uses `fov={50}`. `src/app/experience/Simulation.tsx` uses `fov={60}`. Route changes feel like a small zoom snap.

Two options:
1. Pick one fov and use it everywhere (probably 55).
2. GSAP-tween fov across the route change with a transition layer (fancier, bigger lift).

Option 1 is one line in two files.

---

## #8, Subset `Inter_Bold.json`

**Labels:** `polish`, `performance`

**Body:**

`public/fonts/Inter_Bold.json` is 5.2MB but `<Text3D>` only renders the word "MYTHCORP". Use `facetype.js` or similar to subset to just those characters and shave ~5MB off boot. Only `src/app/components/LandingPage.tsx` consumes it.

---

## #9, Better `/about` content

**Labels:** `content`

**Body:**

`src/app/about/page.tsx` is short and warm but light on substance. Once the project has more shipped pieces, add a small "what I built and why" timeline.

---

## #10, Pioneer Scholars paper draft at `/will/papers/ai-cybercrime`

**Labels:** `paper`

**Body:**

The actual content for the original Pioneer Scholars paper on AI's effect on a layman's cybercrime capability. Long-term, expand and post as an arXiv preprint when it stabilises. Depends on **#4** (wire MDX).

---

## #11, Promote a sketch out of `/og/`

**Labels:** `housekeeping`

**Body:**

When one of `/og/chat`, `/og/fmhy`, `/og/interactive` matures into something real:

1. Move the folder up: e.g. `src/app/og/chat` to `src/app/chat`.
2. Drop `<DraftBanner />` from the page.
3. Remove the entry from `SKETCHES` in `src/app/og/page.tsx`.
4. Add it to MAP.md's routes table.

See MAP.md "How to add X" for the full recipe.

---

## #12, Cloudflare branch preview deploys

**Labels:** `infra`

**Body:**

Right now Cloudflare deploys only when `npm run deploy` is run manually. If you want PRs to spin up preview URLs automatically, configure a Cloudflare Pages / Workers preview branch deploy. Out of scope for the refresh, but worth noting.

---

## #13, Cool stuff to maybe add eventually

**Labels:** `nice-to-have`

**Body:**

Speculative ideas worth keeping on a sticky note:

- **Time-of-day auto theme**: cyberpunk after dark, paper during the day, luxury at golden hour.
- **Reading log**: a `/will/reads` page listing books / papers the author has been through.
- **Custom domain**: `mythcorp.dev` or similar instead of the workers.dev preview URL.
- **Page-level search** with Pagefind or similar (works on static export).
- **RSS / Atom feed** for `/will/papers` (so people can subscribe).
- **View Transitions API** for smooth route changes once Next.js has stable support.
- **Real WebSocket chat** (promotes `/og/chat` to `/chat`).
- **Visitor guestbook**: tiny KV-backed comment box at `/will/about`.
- **Konami code easter egg**: drops a 3D toy.
- **Mobile-friendly 3D experience**: current scene targets desktop GPUs; mobile fallback would be nice.
- **Accessibility pass**: `prefers-reduced-motion` is honoured for theme transitions but not for the 3D scene yet.
