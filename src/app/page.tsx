'use client';

import { useState, Suspense, useEffect } from 'react';
import { useProgress } from "@react-three/drei";
// --- NEW: Import useRouter ---
import { useRouter } from 'next/navigation'; 
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';
import { NewLandingPage } from './components/NewLandingPage';
// --- REMOVED: No longer need Scene.tsx ---
// import Scene from './components/Scene'; 

/**
 * AppLoader component (No changes needed)
 */
function AppLoader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 4000); 

      return () => clearTimeout(timer);
    }
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
 * The main page component
 */
export default function HomePage() {
  // --- NEW: Get the router instance ---
  const router = useRouter();

  // --- MODIFIED: Removed 'experience' from the state ---
  const [appState, setAppState] = useState<'landing' | 'homepage'>('landing');

  const handleGoToHomepage = () => {
    setAppState('homepage');
  };

  // --- MODIFIED: This now uses the router to navigate ---
  const handleGoToExperience = () => {
    router.push('/experience');
  };
  
  const handleGoToLanding = () => {
    setAppState('landing');
  };

  return (
    <main className="h-screen w-screen bg-black">
      <Suspense fallback={
        <LoadingScreen onFinished={() => {}} />
      }>
        <AppLoader>
          
          {/* STEP 1: Shows 3D Logo Page */}
          {appState === 'landing' && (
            <LandingPage onTransitionComplete={handleGoToHomepage} />
          )}
          
          {/* STEP 2: Shows Professional Homepage */}
          {appState === 'homepage' && (
            <NewLandingPage 
              onEnterExperience={handleGoToExperience} 
              onEnterInteractive={handleGoToLanding} 
            />
          )}
          
          {/* --- REMOVED: The 'experience' state is gone --- */}
          
        </AppLoader>
      </Suspense>
    </main>
  );
}