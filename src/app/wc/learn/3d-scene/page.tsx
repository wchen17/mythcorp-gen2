'use client';

import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';

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
          React Three Fiber wraps Three.js inside React's reconciler. You write
          JSX and R3F translates it into Three.js objects: each JSX element maps
          to a Three.js class, and props map to properties on that class.
        </p>
        <Code>{`<Canvas
  gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
  dpr={[1, 2]}
>
  {/* All R3F components live inside <Canvas> */}
  <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={55} />
  <Model ... />
  <Stars ... />
</Canvas>`}</Code>
        <p>
          Two hooks do most of the work in child components:
        </p>
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

      <Section title="ParticleField: BufferGeometry and Float32Array">
        <p>
          The swirling blue cloud behind the model is{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">ParticleField</code>:
          1 000 points rendered as a single draw call using a{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">BufferGeometry</code>.
          Rather than creating 1 000 separate mesh objects, all positions and
          colors are packed into typed arrays and uploaded to the GPU once.
        </p>
        <Code>{`const particles = useMemo(() => {
  const positions = new Float32Array(particleCount * 3); // [x,y,z, x,y,z, ...]
  const colors    = new Float32Array(particleCount * 3); // [r,g,b, r,g,b, ...]

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    colors[i * 3]        = Math.random() * 0.5 + 0.5; // r
    colors[i * 3 + 1]    = Math.random() * 0.5 + 0.5; // g
    colors[i * 3 + 2]    = 1;                           // b (always full)
  }
  return { positions, colors };
}, []);

return (
  <points ref={meshRef}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" count={particleCount}
        args={[particles.positions, 3]} />
      <bufferAttribute attach="attributes-color" count={particleCount}
        args={[particles.colors, 3]} />
    </bufferGeometry>
    <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
  </points>
);`}</Code>
        <p>
          The field rotates slowly each frame via{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">useFrame</code>,
          making it feel alive without any physics simulation.
        </p>
      </Section>

      <Section title="Stars: clamping the count">
        <p>
          The settings panel exposes a "Star Density" slider that multiplies the
          star count. The naive formula would be{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">5000 * settings.stars</code>,
          but at the maximum slider value that evaluates to 25 000 stars and
          tanks the frame rate on mid-range GPUs.
        </p>
        <p>
          Two constants enforce a ceiling:
        </p>
        <Code>{`const MAX_STARS = 12000;
const STARS_PER_UNIT = 1200;

// Inside <Canvas>:
<Stars
  radius={100}
  depth={50}
  count={Math.min(Math.round(STARS_PER_UNIT * settings.stars), MAX_STARS)}
  factor={4 * settings.stars}
  saturation={0}
  fade
  speed={1}
/>`}</Code>
        <p>
          At the default density (1 unit), the count is 1 200. At the slider
          maximum (5 units), it would be 6 000, well below the 12 000 cap.
          The cap exists so a user who hand-edits the number input can never
          accidentally input a value that exceeds it.
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
          It works by extracting pixels above a luminance threshold, blurring
          them into a glow texture, then blending that back over the scene.
        </p>
        <Code>{`<EffectComposer>
  <Bloom
    intensity={settings.glowIntensity}  // slider: 0 to 3
    luminanceThreshold={0.1}            // pixels brighter than 10% trigger glow
    luminanceSmoothing={0.2}            // soft edge around the threshold
    mipmapBlur                          // cheaper, smoother multi-scale blur
    radius={0.85}                       // how far the glow bleeds outward
  />
</EffectComposer>`}</Code>
        <p>
          <code className="font-mono text-[color:var(--accent-soft)]">mipmapBlur</code>{' '}
          is the key performance flag. Without it, Bloom uses a series of
          full-resolution ping-pong passes that are expensive on large viewports.
          The mipmap variant downsamples first, blurs, then upsamples, cutting
          GPU cost significantly with almost no visual difference.
        </p>
      </Section>

      <Section title="The randomizable DEFAULTS">
        <p>
          The settings panel starts with a random configuration every time it
          mounts. This is intentional: the experience should feel different each
          visit. Two objects define the parameter space:
        </p>
        <Code>{`const DEFAULTS = {
  rotationSpeed: 0.2,
  position: [0, 0, 0],
  color: '#00ffff',
  glowIntensity: 0.5,
  stars: 1,
  showHelicopter: false,
  heliScale: 1.5,
  heliSmoothness: 0.1,
  showAxis: true,
};

const getRandomSettings = () => ({
  rotationSpeed: Math.random() * 2,
  position: [(Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10],
  color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'),
  glowIntensity: Math.random() * 2,
  stars: Math.random() * 5,
  showHelicopter: Math.random() > 0.5,
  heliScale: Math.random() * 4.5 + 0.5,
  heliSmoothness: Math.random() * 0.19 + 0.01,
  showAxis: Math.random() > 0.5,
});

// State is seeded with a random config, not DEFAULTS:
const [settings, setSettings] = useState(() => getRandomSettings());`}</Code>
        <Aside>
          Passing a function to{' '}
          <code className="font-mono">useState</code> is called lazy initialization.
          React calls it once on the first render instead of on every render. This
          matters here because{' '}
          <code className="font-mono">getRandomSettings()</code> calls{' '}
          <code className="font-mono">Math.random()</code> and you only want those
          numbers locked in once, not re-rolled each render.
        </Aside>
      </Section>

      <Section title="BACKDROP_BY_THEME: per-theme canvas background">
        <p>
          The Three.js canvas has its own background color that is separate from
          the page's CSS background. Without explicit control, the canvas always
          shows pure black, which looks out of place on the warm{' '}
          <em>paper</em>{' '}or muted{' '}
          <em>luxury</em>{' '}themes.
        </p>
        <Code>{`const BACKDROP_BY_THEME: Record<ThemeName, string> = {
  cyberpunk: '#000008', // near-black with a faint blue cast
  luxury:    '#0c0a14', // dark purple-grey
  paper:     '#f3ebdb', // warm off-white matching the CSS background
};

// Inside Simulation, consumed by the active theme from context:
const { theme } = useTheme();
const backdrop = BACKDROP_BY_THEME[theme];

// Then inside <Canvas>:
<color attach="background" args={[backdrop]} />`}</Code>
        <p>
          The{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&lt;color&gt;</code>{' '}
          element is an R3F shorthand for setting{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">scene.background</code>
          . When the user switches themes, the context updates, the component
          re-renders with the new backdrop value, and R3F patches the Three.js
          scene object in place.
        </p>
      </Section>

      <Section title="Where to look">
        <ul className="list-inside list-disc space-y-1 font-mono text-sm">
          <li><code>src/app/experience/Simulation.tsx</code>, the full scene + settings panel</li>
          <li><code>src/app/experience/page.tsx</code>, the route shell that mounts Simulation</li>
          <li><code>src/app/contexts/ThemeContext.tsx</code>, useTheme and ThemeName</li>
        </ul>
      </Section>
    </Walkthrough>
  );
}
