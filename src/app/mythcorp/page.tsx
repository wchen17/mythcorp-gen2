// src/app/mythcorp/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { LandingPage } from '../components/LandingPage';
import { InteractiveMythCorpExperience } from '../components/InteractiveMythCorpExperience';

/**
 * MYTHCORP Interactive Experience
 * Enhanced version with interactive menu and sub-navigation
 */
export default function MythCorpPage() {
  const [experienceStarted, setExperienceStarted] = useState(false);

  const handleTransitionComplete = () => {
    setExperienceStarted(true);
  };

  return (
    <main className="h-screen w-screen bg-black">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen bg-black text-cyan-400">
          <div className="text-center">
            <div className="text-4xl mb-4">⭐</div>
            <div className="text-xl mb-2">Loading MYTHCORP Experience...</div>
            <div className="text-sm opacity-70">Initializing interactive environment</div>
          </div>
        </div>
      }>
        {!experienceStarted ? (
          <LandingPage onTransitionComplete={handleTransitionComplete} />
        ) : (
          <InteractiveMythCorpExperience />
        )}
      </Suspense>
    </main>
  );
}