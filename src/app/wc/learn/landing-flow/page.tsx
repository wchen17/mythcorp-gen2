'use client';

import Link from 'next/link';
import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';

export default function LandingFlowWalkthrough() {
  return (
    <Walkthrough
      eyebrow="[ /wc/learn/landing-flow ]"
      title="The cinematic boot, reveal, and handoff"
      intro={
        <>
          The homepage doesn&rsquo;t just render, it <em>boots</em>. Three
          components hand off across about five seconds: a binary-digit
          loading screen, a 3D logo, then a warm reveal of the skyline.
          The trick is to make it feel like one continuous thing instead
          of three separate React mounts. Want to watch it again?{' '}
          <Link
            href="/boot"
            className="font-mono text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]"
          >
            ↻ replay the boot
          </Link>
          .
        </>
      }
    >
      <Section title="Three components, one performance">
        <p>
          The pipeline lives in <code className="font-mono">src/app/page.tsx</code>:
        </p>
        <ul className="list-inside list-disc space-y-1 font-mono text-sm">
          <li><code>LoadingScreen.tsx</code>, the cyberpunk binary digit fly-in</li>
          <li><code>LandingPage.tsx</code>, the 3D MYTHCORP title card</li>
          <li><code>NewLandingPage.tsx</code>, the skyline reveal + ENTER prompt</li>
        </ul>
        <p>
          Only one of them is mounted at a time. That&rsquo;s a hard
          constraint, not a stylistic preference, see the next section.
        </p>
      </Section>

      <Section title="Why only one Canvas at a time">
        <p>
          React StrictMode double-mounts components in development.{' '}
          <code className="font-mono">@react-three/fiber</code> doesn&rsquo;t
          love it when two <code className="font-mono">&lt;Canvas&gt;</code>{' '}
          instances try to share GL state in the same tick, you get
          crashes about disposed renderers or duplicated contexts.
        </p>
        <p>
          So the <code className="font-mono">AppLoader</code> wrapper is
          built around a single piece of state, <code className="font-mono">showChildren</code>.
          Either the LoadingScreen Canvas is mounted, or one of the
          landing Canvases is, never both:
        </p>
        <Code>{`if (showChildren) {
  return <>{children}</>;  // LandingPage or NewLandingPage
}

return (
  <div style={{ opacity: isReady ? 0 : 1, transition: 'opacity 600ms ease' }}>
    <LoadingScreen onFinished={() => {}} />
  </div>
);`}</Code>
        <p>
          The 600ms fade-out happens with the LoadingScreen still mounted,
          then a second timer flips <code className="font-mono">showChildren</code>{' '}
          and the next Canvas takes its place.
        </p>
      </Section>

      <Section title="The fixed 3500ms window">
        <p>
          The boot stays on screen for a fixed{' '}
          <code className="font-mono">LOADING_DURATION_MS = 3500</code>,
          regardless of how fast the real assets resolve. On a warm
          cache the GLB and font may be ready in 100ms, but the
          cinematic still gets its full beat.
        </p>
        <Aside>
          The LoadingScreen component itself <em>also</em> has an internal
          minimum display time (1500ms after asset progress hits 100%),
          which is what protects the standalone Suspense-fallback usage.
          The two timers don&rsquo;t fight, AppLoader passes a no-op{' '}
          <code className="font-mono">onFinished</code> so the internal
          timer just runs and is ignored.
        </Aside>
      </Section>

      <Section title="Preloading the GLB once per session">
        <p>
          The 3D logo and the <code className="font-mono">/experience</code>{' '}
          simulation both render the same <code className="font-mono">spectre.glb</code>{' '}
          model. To make sure the boot has nothing to wait on, the file
          is preloaded three different ways, all targeting the same drei
          cache, so only one network fetch actually happens:
        </p>
        <Code>{`// 1. <link rel="preload"> in layout.tsx <head>
<link rel="preload" href="/spectre.glb" as="fetch" crossOrigin="anonymous" />

// 2. useGLTF.preload() at the top of LandingPage.tsx (module scope)
useGLTF.preload('/spectre.glb');

// 3. useGLTF.preload() at the top of Simulation.tsx (module scope)
useGLTF.preload('/spectre.glb');`}</Code>
        <p>
          By the time <code className="font-mono">LandingPage</code> mounts
          and calls <code className="font-mono">useGLTF(&apos;/spectre.glb&apos;)</code>,
          the model is already cached and the scene renders on the next
          frame.
        </p>
      </Section>

      <Section title="Skip on second visit">
        <p>
          Watching the same boot every page-refresh would get old fast.{' '}
          <code className="font-mono">AppLoader</code> writes a session
          flag the first time it boots:
        </p>
        <Code>{`const SESSION_BOOTED_KEY = 'mythcorp-booted';

useEffect(() => {
  const alreadyBooted = sessionStorage.getItem(SESSION_BOOTED_KEY) === '1';
  if (alreadyBooted) {
    setShowChildren(true);     // skip straight to landing
    return;
  }
  sessionStorage.setItem(SESSION_BOOTED_KEY, '1');
}, []);`}</Code>
        <p>
          The flag is <code className="font-mono">sessionStorage</code>,
          not <code className="font-mono">localStorage</code>, so closing
          the tab clears it. Reopen later, you get the boot again.
        </p>
        <Aside>
          If you want to replay it inside the same session, that&rsquo;s
          what <Link href="/boot" className="font-mono text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">/boot</Link>{' '}
          is for. It runs an animated 0&nbsp;to&nbsp;100 progress timer
          (since no real assets are loading) so the binary-digit lerp
          actually completes its assembly into the sphere/cube/torus.
        </Aside>
      </Section>

      <Section title="Avoiding flash-of-black on transition">
        <p>
          Three failure modes had to be designed out:
        </p>
        <ol className="list-inside list-decimal space-y-2">
          <li>
            <strong>Theme flash.</strong> The boot starts before React
            hydrates. <code className="font-mono">layout.tsx</code> runs
            a tiny synchronous script in <code className="font-mono">&lt;head&gt;</code>{' '}
            that reads the theme from <code className="font-mono">localStorage</code>{' '}
            and sets <code className="font-mono">data-theme</code> on{' '}
            <code className="font-mono">&lt;html&gt;</code> before the
            first paint. See <Link href="/wc/learn/theme-system" className="text-[color:var(--accent)] underline underline-offset-4">/wc/learn/theme-system</Link>.
          </li>
          <li>
            <strong>Canvas flash.</strong> Each landing Canvas matches
            its background to <code className="font-mono">var(--bg)</code>{' '}
            (inline style on the wrapper, or{' '}
            <code className="font-mono">&lt;color attach=&quot;background&quot; /&gt;</code>{' '}
            for the R3F scene), so there&rsquo;s no white-or-black flash
            during the swap.
          </li>
          <li>
            <strong>Double-navigation bug.</strong> Clicking the 3D logo
            used to <em>both</em> trigger the GSAP fade and call{' '}
            <code className="font-mono">router.push()</code>, briefly
            mounting two heavy Canvases. The fix was to drop the
            navigation entirely, the transition is state-driven inside{' '}
            <code className="font-mono">HomePage</code> via{' '}
            <code className="font-mono">onTransitionComplete</code>.
          </li>
        </ol>
      </Section>

      <Section title="Where to look">
        <p>The whole flow is five files:</p>
        <ul className="list-inside list-disc space-y-1 font-mono text-sm">
          <li><code>src/app/page.tsx</code>, the <code>AppLoader</code> + state machine</li>
          <li><code>src/app/components/LoadingScreen.tsx</code>, the cyberpunk boot</li>
          <li><code>src/app/components/LandingPage.tsx</code>, the 3D logo</li>
          <li><code>src/app/components/NewLandingPage.tsx</code>, the reveal</li>
          <li><code>src/app/boot/page.tsx</code>, the on-demand replay</li>
        </ul>
      </Section>
    </Walkthrough>
  );
}
