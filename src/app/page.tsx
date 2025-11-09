// src/app/page.tsx
'use client';

import { useState, Suspense, useEffect } from 'react';
import { useProgress } from "@react-three/drei";
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';
import { NewLandingPage } from './components/NewLandingPage'; // <-- IMPORT NEW PAGE
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
        {/* The loading screen is visible until 'isReady' is true */}
        <LoadingScreen onFinished={() => {}} />
      </div>

      <div style={{ visibility: isReady ? 'visible' : 'hidden', height: '100%', width: '100%' }}>
        {/* The main app content is hidden until 'isReady' is true */}
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
  // --- ADD 'interactive' to the possible states ---
  const [appState, setAppState] = useState<'landing' | 'homepage' | 'experience'>('landing');

  // --- This function now leads to the homepage ---
  const handleGoToHomepage = () => {
    setAppState('homepage');
  };

  // --- This function leads to the experience ---
  const handleGoToExperience = () => {
    setAppState('experience');
  };
  
  // --- NEW: This function leads back to the 3D logo page ---
  const handleGoToLanding = () => {
    setAppState('landing');
  };

  return (
    <main className="h-screen w-screen bg-black">
      <Suspense fallback={
        <LoadingScreen onFinished={() => {}} />
      }>
        <AppLoader>
          
          {/* STEP 1: Shows 3D Logo Page (The interactive one) */}
          {appState === 'landing' && (
            <LandingPage onTransitionComplete={handleGoToHomepage} />
          )}
          
          {/* STEP 2: Shows Professional Homepage (The static image) */}
          {appState === 'homepage' && (
            <NewLandingPage 
              onEnterExperience={handleGoToExperience} 
              onEnterInteractive={handleGoToLanding} // Pass both functions as props
            />
          )}
          
          {/* STEP 3: Shows Final Scene */}
          {appState === 'experience' && (
            <Scene />
          )}
          
        </AppLoader>
      </Suspense>
    </main>
  );
}