// src/app/page.tsx
'use client';

// We only need useState and Suspense for now.
import { useState, Suspense } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';

// We are NOT importing Scene.tsx anymore to prevent interference.
// import Scene from './components/Scene'; 

export default function HomePage() {
  // This state will eventually control the transition, but for now, it does nothing.
  const [isExperienceStarted, setExperienceStarted] = useState(false);

  const handleEnter = () => {
    console.log("Experience started! We'll build the transition next.");
    setExperienceStarted(true);
    // In the future, this is where we will trigger the transition to the Scene.
  };

  return (
    <main className="h-screen w-screen bg-black">
      {/* We use Suspense to show the loading screen while LandingPage assets load. */}
      <Suspense fallback={<LoadingScreen />}>
        {/* This is now the ONLY component being rendered. 
            There is no possibility of Scene.tsx interfering. */}
        <LandingPage onEnter={handleEnter} />
      </Suspense>

      {/* We can add logic here later to show the Scene component
          AFTER the landing page has animated out.
          For example: {isExperienceStarted && <Scene />} 
      */}
    </main>
  );
}
