'use client';

import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';
import { DemoPanel } from '../_components/DemoPanel';
import { MiniStarFieldDemo } from '../_components/MiniStarFieldDemo';
import {
  CANVAS_SNIPPET,
  PARTICLE_SNIPPET,
  STARS_SNIPPET,
  BLOOM_SNIPPET,
  DEFAULTS_SNIPPET,
  BACKDROP_SNIPPET,
  RESET_BUG_SNIPPET,
} from './_snippets';

export default function ThreeDSceneWalkthrough() {
  return (
    <Walkthrough
      eyebrow="[ /wc/learn/3d-scene ]"
      title="Anatomy of the 3D experience"
      intro={
        <p>
          The{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">/experience</code>{' '}
          route renders a fully interactive 3D scene: a particle field, a
          rotating spectre model, a star field, and a settings panel that
          randomizes everything. This walkthrough covers the R3F primitives that
          power it, why the star count has a hard ceiling, how Bloom is tuned,
          and how the control panel was migrated from hardcoded neon to
          theme-aware tokens.
        </p>
      }
    >
      <Section title="Canvas and R3F basics">
        <p>
          React Three Fiber wraps Three.js inside React&rsquo;s reconciler. You write
          JSX and R3F translates it into Three.js objects: each JSX element maps
          to a Three.js class, and props map to properties on that class.
        </p>
        <Code>{CANVAS_SNIPPET}</Code>
        <p>Two hooks do most of the work in child components:</p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>
            <code className="font-mono text-[color:var(--accent-soft)]">useFrame(callback)</code>
            {' '}runs before every rendered frame. Put animation logic here.
          </li>
          <li>
            <code className="font-mono text-[color:var(--accent-soft)]">useThree()</code>
            {' '}returns the renderer, camera, viewport size, and mouse coordinates.
          </li>
        </ul>
        <Aside>
          <code className="font-mono">dpr={'{[1, 2]}'}</code> caps the device-pixel
          ratio at 2 even on Retina screens. Higher DPRs multiply the fragment
          count for no visible gain above 2, so this is a free performance win.
        </Aside>
      </Section>

      <Section title="Try it: a pocket star field">
        <p>
          Here is the same idea shrunk to fit an article: a real R3F canvas with
          a star field, a spinning wireframe, and the same clamp the full scene
          uses. Drag the density up and the count still stops well short of the
          ceiling. The canvas background matches your current theme, switch
          themes and it follows.
        </p>
        <DemoPanel
          label="R3F"
          code={
            <Code filename="MiniStarField.tsx" highlight={[3, 4]}>{`const count = Math.min(
  Math.round(MINI_STARS_PER_UNIT * settings.stars),
  MINI_MAX_STARS,          // 3000 here, 12000 in the real scene
);
<Stars count={count} factor={3 * settings.stars} speed={settings.speed} fade />
<color attach="background" args={[backdropForTheme]} />`}</Code>
          }
          demo={<MiniStarFieldDemo />}
        />
        <Aside>
          The canvas is loaded with{' '}
          <code className="font-mono">next/dynamic</code> and{' '}
          <code className="font-mono">ssr: false</code>, behind a
          height-matched skeleton. R3F reaches for WebGL at import time, so it
          cannot render on the server, and the skeleton keeps the article from
          jumping when the canvas swaps in.
        </Aside>
      </Section>

      <Section title="ParticleField: BufferGeometry and Float32Array">
        <p>
          The swirling blue cloud behind the model is{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">ParticleField</code>:
          1 000 points rendered as a single draw call using a{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">BufferGeometry</code>.
          Rather than creating 1 000 separate mesh objects, all positions and
          colors are packed into typed arrays and uploaded to the GPU once.
        </p>
        <Code>{PARTICLE_SNIPPET}</Code>
        <p>
          The field rotates slowly each frame via{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">useFrame</code>,
          making it feel alive without any physics simulation.
        </p>
      </Section>

      <Section title="Stars: clamping the count">
        <p>
          The settings panel exposes a &ldquo;Star Density&rdquo; slider that multiplies the
          star count. The naive formula would be{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">5000 * settings.stars</code>,
          but at the maximum slider value that evaluates to 25 000 stars and
          tanks the frame rate on mid-range GPUs.
        </p>
        <p>Two constants enforce a ceiling:</p>
        <Code>{STARS_SNIPPET}</Code>
        <p>
          At the default density (1 unit), the count is 1 200. At the slider
          maximum (5 units), it would be 6 000, well below the 12 000 cap. The
          cap exists so a user who hand-edits the number input can never
          accidentally exceed it.
        </p>
        <Aside>
          <code className="font-mono">factor={'{4 * settings.stars}'}</code> scales
          the visual spread of each star even as the count stays capped. So
          cranking the slider still makes the sky look denser, just without
          adding more geometry.
        </Aside>
      </Section>

      <Section title="Bloom: post-processing the glow">
        <p>
          The neon glow around the model and particles comes from the{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">Bloom</code>{' '}
          pass in{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">@react-three/postprocessing</code>.
          It extracts pixels above a luminance threshold, blurs them into a glow
          texture, then blends that back over the scene.
        </p>
        <Code>{BLOOM_SNIPPET}</Code>
        <p>
          <code className="font-mono text-[color:var(--accent-soft)]">mipmapBlur</code>{' '}
          is the key performance flag. Without it, Bloom uses a series of
          full-resolution ping-pong passes that are expensive on large viewports.
          The mipmap variant downsamples first, blurs, then upsamples, cutting
          GPU cost with almost no visual difference.
        </p>
      </Section>

      <Section title="The randomizable DEFAULTS">
        <p>
          The settings panel starts with a random configuration every time it
          mounts. This is intentional: the experience should feel different each
          visit. Two objects define the parameter space:
        </p>
        <Code>{DEFAULTS_SNIPPET}</Code>
        <Aside>
          Passing a function to{' '}
          <code className="font-mono">useState</code> is lazy initialization.
          React calls it once on the first render instead of on every render. That
          matters here because{' '}
          <code className="font-mono">getRandomSettings()</code> calls{' '}
          <code className="font-mono">Math.random()</code>, and you want those
          numbers locked in once, not re-rolled each render.
        </Aside>
      </Section>

      <Section title="Show the bug: reset that shares an array">
        <p>
          That innocent <code className="font-mono">DEFAULTS</code> object hid a
          real bug this site shipped. Reset used to hand{' '}
          <code className="font-mono">setState</code> the module-level object
          directly, so its <code className="font-mono">position</code> array was
          shared by reference. Edit a Position slider (which copies the object
          but not the array) and you silently mutated the defaults. Worse, reset
          twice in a row was a no-op: React saw the same object reference and
          bailed out of the render.
        </p>
        <DemoPanel
          label="DIFF"
          code={
            <Code filename="Simulation.tsx" highlight={[2, 8, 9]}>{RESET_BUG_SNIPPET}</Code>
          }
          demo={
            <div className="flex h-full flex-col justify-center gap-3 text-sm text-[color:var(--fg-muted)]">
              <p>
                The fix is one line of hygiene: rebuild a fresh object <em>and</em>
                {' '}a fresh array on every reset.
              </p>
              <p>
                The pocket demo above uses the same discipline. Its reset calls{' '}
                <code className="font-mono">getMiniDefaults()</code>, which spreads
                a new object each time, so hitting reset twice always works.
              </p>
              <p className="text-[color:var(--fg-subtle)]">
                A shared reference is invisible until someone mutates through it.
                Clone at the boundary and it stays invisible for the right reason.
              </p>
            </div>
          }
        />
      </Section>

      <Section title="BACKDROP_BY_THEME: per-theme canvas background">
        <p>
          The Three.js canvas has its own background color, separate from the
          page&rsquo;s CSS background. Without explicit control, the canvas always
          shows pure black, which looks out of place on the warm{' '}
          <em>paper</em> or muted <em>luxury</em> themes.
        </p>
        <Code>{BACKDROP_SNIPPET}</Code>
        <p>
          The{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&lt;color&gt;</code>{' '}
          element is R3F shorthand for setting{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">scene.background</code>.
          When the user switches themes, the context updates, the component
          re-renders with the new backdrop, and R3F patches the Three.js scene
          object in place.
        </p>
      </Section>

      <Section title="Where to look">
        <ul className="list-inside list-disc space-y-1 break-all font-mono text-sm">
          <li><code>src/app/experience/Simulation.tsx</code>, the full scene + settings panel</li>
          <li><code>src/app/experience/page.tsx</code>, the route shell that mounts Simulation</li>
          <li><code>src/app/contexts/ThemeContext.tsx</code>, useTheme and ThemeName</li>
        </ul>
      </Section>
    </Walkthrough>
  );
}
