'use client';

import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';
import { CanvasUiSections } from './CanvasUiSections';
import { useTheme } from '../../../contexts/ThemeContext';

export default function PlainModeWalkthrough() {
  const { theme, setTheme } = useTheme();

  return (
    <Walkthrough
      eyebrow="[ /wc/learn/plain-mode ]"
      title="Plain mode, and the field underneath it"
      intro={
        <>
          The fourth theme takes everything away, and then keeps going. No
          colour, no radius, no shadow, no transition, one typeface and it is
          the monospace one. Then it removes the site: every route collapses
          to a holding screen, and only <code className="font-mono">/contact</code>{' '}
          survives. What is left is one canvas. The words{' '}
          <em>work in progress</em> are not text on that screen, they are dye
          in a fluid simulation, so you can push them around and watch them
          re-form.
        </>
      }
    >
      <Section title="Try it here">
        <p>
          Fair warning: this page is one of the ones plain mode hides. The
          button hands the whole screen over to the holding mode, and the way
          back is the small link in its bottom right. Move the cursor through
          the letters while you are there.
        </p>
        <button
          type="button"
          onClick={() => setTheme(theme === 'plain' ? 'cyberpunk' : 'plain')}
          className="themed-button px-4 py-2 text-sm"
        >
          {theme === 'plain' ? 'Back to cyberpunk' : 'Switch to plain'}
        </button>
      </Section>

      <Section title="A theme that hides the site">
        <p>
          Holding mode is one rule and one attribute. A route is held unless
          it is on a short allowlist, the pre-paint script writes{' '}
          <code className="font-mono">data-hold</code> to the root element
          before anything renders, and CSS does the rest.
        </p>
        <Code>{`export const PLAIN_OPEN_PREFIXES =
  ['/contact', '/upload', '/a', '/d', '/i'];

[data-hold="on"] #page-root { display: none !important; }`}</Code>
        <p>
          Display, not opacity. A cover you can still tab into and still read
          with a screen reader is a curtain, not a holding page. The content
          is out of the tree; the only DOM left is a wordmark, two links, and
          an <code className="font-mono">h1</code> that exists so crawlers and
          readers get the message the canvas is drawing.
        </p>
        <Aside>
          The pre-paint script matters more than it looks. React does not know
          the stored theme until an effect runs, so for one frame it would
          think the theme is the default and clear the attribute, flashing the
          real page. The provider now exposes a{' '}
          <code className="font-mono">ready</code> flag, and the holding screen
          refuses to touch the attribute until it flips.
        </Aside>
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

      <Section title="The wordmark is dye, not text">
        <p>
          The message is rendered to an offscreen canvas at four times the
          grid resolution, then box-averaged down to one value per cell. That
          downsample is the whole trick: it turns hard glyph edges into the
          grey levels the character ramp needs, so the letters arrive already
          anti-aliased into ASCII.
        </p>
        <p>
          The mask is then added to the dye field <em>every frame</em> rather
          than stamped once. Constant addition against constant decay settles
          at a fixed level:
        </p>
        <Code>{`steady state = gain / (1 - decay)
             = 0.016 / 0.015
             ~ 1.07   // just about full ink`}</Code>
        <p>
          So when you smear the letters, they heal back toward that level
          instead of blinking on again all at once. Two vortices drift on
          Lissajous paths whose periods share no common multiple, which keeps
          the field moving without ever repeating.
        </p>
      </Section>

      <Section title="Two bugs the fonts were hiding">
        <p>
          Building this surfaced two pre-existing faults, both about where a
          CSS custom property is <em>declared</em> rather than where it is
          used. A property resolves at its declaration site, and if a variable
          it references is undefined there, it computes to a value that is
          invalid and then inherits that invalidity downward.
        </p>
        <p>
          The theme tokens live on <code className="font-mono">:root</code>,
          but the Next font variables were on{' '}
          <code className="font-mono">&lt;body&gt;</code>. So{' '}
          <code className="font-mono">--font-display: var(--font-cinzel)</code>{' '}
          was invalid at the root, and every theme on this site was silently
          rendering in Times. Moving the font classes to{' '}
          <code className="font-mono">&lt;html&gt;</code> fixed all four at
          once. Separately, <code className="font-mono">@theme inline</code>{' '}
          had <code className="font-mono">--font-mono: var(--font-mono)</code>,
          which is circular, so every mono utility fell back too.
        </p>
      </Section>

      <CanvasUiSections />

      <Section title="Files">
        <ul className="list-disc space-y-1 pl-5">
          <li><code className="font-mono">plain/asciiFluid.ts</code>, the solver, no React in it</li>
          <li><code className="font-mono">plain/asciiRender.ts</code>, the ramp quantizer</li>
          <li><code className="font-mono">plain/textMask.ts</code>, text to a per-cell coverage mask</li>
          <li><code className="font-mono">plain/PlainField.tsx</code>, mount, pointer wiring, teardown</li>
          <li><code className="font-mono">plain/PlainHold.tsx</code>, the holding screen chrome</li>
          <li><code className="font-mono">plain/holdState.ts</code>, the allowlist both React and the pre-paint script read</li>
          <li><code className="font-mono">plain/useScramble.ts</code>, ideaboard #65, the decode effect</li>
          <li><code className="font-mono">plain/HoldStage.tsx</code>, one model in four styles, and their monochrome options</li>
          <li><code className="font-mono">plain/holdScheme.ts</code>, the light/dark switch plain mode owns itself</li>
          <li><code className="font-mono">plain/HoldContact.tsx</code>, the contact details, backdrop and reachable copy</li>
          <li><code className="font-mono">plain/messageStore.ts</code>, which rendering of the message is showing</li>
          <li><code className="font-mono">plain/HoldMessage.tsx</code>, the renderings that are not the field</li>
          <li><code className="font-mono">plain/messageImage.ts</code>, the message as a PNG, so the words can be a particle cloud</li>
          <li><code className="font-mono">plain/HoldStatus.tsx</code>, the readout, fed by <code className="font-mono">fieldMetrics.ts</code></li>
          <li><code className="font-mono">components/canvasui/</code>, vendored Canvas UI source, see its README</li>
        </ul>
      </Section>
    </Walkthrough>
  );
}
