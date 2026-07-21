'use client';

import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';
import { FlowStepper } from '../_components/FlowStepper';
import {
  APPLOADER_SNIPPET,
  SESSION_SNIPPET,
  BINARY_SNIPPET,
  PRELOAD_SNIPPET,
  GSAP_SNIPPET,
} from './_snippets';

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
        <Code>{APPLOADER_SNIPPET}</Code>
      </Section>

      <Section title="Run the handoff yourself">
        <p>
          Three stages, one at a time. Step through them and watch which line of
          the state machine fires each transition. Auto-play loops the whole boot
          so you can see the shape of it, or click a stage to jump straight there.
        </p>
        <FlowStepper />
        <Aside>
          The real sequence adds a 600 ms fade between{' '}
          <code className="font-mono">loading</code> and{' '}
          <code className="font-mono">landing</code>, and a GSAP timeline on the way
          into <code className="font-mono">entered</code>. The stepper strips the
          timing so the state transitions themselves are easy to follow.
        </Aside>
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
        <Code>{SESSION_SNIPPET}</Code>
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
          from drei, which tracks R3F&rsquo;s internal asset loading queue. While the
          root page&rsquo;s{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&lt;Suspense&gt;</code>{' '}
          resolves the preloaded GLB, progress moves from 0 toward 100 and the
          digits fly into formation.
        </p>
        <Code>{BINARY_SNIPPET}</Code>
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
        <Code>{PRELOAD_SNIPPET}</Code>
        <p>
          Calling it at module scope means the browser starts the network
          request the moment the JS bundle evaluates, during the boot window,
          not when the component first mounts. By the time{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">LandingPage</code>{' '}
          actually renders, the GLB is already cached and{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">useGLTF(&apos;/spectre.glb&apos;)</code>{' '}
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
          <code className="font-mono text-[color:var(--accent-soft)]">&apos;homepage&apos;</code>.
        </p>
        <Code>{GSAP_SNIPPET}</Code>
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
          <code className="font-mono text-[color:var(--accent-soft)]">&apos;homepage&apos;</code>,
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
          Two paths from here: &ldquo;ENTER EXPERIENCE&rdquo; pushes to{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">/experience</code>{' '}
          via the router, and &ldquo;ENTER INTERACTIVE&rdquo; resets{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">appState</code>{' '}
          back to{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&apos;landing&apos;</code>,
          which replays the 3D title card. Pressing Ctrl+G (or Cmd+G) toggles a
          glowing vertical line across the screen: a dev alignment aid and a
          small Easter egg at the same time.
        </p>
      </Section>

      <Section title="Where to look">
        <ul className="list-inside list-disc space-y-1 break-all font-mono text-sm">
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
