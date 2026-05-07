# Repo Map

Single-screen index of where things live. Read this first; grep second.

## Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Cinematic boot: LoadingScreen → LandingPage → NewLandingPage |
| `/experience` | `src/app/experience/page.tsx` | 3D simulation lab (menu + Simulation) |
| `/animals` | `src/app/animals/page.tsx` | Random animal GIFs (palate cleanser) |
| `/about` | `src/app/about/page.tsx` | Short "what is this" page |
| `/contact` | `src/app/contact/page.tsx` | ComingSoon stub (no real form yet) |
| `/wc` | `src/app/wc/page.tsx` | Personal section index |
| `/wc/papers` | `src/app/wc/papers/page.tsx` | Long-form / paper list (placeholder) |
| `/wc/learn` | `src/app/wc/learn/page.tsx` | Walkthroughs index |
| `/wc/learn/theme-system` | `src/app/wc/learn/theme-system/page.tsx` | First annotated walkthrough |
| `/fmhy` | `src/app/fmhy/page.tsx` | FMHY backup: category links + live iframe with fallback |
| `/og` | `src/app/og/page.tsx` | "Back-room sketches" index |
| `/og/interactive` | `src/app/og/interactive/page.tsx` | CSS-only isometric WIP type |
| `/chat` | `src/app/chat/page.tsx` | Global chat backed by `ChatRoom` Durable Object |
| 404 | `src/app/not-found.tsx` | Whimsical 404 |

`/og/*` houses unfinished ideas kept on purpose, labelled with `<DraftBanner />`. The `/og` index also lists graduated sketches (e.g. `/fmhy` used to live at `/og/fmhy` before getting a real implementation).

## Shared components

| File | Used by |
|---|---|
| `src/app/components/SiteHeader.tsx` | Every page header, single source of truth |
| `src/app/components/ThemeSwitcher.tsx` | SiteHeader + ThemeSystem walkthrough |
| `src/app/components/Modal.tsx` | LandingModals + any future modal needs |
| `src/app/components/ComingSoon.tsx` | `/contact` and any future stub route |
| `src/app/components/HelpDot.tsx` | Mounted globally in `layout.tsx`, floating "?" |
| `src/app/components/DraftBanner.tsx` | Used by `/og/*` pages to flag "this is a sketch" |
| `src/app/components/landing/SkylineBackdrop.tsx` | NewLandingPage + experience MainMenu |
| `src/app/components/landing/HeroTitle.tsx` | NewLandingPage |
| `src/app/components/landing/EnterBanner.tsx` | NewLandingPage |
| `src/app/components/landing/LandingModals.tsx` | NewLandingPage |
| `src/app/components/LoadingScreen.tsx` | Boot sequence (page.tsx) |
| `src/app/components/LandingPage.tsx` | 3D MYTHCORP title card (page.tsx) |
| `src/app/components/NewLandingPage.tsx` | The luxury reveal (page.tsx) |
| `src/app/wc/learn/_components/Walkthrough.tsx` | Layout + helpers for `/wc/learn/*` pages |

## 3D scene

| File | Notes |
|---|---|
| `src/app/experience/Simulation.tsx` | Main scene. `useGLTF.preload('/spectre.glb')` at top. Stars capped at `MAX_STARS = 12000`. |
| `src/app/experience/MainMenu.tsx` | Entry card before Simulation |

`spectre.glb` is preloaded in two places: `LandingPage.tsx` and `Simulation.tsx`. Both use the same drei cache, so the actual fetch only happens once per session.

## Theme system

Four files. All other components consume tokens via `var(--name)`.

| File | Role |
|---|---|
| `src/app/globals.css` | Token definitions for `cyberpunk`, `luxury`, `paper` |
| `src/app/contexts/ThemeContext.tsx` | Provider, hook, localStorage |
| `src/app/components/ThemeSwitcher.tsx` | UI |
| `src/app/layout.tsx` | Pre-paint bootstrap script (no flash) |

Walkthrough: `/wc/learn/theme-system`.

## Static assets

`public/`:
- `spectre.glb` (1.2MB), main 3D model
- `chicagoskyline.jpg`, landing backdrop
- `heli.jpg`, Simulation helicopter image
- `fonts/Inter_Bold.json` (5.2MB), for `<Text3D>`. Preloaded in `layout.tsx`.
- `*.svg` icons (Next.js defaults, mostly unused)

## How to add X

- **A new theme**: add `[data-theme="..."]` block in `globals.css`, append to `THEMES` in `ThemeContext.tsx`, update validator in `layout.tsx` bootstrap script.
- **A new walkthrough**: create `src/app/wc/learn/<slug>/page.tsx` using `Walkthrough` from `_components/`. Add to `WALKTHROUGHS` array in `src/app/wc/learn/page.tsx`.
- **A new paper**: add to `PAPERS` array in `src/app/wc/papers/page.tsx`. Create `src/app/wc/papers/<slug>/page.tsx` for the body.
- **A new stub page**: use `<ComingSoon>` from `src/app/components/ComingSoon.tsx`.
- **A new back-room sketch** (rough idea you want to keep): create `src/app/og/<slug>/page.tsx`, mount `<SiteHeader />` and `<DraftBanner />`, then add it to `SKETCHES` in `src/app/og/page.tsx`.
- **Promote a sketch out of `/og/`**: move the folder up (e.g. `src/app/og/chat` → `src/app/chat`), remove `<DraftBanner />`, drop it from `/og/page.tsx`'s `SKETCHES`, add to MAP.md routes table.
- **A new themed page**: add `<SiteHeader />` at top, use `bg-[color:var(--bg)]` and `text-[color:var(--fg)]`. Done.

## Build / dev

```
npm run dev      # local dev server
npm run check    # build + tsc
npm run deploy   # cloudflare workers
```

Tech: Next.js 15 (app router), React 19, R3F, drei, postprocessing, GSAP, Tailwind v4. Deployed to Cloudflare Workers via `@opennextjs/cloudflare`.
