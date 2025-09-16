// src/app/minigame/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * Minigame Page - Placeholder for future gaming content
 * This page will eventually contain interactive mini-games
 */
export default function MinigamePage() {
  const [dots, setDots] = useState('');

  // Animated loading dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-screen w-screen bg-black relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 gap-px h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-cyan-400/10 animate-pulse" 
              style={{ 
                animationDelay: `${(i % 12) * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          href="/"
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-gray-300 hover:text-white px-4 py-2 rounded-md transition-all duration-300 backdrop-blur-sm"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-2xl px-8">
          {/* Main Title */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 mb-4">
              MINIGAMES
            </h1>
            <div className="h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-full mx-auto w-3/4"></div>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-8 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl text-purple-400 font-mono mb-4">
              Coming Soon{dots}
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Prepare for an immersive gaming experience that will challenge your mind and reflexes. 
              Our development team is crafting something extraordinary.
            </p>
            
            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-purple-900/20 border border-purple-500/20 rounded p-4">
                <div className="text-purple-400 font-semibold mb-2">Neural Puzzles</div>
                <p className="text-gray-400">Mind-bending challenges</p>
              </div>
              <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-4">
                <div className="text-cyan-400 font-semibold mb-2">Cyber Racing</div>
                <p className="text-gray-400">High-speed digital tracks</p>
              </div>
              <div className="bg-pink-900/20 border border-pink-500/20 rounded p-4">
                <div className="text-pink-400 font-semibold mb-2">Reality Shifts</div>
                <p className="text-gray-400">Dimension-hopping adventures</p>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-8 flex items-center justify-center space-x-2 text-yellow-400">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <span className="text-sm font-mono">Development in Progress</span>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
    </main>
  );
}