'use client';

import React from 'react';
import Link from 'next/link';

interface MainMenuProps {
  onStart: () => void;
  onSettings: () => void;
}

export function MainMenu({ onStart, onSettings }: MainMenuProps) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center font-sans overflow-hidden">
      
      {/* Backgrounds (Same as NewLandingPage) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          filter: 'blur(4px)',
          transform: 'scale(1.1)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-purple-900/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-blue-900/20" />

      {/* Header (Links back to home) */}
      <header className="absolute z-30 top-0 left-0 right-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-1/2 h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
            <span className="text-sm font-medium text-white">HOME</span>
          </Link>
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl font-medium text-white tracking-wider drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
              MYTHCORP
            </span>
            <span className="text-sm font-serif tracking-widest text-white/80 mt-1">
              SIMULATION
            </span>
          </div>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      {/* Main Content Box */}
      <main className="relative z-10 flex flex-col items-center text-center text-white p-4">
        <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl p-8 max-w-md w-full">

          <h1 className="text-5xl font-serif font-extrabold leading-tight tracking-tight text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.6)]">
            3D EXPERIENCE
          </h1>
          <div className="w-1/2 h-0.5 bg-white/50 mt-2 mx-auto shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          
          <p className="font-mono text-white/70 tracking-widest mt-4 mb-10 text-sm">
            [ SIMULATION LABORATORY ]
          </p>

          <div className="flex flex-col gap-4 w-64 mx-auto">
            <button 
              onClick={onStart}
              className="bg-cyan-400 text-black font-bold py-3 px-6 rounded
                         hover:bg-cyan-300 transition-all transform hover:scale-105 tracking-wide text-sm"
            >
              ENTER SIMULATION
            </button>
            
            <button 
              onClick={onSettings}
              className="bg-gray-700 text-white font-medium py-3 px-6 rounded
                         hover:bg-gray-600 transition-all text-sm opacity-70 cursor-not-allowed"
            >
              SETTINGS (WIP)
            </button>
          </div>
        
          {/* Secret Menu Tab */}
          <details className="border-t border-white/20 mt-8 pt-6">
            <summary className="px-3 py-2 text-cyan-400 font-mono text-xs tracking-widest cursor-pointer hover:bg-white/10 rounded transition-all">
              🔒 SECRET ROUTES
            </summary>
            <div className="bg-black/50 rounded-b-md overflow-hidden text-left p-2">
              <Link href="#" onClick={(e) => e.preventDefault()} className="block px-5 py-2 text-orange-400/70 font-mono text-sm hover:bg-orange-500/10 transition-all cursor-not-allowed">
                /bin/animals [WIP]
              </Link>
              <Link href="#" onClick={(e) => e.preventDefault()} className="block px-5 py-2 text-orange-400/70 font-mono text-sm hover:bg-orange-500/10 transition-all cursor-not-allowed">
                /dev/chat [WIP]
              </Link>
            </div>
          </details>

        </div>
      </main>
    </div>
  );
}