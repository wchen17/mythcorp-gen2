# MYTHCORP

A small, hand-crafted personal site by Will (Weibao) Chen. Themed cinematic
landing, a 3D experience scene, a `/wc` workshop with annotated walkthroughs and
an interactive paper, plus an `/og` workshop floor for sketches and a `/fmhy`
local mirror.

## Agents start here

If you (a Claude instance, on a phone via [claude.ai/code](https://claude.ai/code)
or locally via the CLI) are picking this up, read these in order:

1. [NEXT_SESSION.md](./NEXT_SESSION.md), the cold-start handoff.
2. [STATUS.md](./STATUS.md), what shipped most recently and what's next.
3. [MAP.md](./MAP.md), the file index.
4. [CLAUDE.md](./CLAUDE.md), conventions. The headline rule: **no em-dashes anywhere**.
5. [BACKLOG.md](./BACKLOG.md), queued issues. Same content lives at
   [github.com/onionviolet/mythcorp-gen2/issues](https://github.com/onionviolet/mythcorp-gen2/issues).

That's under five minutes to be fully oriented.

### Hard rules

- **No em-dashes.** Code, copy, comments, commits, markdown. Use commas, periods,
  semicolons, parentheses, or restructure. Project memory enforces this.
- **Push to a branch, not main.** Cloudflare may auto-deploy on push to main.
  Open a PR with `gh pr create --base main`.
- **`npm run check` must stay green** before any commit.

## Stack

Next.js 15 (app router), React 19, TypeScript, Tailwind v4. 3D via
`@react-three/fiber` / drei / postprocessing. Animation via GSAP. Deployed to
Cloudflare Workers via `@opennextjs/cloudflare`.

## Dev

```bash
npm install
npm run dev          # local dev server
npm run check        # build + tsc, must stay green
npm run preview      # Cloudflare Workers simulated build
npm run deploy       # cloudflare workers deploy
npm run fetch:fmhy   # refresh the FMHY catalog snapshot
```

The repo includes a 24-category FMHY mirror at `/fmhy`, with per-category
deep-dive routes at `/fmhy/<category>`. The catalog is a build-time snapshot of
[github.com/fmhy/edit](https://github.com/fmhy/edit), refreshed by running
`npm run fetch:fmhy` and committing the diff.

## CI

GitHub Actions in [.github/workflows/](./.github/workflows/) runs `npm run check`
on every push and PR. A weekly cron opens a PR with the refreshed FMHY snapshot.

## License

This repo is the source of [mythcorp.org](https://mythcorp.org) and is intentionally
public so the build can be picked up from any device. Code is unlicensed for reuse;
content (essays, paper text, designs) is the author's.
