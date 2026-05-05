# BACKLOG

Pre-formatted issues, ready to paste into GitHub Issues (or batch-create via `gh issue create` once `gh` is installed: `winget install GitHub.cli`, then `gh auth login`, then run `tools/create-backlog-issues.ps1` if/when that script exists).

Each item is independent. Pick any.

---

## #1 — Walkthrough: `/will/learn/landing-flow`

**Labels:** `walkthrough`, `next-up`

**Body:**

Write the second annotated walkthrough at `src/app/will/learn/landing-flow/page.tsx`, explaining how the cinematic boot works:

- `LoadingScreen` (`src/app/components/LoadingScreen.tsx`) — cyberpunk 3D binary digit shape.
- `LandingPage` (`src/app/components/LandingPage.tsx`) — 3D MYTHCORP logo + spectre model, GSAP timeline on exit.
- `NewLandingPage` (`src/app/components/NewLandingPage.tsx`) — the luxury Chicago-skyline reveal.
- The handoff: `useGLTF.preload('/spectre.glb')` at module top so the model is fetched once for the whole session, plus `<color attach="background" args={['#0a0a0a']} />` to kill the boot→landing colour flash.

Use the `Walkthrough`/`Section`/`Code`/`Aside` helpers from `src/app/will/learn/_components/Walkthrough.tsx`. Add `landing-flow` to the `WALKTHROUGHS` array in `src/app/will/learn/page.tsx` and flip its `status` from `soon` to `ready`.

---

## #2 — Walkthrough: `/will/learn/3d-scene`

**Labels:** `walkthrough`, `next-up`

**Body:**

Write the third walkthrough at `src/app/will/learn/3d-scene/page.tsx`. Subject: the anatomy of `src/app/experience/Simulation.tsx`. Cover:

- `<Canvas>` + R3F basics
- `ParticleField` — `BufferGeometry` + `Float32Array` for vertex positions and colours
- `Stars` count clamped at `MAX_STARS = 12000` with `STARS_PER_UNIT = 1200` (and *why* — the original `5000 * settings.stars` could hit 25k particles)
- `Bloom` post-processing tuning (`luminanceThreshold`, `mipmapBlur`)
- The randomisable `DEFAULTS` settings object and `getRandomSettings()`

Same pattern as the theme-system walkthrough. Embed a small live demo if it doesn't blow the bundle.

---

## #3 — Wire MDX for `/will/papers`

**Labels:** `paper`, `next-up`

**Body:**

Right now `src/app/will/papers/page.tsx` renders from a hard-coded array. To make papers easy to write, wire MDX:

- `npm install @next/mdx @mdx-js/react remark-gfm rehype-pretty-code shiki`
- Update `next.config.ts` with `pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']` and the `withMDX` wrapper.
- Create `src/app/will/papers/mdx-components.tsx` exporting custom `<Figure>`, `<Aside>`, `<Sandbox>` components so embedded React/3D demos are easy.
- Verify it builds on Cloudflare Workers (`npm run preview`) before merging — past us has been bitten by Node-only MDX plugins on the edge runtime.

---

## #4 — Camera FOV bridge between LandingPage and Simulation

**Labels:** `polish`, `3d`

**Body:**

`src/app/components/LandingPage.tsx` uses `<PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />`. `src/app/experience/Simulation.tsx` uses `fov={60}`. Route changes therefore feel like a small zoom snap.

Two options:

1. Pick one fov and use it everywhere (probably 55).
2. GSAP-tween fov across the route change with a transition layer — fancier but a bigger lift.

Either is fine. The cheap version (option 1) is one line in two files.

---

## #5 — Subset `Inter_Bold.json`

**Labels:** `polish`, `performance`

**Body:**

`public/fonts/Inter_Bold.json` is 5.2MB but `<Text3D>` only renders the word "MYTHCORP". Use `facetype.js` or similar to subset to just those characters and drop ~5MB off boot.

`src/app/components/LandingPage.tsx` is the only consumer.

---

## #6 — Flesh out `/about` content

**Labels:** `content`

**Body:**

`src/app/about/page.tsx` is short and warm but light on substance. Once the project has more shipped pieces (a few walkthroughs, the first paper draft), add a small "what I built and why" timeline.

---

## #7 — Pioneer Scholars paper draft at `/will/papers/ai-cybercrime`

**Labels:** `paper`

**Body:**

The actual content for the original Pioneer Scholars paper on AI's effect on a layman's cybercrime capability. Long-term, expand and post as an arXiv preprint when it stabilises.

Depends on **#3** (wire MDX) so the paper can be authored as a single `.mdx` file with embedded demos.

---

## #8 — Promote a sketch out of `/og/`

**Labels:** `housekeeping`

**Body:**

When one of `/og/chat`, `/og/fmhy`, `/og/interactive` matures into something real:

1. Move the folder up: e.g., `src/app/og/chat` → `src/app/chat`.
2. Drop `<DraftBanner />` from the page.
3. Remove the entry from `SKETCHES` in `src/app/og/page.tsx`.
4. Add it to MAP.md's routes table.

See MAP.md "How to add X" for the full recipe.

---

## #9 — Maybe: a one-page "deploy preview" Cloudflare branch hook

**Labels:** `infra`

**Body:**

Right now Cloudflare deploys only when `npm run deploy` is run manually. If you want PRs to spin up preview URLs automatically, configure a Cloudflare Pages / Workers preview branch deploy. Out of scope for the refresh, but worth noting.
