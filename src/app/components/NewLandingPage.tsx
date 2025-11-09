// src/app/components/NewLandingPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// --- TYPE 1: Define the props we expect from page.tsx ---
interface NewLandingPageProps {
  onEnterExperience: () => void;
  onEnterInteractive: () => void;
}

export function NewLandingPage({ onEnterExperience, onEnterInteractive }: NewLandingPageProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  // --- TYPE 2: State for the new pop-up banner ---
  const [showBanner, setShowBanner] = useState(false);

  // --- TYPE 3: Effect to show the banner after 3 seconds ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000); // 3-second delay

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // The empty array [] means this effect runs only once

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* --- This style tag adds the fade-in animation --- */}
      <style>{`
        @keyframes fadeInBottom {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-bottom {
          animation: fadeInBottom 0.5s ease-out;
        }
      `}</style>

      {/* Background Image with Blur and Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          filter: 'blur(4px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Header Navigation (Unchanged) */}
      <header className="relative z-10 fixed top-0 left-0 right-0">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Menu */}
          <div className="relative">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-white transition-transform duration-300 ${showMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-opacity duration-300 ${showMenu ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-transform duration-300 ${showMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
              <span className="text-sm font-medium text-white tracking-wide">MENU</span>
            </div>
            
            {/* Dropdown Menu (Unchanged) */}
            {showMenu && (
              <div className="absolute top-full left-0 mt-4 bg-black/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4 min-w-64 z-20">
                {/* ... your menu links ... */}
              </div>
            )}
          </div>

          {/* Center: Logo (Unchanged) */}
          <div className="flex flex-col items-center">
            <Link href="/" className="font-serif text-5xl font-medium text-white tracking-wider">
              MYTHCORP
            </Link>
            <span className="text-sm font-serif tracking-widest text-white/80 mt-1">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation (Unchanged) */}
          <div className="flex space-x-6">
              <Link 
                href="/about" 
                className="text-sm font-medium text-white hover:text-cyan-300 transition-all underline underline-offset-4"
              >
                ABOUT US
              </Link>
              <Link 
                href="/contact" 
                className="text-sm font-medium text-white hover:text-cyan-300 transition-all underline underline-offset-4"
              >
                CONTACT
              </Link>
            {/* ... your other nav buttons ... */}
          </div>
        </div>
      </header>

      {/* Hero Section (Buttons are REMOVED to match the image) */}
      <main className="relative z-10 h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* Title matching reference design */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              <span className="text-green-400">DISCOVER</span>{' '}
              <span className="text-white">YOUR</span>{' '}
              <span className="text-yellow-400 font-black tracking-wide">POTENTIAL</span>
            </h1>
            <div className="w-1/2 h-0.5 bg-white mx-auto"></div>
          </div>
          
          {/* Enhanced Separator */}
          <div className="flex items-center justify-center my-8">
            <div className="w-32 h-0.5 bg-white/40"></div>
            <div className="mx-4 text-white/60 text-sm font-mono tracking-widest">EST. 2024</div>
            <div className="w-32 h-0.5 bg-white/40"></div>
          </div>

          {/* !!! NOTICE !!!
            The Call to Action buttons <div ...> that was here has been DELETED.
            The page now visually matches your reference image.
          */}

        </div>
      </main>

      {/* --- TYPE 4: The new Pop-up Banner --- */}
      {showBanner && (
        <div className="fixed bottom-10 left-1/2 z-50 
                        flex items-center gap-6 p-4
                        bg-black/70 backdrop-blur-md border border-white/20 rounded-lg
                        shadow-2xl animate-fade-in-bottom">
          
          <span className="text-white/90 text-sm font-medium">Ready to see more?</span>
          
          <button 
            onClick={onEnterExperience}
            className="bg-cyan-400 text-black font-bold py-2 px-5 rounded
                       hover:bg-cyan-300 transition-all transform hover:scale-105 text-sm tracking-wide"
          >
            Enter 3D Experience
          </button>

          <button 
            onClick={onEnterInteractive}
            className="bg-gray-700 text-white font-medium py-2 px-5 rounded
                       hover:bg-gray-600 transition-all text-sm"
          >
            View 3D Logo
          </button>

        </div>
      )}

    </div>
  );
}