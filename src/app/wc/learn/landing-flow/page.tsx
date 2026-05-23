'use client';

import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';

export default function LandingFlowWalkthrough() {
  return (
    <Walkthrough
      eyebrow="[ /wc/learn/landing-flow ]"
      title="The cinematic boot flow"
      intro={
        <p>
          The homepage plays a three-act sequence: a cyberpunk loading screen
          that assembles binary digits into a 3D shape, a 3D MYTHCORP logo you
          click to dismiss, and a warm Chicago skyline reveal. This walkthrough
          explains how the three parts hand off without a canvas flash, why the
          GLB is preloaded during the boot window, and how returning visitors
          skip the whole thing.
        </p>
      }
    >
      <Section title="One Canvas at a time">
        <p>
          React Three Fiber crashes under React StrictMode if two{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&lt;Canvas&gt;</code>{' '}
          elements mount at the same time. The site avoids this by keeping all
          three stages mutually exclusive: only one of{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">LoadingScreen</code>
          {', '}
          <code className="font-mono text-[color:var(--accent-soft)]">LandingPage</code>
          {', or '}
          <code className="font-mono text-[color:var(--accent-soft)]">NewLandingPage</code>{' '}
          is in the React tree at any given time.
        </p>
        <p>
          The{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">AppLoader</code>{' '}
          wrapper in{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">src/app/page.tsx</code>{' '}
          owns the switch. It renders{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">LoadingScreen</code>{' '}
          for 3.5 seconds, fades it out over 600 ms, then unmounts it and mounts
          the children in a single state flip. React replaces the entire subtree,
          so the old Canvas is gone before the new one appears.
        </p>
        <Code>{`// AppLoader: fixed-window boot gate in src/app/page.tsx
const LOADING_DURATION_MS = 3500;

function AppLoader({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsReady(true), LOADING_DURATION_MS);
    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const swapTimer = setTimeout(() => setShowChildren(true), 600);
    return () => clearTimeout(swapTimer);
  }, [isReady]);

  if (showChildren) return <>{children}</>;

  return (
    <div style={{ opacity: isReady ? 0 : 1, transition: 'opacity 600ms ease' }}>
      <LoadingScreen onFinished={() => {}} />
    </div>
  );
}`}</Code>
      </Section>

      <Section title="Session-storage skip">
        <p>
          Nobody wants to sit through a four-second boot on every page refresh.
          The first time the sequence plays,{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">AppLoader</code>{' '}
          writes{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">mythcorp-booted=1</code>{' '}
          to{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">sessionStorage</code>.
          On the next mount within the same tab it sees the flag and jumps straight
          to the children. Opening a new tab re-runs boot because{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">sessionStorage</code>{' '}
          is per-tab, not per-origin.
        </p>
        <Code>{`useEffect(() => {
  let alreadyBooted = false;
  try {
    alreadyBooted = sessionStorage.getItem(SESSION_BOOTED_KEY) === '1';
  } catch {
    // sessionStorage is blocked in some private-browsing modes; fall through
  }
  setSkipBoot(alreadyBooted);
  if (alreadyBooted) {
    setIsReady(true);
    setShowChildren(true);
    return;
  }
  try { sessionStorage.setItem(SESSION_BOOTED_KEY, '1'); } catch { /* ignore */ }
}, []);`}</Code>
        <Aside>
          Every sessionStorage call is wrapped in try/catch. iOS private-browsing
          and certain corporate proxies throw a SecurityError on access. Without
          the guard, the entire page would crash on those devices.
        </Aside>
      </Section>

      <Section title="LoadingScreen: shapes from binary digits">
        <p>
          The loading screen is its own full-screen Canvas. It renders 500
          binary-digit components, each a{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&lt;Text&gt;</code>{' '}
          from{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">@react-three/drei</code>,
          that fly in from far away and converge on a target shape.
        </p>
        <p>
          The shape type is chosen randomly at mount: sphere, cube, or torus.
          Each digit starts at its final position multiplied by 5 (scattered far
          out into space), then lerps toward the target as{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">progress</code>{' '}
          climbs from 0 to 100.
        </p>
        <p>
          Progress comes from{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">useProgress()</code>{' '}
          from drei, which tracks R3F's internal asset loading queue. While the
          root page's{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&lt;Suspense&gt;</code>{' '}
          resolves the preloaded GLB, progress moves from 0 toward 100 and the
          digits fly into formation.
        </p>
        <Code>{`// Inside BinaryDigit, position lerps from start to end each frame
useFrame(() => {
  if (textRef.current) {
    textRef.current.position.lerpVectors(startPosition, endPosition, progress);
  }
});

// Start position is end * 5: digits fly in from five times the distance
const startPos = endPos.clone().multiplyScalar(5);`}</Code>
      </Section>

      <Section title="Preloading the GLB">
        <p>
          The spectre model ({' '}
          <code className="font-mono text-[color:var(--accent-soft)]">/spectre.glb</code>
          ) appears in both{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">LandingPage</code>{' '}
          and{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">Simulation</code>.
          Both files call{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">useGLTF.preload</code>{' '}
          at module scope, outside any component:
        </p>
        <Code>{`// At the top of LandingPage.tsx, outside the component:
useGLTF.preload('/spectre.glb');`}</Code>
        <p>
          Calling it at module scope means the browser starts the network
          request the moment the JS bundle evaluates, during the boot window,
          not when the component first mounts. By the time{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">LandingPage</code>{' '}
          actually renders, the GLB is already cached and{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">useGLTF('/spectre.glb')</code>{' '}
          resolves without waiting. No flash of empty scene.
        </p>
        <Aside>
          The same preload call appears in both{' '}
          <code className="font-mono">LandingPage.tsx</code> and{' '}
          <code className="font-mono">Simulation.tsx</code>. Calling it twice is
          harmless: drei deduplicates by URL, so only one network request ever fires.
        </Aside>
      </Section>

      <Section title="LandingPage: the title card">
        <p>
          After the loading screen fades out,{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">LandingPage</code>{' '}
          mounts with a 3D MYTHCORP logo built from{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&lt;Text3D&gt;</code>.
          The logo tracks the mouse with a gentle lerp and shows a pointer cursor
          on hover. Clicking (or pressing the prompt) starts a GSAP timeline that
          fades the canvas content and the background image to opacity 0, then fires{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">onTransitionComplete</code>,
          which flips{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">appState</code>{' '}
          to{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">'homepage'</code>.
        </p>
        <Code>{`const tl = gsap.timeline({ onComplete: () => onTransitionComplete?.() });

tl.to(backgroundRef.current, { opacity: 0, duration: 1.5, ease: 'power2.in' }, 0);
tl.to(promptRef.current,    { opacity: 0, duration: 1.0, ease: 'power2.in' }, 0);

contentRef.current.traverse((child) => {
  const mat = child.material;
  if (mat) tl.to(mat, { opacity: 0, duration: 1, ease: 'power2.in' }, 0.2);
});`}</Code>
        <p>
          The camera FOV is{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">fov={'{'}55{'}'}</code>,
          matching the{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">/experience</code>{' '}
          Simulation camera. That shared FOV means the scene does not snap or
          zoom when you navigate from the landing page into the full 3D experience.
        </p>
      </Section>

      <Section title="NewLandingPage: the warm reveal">
        <p>
          Once{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">appState</code>{' '}
          becomes{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">'homepage'</code>,
          React unmounts{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">LandingPage</code>{' '}
          and mounts{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">NewLandingPage</code>.
          There is no Canvas here: the background is a CSS-filtered Chicago
          skyline image rendered by{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">SkylineBackdrop</code>,
          the hero heading is pure HTML via{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">HeroTitle</code>,
          and a banner slides up from the bottom after 2.5 seconds via{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">EnterBanner</code>.
        </p>
        <p>
          Two paths from here: "ENTER EXPERIENCE" pushes to{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">/experience</code>{' '}
          via the router, and "ENTER INTERACTIVE" resets{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">appState</code>{' '}
          back to{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">'landing'</code>,
          which replays the 3D title card. Pressing Ctrl+G (or Cmd+G) toggles a
          glowing vertical line across the screen: a dev alignment aid and a
          small Easter egg at the same time.
        </p>
      </Section>

      <Section title="Where to look">
        <ul className="list-inside list-disc space-y-1 font-mono text-sm">
          <li><code>src/app/page.tsx</code>, AppLoader and state machine</li>
          <li><code>src/app/components/LoadingScreen.tsx</code>, binary digit shapes</li>
          <li><code>src/app/components/LandingPage.tsx</code>, 3D logo and GSAP fade</li>
          <li><code>src/app/components/NewLandingPage.tsx</code>, warm reveal and banner</li>
          <li><code>src/app/components/landing/</code>, SkylineBackdrop, HeroTitle, EnterBanner, LandingModals</li>
        </ul>
      </Section>
    </Walkthrough>
  );
}
