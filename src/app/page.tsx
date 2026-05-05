'use client';

// Walkthrough: /will/learn/landing-flow

import { useState, Suspense, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';
import { NewLandingPage } from './components/NewLandingPage';

/**
 * Holds the LoadingScreen on top of the rest of the app until R3F's
 * useProgress reports 100%, then waits a beat so the boot sequence
 * doesn't feel rushed before revealing the landing.
 */
function AppLoader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress < 100) return;
    const timer = setTimeout(() => setIsReady(true), 4000);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <>
      <div style={{ display: isReady ? 'none' : 'block' }}>
        <LoadingScreen onFinished={() => {}} />
      </div>
      <div style={{ visibility: isReady ? 'visible' : 'hidden', height: '100%', width: '100%' }}>
        {children}
      </div>
    </>
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
