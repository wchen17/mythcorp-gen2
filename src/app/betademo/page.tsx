// src/app/betademo/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Link from 'next/link';

// Dynamically import the InteractiveExperience component to prevent SSR issues and improve performance
const InteractiveExperience = dynamic(
  () => import('../components/InteractiveExperience').then(mod => ({ default: mod.InteractiveExperience })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-black text-cyan-400">
        <div className="text-center">
          <div className="text-4xl mb-4">⭐</div>
          <div className="text-xl mb-2">Loading Experience...</div>
          <div className="text-sm opacity-70">Initializing 3D environment</div>
        </div>
      </div>
    )
  }
);

/**
 * Beta Demo Page - The interactive 3D experience with the rotating spectre model
 * This page contains the main interactive experience with the 3D scene and UI controls
 */
export default function BetaDemoPage() {
  const handleBackToHome = () => {
    // Navigation handled by Link component below
  };

  return (
    <main className="h-screen w-screen bg-black relative">
      {/* Navigation Back to Home */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          href="/"
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-gray-300 hover:text-white px-4 py-2 rounded-md transition-all duration-300 backdrop-blur-sm"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Page Title Overlay */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-black/50 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-md backdrop-blur-sm">
          <div className="text-sm font-mono">BETA EXPERIENCE</div>
        </div>
      </div>

      {/* Main Interactive Experience */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen bg-black text-cyan-400">
          <div className="text-center">
            <div className="text-6xl mb-6">🌟</div>
            <div className="text-3xl mb-4 font-mono">MYTHCORP</div>
            <div className="text-lg mb-2">Loading Beta Experience...</div>
            <div className="text-sm opacity-70">Please wait while we prepare the experience</div>
          </div>
        </div>
      }>
        <InteractiveExperience onBack={handleBackToHome} />
      </Suspense>
    </main>
  );
}