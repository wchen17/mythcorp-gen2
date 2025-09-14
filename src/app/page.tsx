// src/app/page.tsx
'use client';

import { useState, Suspense, useEffect } from 'react';
import { useProgress } from "@react-three/drei";
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';
import { InteractiveExperience } from './components/InteractiveExperience';
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
      }, 1000); // Reduced to 1 second since loading screen handles its own timing

      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {children}
    </div>
  );
}


/**
 * The main page component. Its only job is to set up the Suspense boundary
 * and render the AppLoader, which handles all the complex state.
 */
export default function HomePage() {
  const [appState, setAppState] = useState<'loading' | 'landing' | 'interactive' | 'experience'>('loading');

  const handleLoadingComplete = () => {
    setAppState('landing');
  };

  const handleLandingTransition = () => {
    setAppState('interactive');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  const handleEnterExperience = () => {
    setAppState('experience');
  };

  return (
    <main className="h-screen w-screen bg-black">
      <Suspense fallback={
        <LoadingScreen onFinished={() => {}} />
      }>
        <AppLoader>
          {/* Render different components based on app state */}
          {appState === 'loading' && (
            <LoadingScreen onFinished={handleLoadingComplete} />
          )}
          
          {appState === 'landing' && (
            <LandingPage onTransitionComplete={handleLandingTransition} />
          )}
          
          {appState === 'interactive' && (
            <InteractiveExperience onBack={handleBackToLanding} />
          )}
          
          {appState === 'experience' && (
            <Scene />
          )}
        </AppLoader>
      </Suspense>
    </main>
  );
}
