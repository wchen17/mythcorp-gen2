'use client';

import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';
import { useTheme } from '../../../contexts/ThemeContext';

export default function PlainModeWalkthrough() {
  const { theme, setTheme } = useTheme();

  return (
    <Walkthrough
      eyebrow="[ /wc/learn/plain-mode ]"
      title="Plain mode, and the field underneath it"
      intro={
        <>
          The fourth theme takes everything away. No colour, no radius, no
          shadow, no transition, one typeface and it is the monospace one.
          Then it puts back exactly one thing: a field of characters that
          the cursor pushes around, simulated live in a 2D canvas. Plain
          everywhere the browser can style it, and computed everywhere it
          cannot.
        </>
      }
    >
      <Section title="Try it here">
        <p>
          Switch to plain and move the cursor across this page. The glyphs
          behind the text are not a video and not a loop, they are the
          current state of a fluid field that your pointer is stirring.
        </p>
        <button
          type="button"
          onClick={() => setTheme(theme === 'plain' ? 'cyberpunk' : 'plain')}
          className="themed-button px-4 py-2 text-sm"
        >
          {theme === 'plain' ? 'Back to cyberpunk' : 'Switch to plain'}
        </button>
      </Section>

      <Section title="Why a theme can carry a simulation">
        <p>
          The theme system is two tiers of CSS variables, so a theme already
          owns more than a palette, it owns radius, shadow, easing and font.
          Plain sets every one of those to its null value. That leaves the
          page with nothing to look at, which is the point: the ornament has
          to come from somewhere CSS cannot reach, and a canvas is the
          cheapest somewhere.
        </p>
        <Code>{`[data-theme="plain"] {
  --radius: 0px;
  --surface-shadow: none;
  --motion-base: 0ms;
  --font-body: var(--font-geist-mono);
  --plain-ink: #111111;   /* read back out by the canvas */
}`}</Code>
        <p>
          <code className="font-mono">--plain-ink</code> is the seam. CSS
          owns the colour, JavaScript reads it with{' '}
          <code className="font-mono">getPropertyValue</code> and hands it to
          the canvas, so the field stays inside the theme contract instead of
          hard-coding a hex.
        </p>
      </Section>

      <Section title="What the simulation actually does">
        <p>
          A real fluid solver is four passes: advection, divergence, a
          pressure solve, then curl. The pressure solve is an iterative
          Poisson step and it is most of the cost. This one skips it.
        </p>
        <p>
          What is left is semi-Lagrangian advection, which asks a different
          question than you might expect. Instead of pushing each cell
          forward along its velocity, it looks <em>backwards</em>: for cell
          (x, y), where was this stuff one step ago? Sample there, bilinearly,
          and that is the new value. Tracing backwards is what makes it
          unconditionally stable, because you can only ever read values that
          already exist, so nothing can blow up no matter how large the
          velocity gets.
        </p>
        <Code>{`const sx = x - vx[i];
const sy = y - vy[i];
dyeNext[i] = sample(dye, sx, sy) * decay;
vxNext[i]  = sample(vx,  sx, sy) * decay;`}</Code>
        <p>
          A four-neighbour blur afterwards stands in for viscosity, and a
          per-frame decay below 1 means the field always settles back to
          empty. The velocity field advects itself, which is where the
          curling comes from, and it is the one nonlinear thing here.
        </p>
        <Aside>
          Dropping the pressure solve means the field is not incompressible,
          so it does not conserve volume the way water does. It smears and
          curls, which is all the eye needs at eleven pixels per cell.
        </Aside>
      </Section>

      <Section title="From a float field to characters">
        <p>
          Rendering is a luminance quantizer, the same trick an ASCII-art
          filter uses. Each cell holds a dye value between 0 and about 1.4,
          which indexes into a ramp ordered by ink coverage.
        </p>
        <Code>{`const ramp = ' .:-=+*#%@';
const level = Math.min(last, Math.floor(v * last) + 1);
ctx.globalAlpha = Math.min(0.85, 0.18 + v * 0.7);
ctx.fillText(ramp[level], x * cell, y * cell * 1.6);`}</Code>
        <p>
          The ramp is doing the work a gradient would do in a shader, and
          alpha on top of it buys back the resolution the ten-step ramp
          throws away. Cells under 0.045 are skipped entirely, so an idle
          page draws almost nothing.
        </p>
      </Section>

      <Section title="The parts that are not the fun part">
        <p>
          Three guards keep this from being a battery complaint.{' '}
          <code className="font-mono">prefers-reduced-motion</code> stops the
          component mounting at all. A{' '}
          <code className="font-mono">visibilitychange</code> listener stops
          the loop on a hidden tab rather than letting a throttled
          requestAnimationFrame integrate junk timesteps. And the whole
          component returns null on every theme that is not plain, so the
          other three pay nothing but one context read.
        </p>
        <p>
          One canvas detail worth keeping:{' '}
          <code className="font-mono">ctx.font</code> does not resolve CSS
          custom properties. Handing it{' '}
          <code className="font-mono">var(--font-mono)</code> silently falls
          back to the default sans. The fix is to read the family the element
          computed to and pass the real stack.
        </p>
      </Section>

      <Section title="Files">
        <ul className="list-disc space-y-1 pl-5">
          <li><code className="font-mono">src/app/components/plain/asciiFluid.ts</code>, the solver and renderer, no React in it</li>
          <li><code className="font-mono">src/app/components/plain/PlainField.tsx</code>, mount, pointer wiring, teardown</li>
          <li><code className="font-mono">src/app/globals.css</code>, the plain token block and its surface overrides</li>
        </ul>
      </Section>
    </Walkthrough>
  );
}
