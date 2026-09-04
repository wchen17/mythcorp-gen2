# canvasui, vendored

Third-party source from **Canvas UI** (github.com/DavidHDev/canvas-ui, canvasui.dev).
License: MIT + Commons Clause. Free in personal and commercial projects; the
clause only forbids selling the library itself. Nothing here is a runtime
dependency: Canvas UI ships components as source through a shadcn registry, so
`package.json` is untouched and each file is self-contained with zero imports
beyond React.

## Do not hand-edit

These files are regenerated, not maintained. To update or add one:

```
npx shadcn@latest add https://canvasui.dev/r/<name>-react.json
```

or fetch `https://canvasui.dev/r/<name>-react.json` and write the single file
in `files[0].content` here. The registry entry names the target path itself.

## What is vendored

| File | Registry entry | Effect |
|---|---|---|
| `Asciify.tsx` | `asciify-react` | ASCII lens that follows the cursor |
| `DecryptReveal.tsx` | `decrypt-reveal-react` | Page as cipher text, decodes around the cursor |
| `GlyphRain.tsx` | `glyph-rain-react` | Falling glyph streams that light the page |
| `RetroDither.tsx` | `retro-dither-react` | Pixelate and quantize lens |
| `ForceField.tsx` | `force-field-react` | Charged lattice over the content |
| `Glitch.tsx` | `glitch-react` | Periodic tear and RGB split bursts |

The full catalogue is ~40 components. Adding another is one command.

## One registry gap, patched by hand

`DecryptReveal`, `RetroDither` and `ForceField` all `import { createRectCache }
from "../rect-cache"`, but no registry entry ships that file and there is no
`rect-cache` item in `https://canvasui.dev/r/registry.json`. Installing any of
the three straight from the registry therefore does not compile. The helper is
26 lines of cached `getBoundingClientRect`, taken from the upstream repo at
`src/lib/rect-cache.ts` and written to `../rect-cache.ts` to match the import.
Re-check whether the registry ships it before updating those three.

## The browser caveat, which matters

The flagship trick is the **html-in-canvas** API: the component reads your live
DOM and redraws it, so text stays selectable and links stay clickable while a
shader runs over them. That API is an experimental Chrome feature behind
`chrome://flags/#canvas-draw-element`, or an origin trial token.

Every component detects support at runtime via its own `supportsHtmlInCanvas()`
and degrades: the children render as ordinary HTML and whatever part of the
effect does not need to sample the page still runs. In practice:

- **GlyphRain** works for everyone. The rain is its own WebGL canvas; only the
  light it casts *onto* the page needs the API.
- **Asciify, DecryptReveal, RetroDither** need the API for their real effect,
  because all three resample the page itself. Without it they are inert and the
  content shows through unchanged.

So do not build a layout that only reads correctly with the flag on. The plain
theme's own ASCII field (`../plain/asciiFluid.ts`) is plain 2D canvas and runs
everywhere, which is why it carries the wordmark rather than one of these.

## Repo conventions

The 250-line file cap in CLAUDE.md does not apply to this folder. These are
vendored build artifacts, not code we maintain.
