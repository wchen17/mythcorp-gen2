// src/app/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';
import { InteractiveExperience } from './components/InteractiveExperience';
import Scene from './components/Scene';

/**
 * The main page component handles the application flow
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
      {/* Render different components based on app state */}
      {appState === 'loading' && (
        <LoadingScreen onFinished={handleLoadingComplete} />
      )}
      
      {appState === 'landing' && (
        <Suspense fallback={<div>Loading...</div>}>
          <LandingPage onTransitionComplete={handleLandingTransition} />
        </Suspense>
      )}
      
      {appState === 'interactive' && (
        <Suspense fallback={<div>Loading...</div>}>
          <InteractiveExperience onBack={handleBackToLanding} />
        </Suspense>
      )}
      
      {appState === 'experience' && (
        <Suspense fallback={<div>Loading...</div>}>
          <Scene />
        </Suspense>
      )}
    </main>
  );
}
