// src/app/page.tsx
'use client';

import { useState, Suspense } from 'react';
import Scene from './components/Scene'; 
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';

export default function HomePage() {
  const [appState, setAppState] = useState('landing'); // 'landing' or 'experience'

  const renderContent = () => {
    switch (appState) {
      case 'experience':
        return <Scene />; 
      case 'landing':
      default:
        // #FIX: The LoadingScreen is now the fallback for Suspense.
        // This allows it to track the loading progress of the LandingPage.
        return (
          <Suspense fallback={<LoadingScreen />}>
            <LandingPage onEnter={() => setAppState('experience')} />
          </Suspense>
        );
    }
  };

  return (
    <main className="h-screen w-screen bg-black">
      {renderContent()}
    </main>
  );
}
