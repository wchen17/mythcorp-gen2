// src/app/page.tsx
'use client';

import { useState, Suspense } from 'react';
import Scene from './components/Scene'; // Assuming your original scene is here
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';

export default function HomePage() {
  const [appState, setAppState] = useState('landing'); // 'landing' or 'experience'
  const [isLoaded, setIsLoaded] = useState(false);

  // This component will render based on the appState
  const renderContent = () => {
    switch (appState) {
      case 'experience':
        return <Scene />; // Your main 3D experience
      case 'landing':
      default:
        // We use Suspense to wait for the LandingPage assets to load
        return (
          <Suspense fallback={null}>
            <LandingPage onEnter={() => setAppState('experience')} />
          </Suspense>
        );
    }
  };

  return (
    <main className="h-screen w-screen bg-black">
      {/* Show loading screen until assets are ready */}
      {!isLoaded && <LoadingScreen onStarted={setIsLoaded} />}
      
      {/* Once loaded, show the main content */}
      {isLoaded && renderContent()}
    </main>
  );
}
