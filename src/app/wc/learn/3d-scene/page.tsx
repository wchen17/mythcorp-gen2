'use client';

import Link from 'next/link';
import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';

export default function ThreeDSceneWalkthrough() {
  return (
    <Walkthrough
      eyebrow="[ /wc/learn/3d-scene ]"
      title="Anatomy of the 3D experience"
      intro={
        <>
          The <Link href="/experience" className="font-mono text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">/experience</Link>{' '}
          page is one big React Three Fiber scene with a themed control
          panel bolted on. Everything in this walkthrough lives in one
          file: <code className="font-mono text-[color:var(--accent-soft)]">src/app/experience/Simulation.tsx</code>.
          About 400 lines. Worth reading top to bottom once.
        </>
      }
    >
      <Section title="The Canvas, in plain English">
        <p>
          <code className="font-mono">&lt;Canvas&gt;</code> from{' '}
          <code className="font-mono">@react-three/fiber</code> creates a
          WebGL context, an animation loop, and a JSX bridge into Three.js.
          Anything you nest inside becomes a real Three.js object behind
          the scenes:
        </p>
        <Code>{`<Canvas
  gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
  dpr={[1, 2]}
>
  <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={55} />
  <color attach="background" args={[backdrop]} />
  <ambientLight intensity={0.3} />
  <Model ... />
  {/* …particles, stars, post-fx… */}
</Canvas>`}</Code>
        <p>
          The <code className="font-mono">dpr={'{[1, 2]}'}</code> caps the
          device pixel ratio so a 4x retina display doesn&rsquo;t render
          16x the pixels. The <code className="font-mono">fov={'{55}'}</code>{' '}
          matches the LandingPage camera, so the route change feels
          continuous, not snappy.
        </p>
        <Aside>
          The <code className="font-mono">&lt;color attach=&quot;background&quot;&gt;</code>{' '}
          is per-theme via <code className="font-mono">BACKDROP_BY_THEME</code>.
          Paper mode gets a warm cream backdrop instead of black so the
          scene doesn&rsquo;t flash dark when you switch themes mid-session.
        </Aside>
      </Section>

      <Section title="A particle field from a Float32Array">
        <p>
          The cloud of glowing dots is one mesh with a custom geometry.
          For 1000 points you need two arrays of 3000 floats each, x/y/z
          per vertex and r/g/b per vertex:
        </p>
        <Code>{`const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const colors    = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 20;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  colors[i * 3]     = Math.random() * 0.5 + 0.5;  // R
  colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;  // G
  colors[i * 3 + 2] = 1;                          // B = pinned blue
}`}</Code>
        <p>
          The arrays are wired into the geometry as buffer attributes,
          then a <code className="font-mono">pointsMaterial</code> with{' '}
          <code className="font-mono">vertexColors</code> tells Three to
          colour each point from the buffer instead of using one shared
          material color:
        </p>
        <Code>{`<points ref={meshRef}>
  <bufferGeometry>
    <bufferAttribute attach="attributes-position" count={particleCount} args={[positions, 3]} />
    <bufferAttribute attach="attributes-color"    count={particleCount} args={[colors, 3]} />
  </bufferGeometry>
  <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
</points>`}</Code>
        <p>
          The whole mesh rotates slowly via <code className="font-mono">useFrame</code>,
          one cheap matrix multiply per frame regardless of point count.
          That&rsquo;s why this stays at 60fps even when star density is
          maxed out.
        </p>
      </Section>

      <Section title="The stars clamp (load-bearing)">
        <p>
          drei&rsquo;s <code className="font-mono">&lt;Stars&gt;</code>{' '}
          accepts a <code className="font-mono">count</code> prop. The
          slider lets the user crank star density up to 5x. The naive
          version was:
        </p>
        <Code>{`<Stars count={5000 * settings.stars} ... />`}</Code>
        <p>
          On a maxed slider that&rsquo;s 25,000 stars, which tanks mid-tier
          GPUs to ~25fps. The cap is two constants at the top of the file:
        </p>
        <Code>{`const MAX_STARS = 12000;
const STARS_PER_UNIT = 1200;

<Stars
  count={Math.min(Math.round(STARS_PER_UNIT * settings.stars), MAX_STARS)}
  factor={4 * settings.stars}
  ...
/>`}</Code>
        <Aside>
          12k was the empirical sweet spot on a 2019-era integrated GPU.
          Don&rsquo;t lift the cap without re-benchmarking, this is the
          one thing keeping the simulation feeling smooth on a thin
          laptop. CLAUDE.md calls this out explicitly.
        </Aside>
      </Section>

      <Section title="Bloom: what each knob does">
        <p>
          The neon glow on the model and stars is post-processing from{' '}
          <code className="font-mono">@react-three/postprocessing</code>:
        </p>
        <Code>{`<EffectComposer>
  <Bloom
    intensity={settings.glowIntensity}    // 0-3, overall brightness of the glow
    luminanceThreshold={0.1}              // pixels brighter than this bloom
    luminanceSmoothing={0.2}              // soft transition into the threshold
    mipmapBlur                            // use mipmaps for the blur, faster + softer
    radius={0.85}                         // how far the glow spreads
  />
</EffectComposer>`}</Code>
        <p>
          <code className="font-mono">luminanceThreshold</code> at 0.1 is
          deliberately low, so even mid-tone cyans bloom, not just pure
          whites. That&rsquo;s what makes the cyberpunk theme feel hot.{' '}
          <code className="font-mono">mipmapBlur</code> is a quality + perf
          win, it samples the GPU&rsquo;s automatic mipmap chain instead
          of doing N gaussian passes.
        </p>
      </Section>

      <Section title="The randomizable settings object">
        <p>
          All scene state lives in one object, with a paired set of
          defaults and a randomizer:
        </p>
        <Code>{`const DEFAULTS = {
  rotationSpeed: 0.2, position: [0, 0, 0], color: '#00ffff',
  glowIntensity: 0.5, stars: 1, showHelicopter: false,
  heliScale: 1.5, heliSmoothness: 0.1, showAxis: true,
};

const getRandomSettings = () => ({
  rotationSpeed: Math.random() * 2,
  position: [(Math.random() - 0.5) * 10, ...],
  color: \`#\${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}\`,
  glowIntensity: Math.random() * 2,
  stars: Math.random() * 5,
  ...
});`}</Code>
        <p>
          The control panel reads from this object; the{' '}
          <code className="font-mono">[ 🎲 RANDOMIZE ALL ]</code> button
          calls <code className="font-mono">setSettings(getRandomSettings())</code>;{' '}
          <code className="font-mono">[ ↺ RESET DEFAULTS ]</code> calls{' '}
          <code className="font-mono">setSettings(DEFAULTS)</code>. Adding
          a new tunable means adding one key in both objects and one
          slider in the panel, no plumbing.
        </p>
      </Section>

      <Section title="Where to look">
        <p>One file:</p>
        <ul className="list-inside list-disc space-y-1 font-mono text-sm">
          <li><code>src/app/experience/Simulation.tsx</code>, the whole scene</li>
        </ul>
        <p>And one neighbour worth reading next to it:</p>
        <ul className="list-inside list-disc space-y-1 font-mono text-sm">
          <li><code>src/app/experience/MainMenu.tsx</code>, the card-with-CTA before the scene mounts</li>
        </ul>
      </Section>
    </Walkthrough>
  );
}
