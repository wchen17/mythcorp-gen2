'use client';

import { Section, Code, Aside } from '../_components/Walkthrough';

/**
 * The Canvas UI half of the plain-mode walkthrough. Split out because the page
 * was climbing past the 250-line file cap.
 */
export function CanvasUiSections() {
  return (
    <>
      <Section title="Borrowing someone else's shaders">
        <p>
          The effect picker on the holding screen runs{' '}
          <a
            href="https://canvasui.dev"
            className="text-[color:var(--accent)] underline underline-offset-4"
            target="_blank"
            rel="noreferrer noopener"
          >
            Canvas UI
          </a>
          , a library whose premise is worth stating plainly: it reads your live
          DOM and redraws it inside a canvas, so a shader can run over real text
          that is still selectable and real links that are still clickable.
        </p>
        <p>
          It is not an npm dependency. Components ship as source through a
          shadcn registry, so each one arrives as a single self-contained file
          and <code className="font-mono">package.json</code> never changes.
          That is the whole install:
        </p>
        <Code>{`npx shadcn@latest add https://canvasui.dev/r/glyph-rain-react.json

# or just read files[0].content out of that JSON
# and write it yourself, which is what happened here`}</Code>
        <Aside>
          Three of the six (DecryptReveal, RetroDither, ForceField) import a{' '}
          <code className="font-mono">rect-cache</code> helper that no registry
          entry ships and that is not in the registry index, so installing them
          straight does not compile. It is 26 lines in the upstream repo at{' '}
          <code className="font-mono">src/lib/rect-cache.ts</code>, copied in by
          hand. Worth re-checking before updating them.
        </Aside>
      </Section>

      <Section title="The caveat that shapes the design">
        <p>
          The html-in-canvas API is an experimental Chrome feature behind{' '}
          <code className="font-mono">chrome://flags/#canvas-draw-element</code>.
          Every component probes for it and degrades honestly: without it the
          children render as ordinary HTML and whatever part of the effect does
          not need to sample the page still runs.
        </p>
        <p>
          So the effects split into two groups, and the design has to respect
          the split rather than hope for the flag. <em>Rain</em> and{' '}
          <em>shield</em> draw their own geometry and work for everyone. {' '}
          <em>Asciify</em>, <em>decrypt</em>, <em>dither</em> and{' '}
          <em>glitch</em> resample the page, so for most visitors they are
          inert. The picker runs the same probe the components do and stars the
          ones that will not do anything, instead of offering four dead
          buttons.
        </p>
        <p>
          This is exactly why the wordmark is not one of them. The theme&rsquo;s
          own ASCII field is plain 2D canvas with no feature gate, so{' '}
          <em>work in progress</em> renders for every visitor on every browser,
          and Canvas UI is the layer on top that gets better if your browser can
          take it.
        </p>
      </Section>

      <Section title="Six effects, none of them in the bundle">
        <p>
          Each component is tens of kilobytes of WebGL. Six of them imported
          normally would land in the shared chunk and be paid for by every
          visitor to every page, including the three themes that never show
          them. They are dynamic imports instead, so the holding screen ships
          none of them until you pick one.
        </p>
        <Code>{`const GlyphRain = dynamic(
  () => import('../canvasui/GlyphRain').then((m) => m.GlyphRain),
  { ssr: false },   // must be an inline literal
);`}</Code>
        <p>
          The options object has to be written inline.{' '}
          <code className="font-mono">next/dynamic</code> reads it at compile
          time, so hoisting <code className="font-mono">{'{ ssr: false }'}</code>{' '}
          into a shared constant fails the build with{' '}
          <code className="font-mono">
            next/dynamic options must be an object literal
          </code>
          . <code className="font-mono">ssr: false</code> is not optional here:
          all six reach for a canvas on mount.
        </p>
        <p>
          Every option passed to them exists to drag the component back to
          monochrome. The library ships blue and neon by default, which is the
          one thing this theme cannot have.
        </p>
      </Section>
    </>
  );
}
