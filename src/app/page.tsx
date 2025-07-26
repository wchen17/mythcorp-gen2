// src/app/page.tsx
'use client';

import { useState, Suspense, useEffect } from 'react';
import { useProgress } from "@react-three/drei";
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';
import Scene from './components/Scene';

/**
 * This component wraps the main application content.
 * It's responsible for managing the transition from the loading screen
 * to the interactive application after assets are loaded and the
 * minimum display time has passed.
 */
function AppLoader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const { progress } = useProgress();

  useEffect(() => {
    // This effect triggers once all assets are loaded.
    if (progress === 100) {
      // We start a timer to ensure the loading screen is shown
      // for a minimum amount of time.
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 4000); // 4-second minimum display time

      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <>
      <div style={{ display: isReady ? 'none' : 'block' }}>
        {/* FIX APPLIED HERE: Added the required 'onFinished' prop. */}
        <LoadingScreen onFinished={() => {}} />
      </div>

      <div style={{ visibility: isReady ? 'visible' : 'hidden', height: '100%', width: '100%' }}>
        {children}
      </div>
    </>
  );
}


/**
 * The main page component. Its only job is to set up the Suspense boundary
 * and render the AppLoader, which handles all the complex state.
 */
export default function HomePage() {
  const [appState, setAppState] = useState<'landing' | 'experience'>('landing');

  const handleTransitionComplete = () => {
    setAppState('experience');
  };

  return (
    <main className="h-screen w-screen bg-black">
      <Suspense fallback={
        /* FIX APPLIED HERE: Added the required 'onFinished' prop to the fallback as well. */
        <LoadingScreen onFinished={() => {}} />
      }>
        <AppLoader>
          {/* The content that needs to be loaded goes here */}
          {appState === 'landing' ? (
            <LandingPage onTransitionComplete={handleTransitionComplete} />
          ) : (
            <Scene />
          )}
        </AppLoader>
      </Suspense>
    </main>
  );
}
