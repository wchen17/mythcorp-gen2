'use client';

// Imports from "Incoming" to support the new features
import React, { useState, useEffect } from 'react';

// --- TYPE 1: Define the props we expect from page.tsx ---
interface NewLandingPageProps {
  onEnterExperience: () => void;
  onEnterInteractive: () => void;
}

export function NewLandingPage({ onEnterExperience, onEnterInteractive }: NewLandingPageProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  // --- KEPT FROM "INCOMING": State for the new pop-up banner ---
  const [showBanner, setShowBanner] = useState(false);

  // --- KEPT FROM "INCOMING": Effect to show the banner after 3 seconds ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000); // 3-second delay

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // The empty array [] means this effect runs only once

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      
      {/* --- MODIFIED: Added new 'fadeInDown' animation for the menu --- */}
      <style>{`
        @keyframes fadeInBottom {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-bottom {
          animation: fadeInBottom 0.5s ease-out;
        }

        /* This is the new animation for the menu */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
      `}</style>

      {/* Background Image with Blur and Overlay (Using your "Current" image) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          filter: 'blur(4px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* --- KEPT FROM "INCOMING": Ethereal Gradient Overlays --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-purple-900/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-blue-900/20" />

      {/* Header Navigation */}
      {/* --- MODIFIED: Using grid-cols-3 for perfect centering --- */}
      <header className="relative z-10 fixed top-0 left-0 right-0">
        <div className="grid grid-cols-3 items-center px-6 py-4">
          
          {/* Left: Menu (Aligned to start) */}
          <div className="relative justify-self-start">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-white transition-transform duration-300 ${showMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-opacity duration-300 ${showMenu ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-transform duration-300 ${showMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
              <span className="text-sm font-normal text-white tracking-wide">MENU</span>
            </div>
            
            {/* --- MERGED & RESTYLED DROPDOWN MENU --- */}
            {/* --- MODIFIED: Using new 'animate-fade-in-down' animation --- */}
            {showMenu && (
              <div className="absolute top-full left-0 mt-4 min-w-64 z-20
                              bg-black/70 backdrop-blur-md border border-white/20 rounded-lg
                              shadow-2xl animate-fade-in-down">
                
                <div className="p-2 flex flex-col space-y-1">
                  
                  <span className="text-white/60 text-xs uppercase tracking-widest px-3 pt-2 pb-1">Navigation</span>
                  
                  {/* --- MODIFIED: Removed preventDefault to allow navigation --- */}
                  <a 
                    href="/about" 
                    className="block px-3 py-2 text-white/90 font-serif rounded hover:bg-white/10 transition-all"
                    onClick={() => setShowMenu(false)}
                  >
                    About Us
                  </a>
                  <a 
                    href="/contact" 
                    className="block px-3 py-2 text-white/90 font-serif rounded hover:bg-white/10 transition-all"
                    onClick={() => setShowMenu(false)}
                  >
                    Contact
                  </a>
                  
                  {/* Kept the secret menu, styled to match */}
                  <details className="border-t border-white/20 mt-2 pt-2">
                    <summary className="px-3 py-2 text-cyan-400 font-mono text-xs tracking-widest cursor-pointer hover:bg-white/10 rounded transition-all">
                      🔒 SECRET MENU
                    </summary>
                    <div className="bg-black/50 rounded-b-md overflow-hidden">
                      
                      {/* --- MODIFIED: Links now point to '#' and are disabled --- */}
                      <a 
                        href="#" 
                        className="block px-5 py-2 text-orange-400/70 font-mono text-sm hover:bg-orange-500/10 transition-all"
                        onClick={(e) => { e.preventDefault(); setShowMenu(false); }}
                      >
                        [WIP] Animals
                      </a>
                      <a 
                        href="#" 
                        className="block px-5 py-2 text-orange-400/70 font-mono text-sm hover:bg-orange-500/10 transition-all"
                        onClick={(e) => { e.preventDefault(); setShowMenu(false); }}
                      >
                        [WIP] Chat
                      </a>
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>

          {/* Center: Logo (Aligned to center) */}
          <div className="flex flex-col items-center justify-self-center">
            <a 
              href="/" 
              className="font-serif text-5xl font-medium text-white tracking-wider drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]"
              onClick={(e) => e.preventDefault()}
            >
              MYTHCORP
            </a>
            <span className="text-sm font-serif tracking-widest text-white/80 mt-1">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation (Aligned to end) */}
          <div className="flex space-x-6 justify-self-end">
            <a 
              href="/about" 
              className="text-sm font-serif font-medium text-white hover:text-cyan-300 transition-all underline underline-offset-4 tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            >
              ABOUT US
            </a>
            <a 
              href="/contact" 
              className="text-sm font-serif font-medium text-white hover:text-cyan-300 transition-all underline underline-offset-4 tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            >
              CONTACT
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          
          {/* --- REVERTED: Title and Underline --- */}
          <div className="mb-8">
            <div className="inline-block">
              <h1 className="text-5xl md:text-7xl font-serif font-extrabold leading-tight whitespace-nowrap tracking-tight">
                <span className="text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.6)]">DISCOVER</span>{' '}
                <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">YOUR</span>{' '}
                <span className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]">POTENTIAL</span>
              </h1>
              <div className="w-full h-0.5 bg-white mt-2 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            </div>
          </div>
          
          {/* --- REVERTED: Enhanced Separator --- */}
          <div className="flex items-center justify-center my-8">
            <div className="w-32 h-0.5 bg-white/40"></div>
            <div className="mx-4 text-white/60 text-sm font-mono tracking-widest">EST. 2024</div>
            <div className="w-32 h-0.5 bg-white/40"></div>
          </div>

        </div>
      </main>

      {/* --- KEPT FROM "INCOMING": The new Pop-up Banner --- */}
      {showBanner && (
        <div className="fixed bottom-10 left-1/2 z-50 
                          flex items-center gap-6 p-4
                          bg-black/70 backdrop-blur-md border border-white/20 rounded-lg
                          shadow-2xl animate-fade-in-bottom">
          
          <span className="text-white/90 text-sm font-medium">Ready to see more?</span>
          
          {/* These buttons now correctly call the props */}
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