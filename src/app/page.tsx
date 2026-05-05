'use client';

// Walkthrough: /will/learn/landing-flow

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';
import { NewLandingPage } from './components/NewLandingPage';

/**
 * Holds the LoadingScreen on top of the rest of the app for a fixed
 * window, then unmounts it and mounts the children. The two are
 * mutually exclusive so only one R3F Canvas exists at a time —
 * mounting both simultaneously caused intermittent
 * "addEventListener of null" / "gl.alpha of null" errors, especially
 * under React StrictMode's double-mount cycle in dev.
 *
 * useGLTF.preload('/spectre.glb') (declared at the top of LandingPage)
 * fetches the GLB during the loading window, so when LandingPage mounts
 * the model is already cached and there's no flash of empty scene.
 */
const LOADING_DURATION_MS = 3500;

function AppLoader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [showChildren, setShowChildren] = useState(false);

  // Fixed window for the boot sequence. After it elapses, fade out the
  // LoadingScreen, then swap to children once the fade completes.
  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsReady(true), LOADING_DURATION_MS);
    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const swapTimer = setTimeout(() => setShowChildren(true), 600);
    return () => clearTimeout(swapTimer);
  }, [isReady]);

  if (showChildren) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        opacity: isReady ? 0 : 1,
        transition: 'opacity 600ms ease',
        height: '100%',
        width: '100%',
      }}
    >
      <LoadingScreen onFinished={() => {}} />
    </div>
  );
}

/**
 * The cinematic entry: LoadingScreen (cyberpunk boot)
 *   → LandingPage (3D MYTHCORP logo, the "title card")
 *   → NewLandingPage (the warm reveal — DISCOVER YOUR POTENTIAL)
 *   → /experience (real route, full 3D scene)
 */
export default function HomePage() {
  const router = useRouter();
  const [appState, setAppState] = useState<'landing' | 'homepage'>('landing');

  return (
    <main className="h-screen w-screen bg-[color:var(--bg)]">
      <Suspense fallback={<LoadingScreen onFinished={() => {}} />}>
        <AppLoader>
          {appState === 'landing' && (
            <LandingPage onTransitionComplete={() => setAppState('homepage')} />
          )}
          {appState === 'homepage' && (
            <NewLandingPage
              onEnterExperience={() => router.push('/experience')}
              onEnterInteractive={() => setAppState('landing')}
            />
          )}
        </AppLoader>
      </Suspense>
    </main>
  );
}
