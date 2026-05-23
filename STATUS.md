# STATUS

A short note for whoever (you, me, future-Claude on a different machine) picks this up next. Update at the end of each session.

## Last updated
2026-05-23, branch `claude/cloudflare-fmhy-backup-fixes-byAoX`.

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

## What shipped (PR 1: FMHY mirror)

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
