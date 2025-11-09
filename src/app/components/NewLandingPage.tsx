// src/app/components/NewLandingPage.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function NewLandingPage() {
  const [isHovering, setIsHovering] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Blur and Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          filter: 'blur(4px)',
          transform: 'scale(1.1)', // Prevent blur edge artifacts
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Header Navigation */}
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
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-full left-0 mt-4 bg-black/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4 min-w-64 z-20">
                <div className="space-y-3">
                  <Link href="/experience" className="block text-cyan-300 hover:text-cyan-200 transition-colors font-medium">
                    🎮 3D SIMULATION LAB
                  </Link>
                  <Link href="/about" className="block text-white hover:text-cyan-300 transition-colors">
                    📖 COMPANY INFO
                  </Link>
                  <Link href="/contact" className="block text-white hover:text-cyan-300 transition-colors">
                    📧 CONTACT FORM
                  </Link>
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <div className="text-orange-400 text-sm opacity-75 mb-2">🚧 IN DEVELOPMENT:</div>
                    <button className="block text-orange-400/60 cursor-not-allowed text-sm mb-1">• Team Portal</button>
                    <button className="block text-orange-400/60 cursor-not-allowed text-sm mb-1">• Project Dashboard</button>
                    <button className="block text-orange-400/60 cursor-not-allowed text-sm mb-1">• Research Hub</button>
                    <button className="block text-orange-400/60 cursor-not-allowed text-sm">• Analytics Suite</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            <Link 
              href="/" 
              className="text-4xl md:text-5xl font-bold text-white tracking-wide transition-all duration-300 hover:scale-105 font-serif relative"
            >
              <span className="relative">
                <span className="text-cyan-300">MYTH</span>
                <span className="relative text-white">
                  C
                  <span 
                    className="relative inline-block"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    O
                    <span 
                      className={`absolute inset-0 flex items-center justify-center text-yellow-400 transition-all duration-500 ${
                        isHovering ? 'transform rotate-[360deg] scale-110 drop-shadow-[0_0_20px_rgba(255,255,0,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,255,0,0.4)]'
                      }`}
                      style={{ fontSize: '0.5em' }}
                    >
                      ⭐
                    </span>
                  </span>
                  <span className="text-cyan-300">RP</span>
                </span>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 blur-sm opacity-20 text-cyan-300 -z-10">
                  MYTHC⭐RP
                </div>
              </span>
            </Link>
            <span className="text-sm font-sans tracking-widest text-white/80 mt-2 font-medium">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation */}
          <div className="flex space-x-6">
            <Link 
              href="/about" 
              className="text-sm font-medium text-white hover:text-cyan-300 transition-all duration-300 hover:underline"
            >
              ABOUT US
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-white hover:text-cyan-300 transition-all duration-300 hover:underline"
            >
              CONTACT
            </Link>
            <button className="text-sm font-medium text-orange-400 cursor-not-allowed opacity-60 relative group">
              RESEARCH
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                🚧 Coming Soon
              </span>
            </button>
            <button className="text-sm font-medium text-orange-400 cursor-not-allowed opacity-60 relative group">
              LABS
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                🚧 Under Construction
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* Title matching reference design - single line */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight relative">
              <span className="inline-block border-b-2 border-white pb-2">
                <span className="text-green-400">DISCOVER</span>{' '}
                <span className="text-white">YOUR</span>{' '}
                <span className="text-yellow-400 font-black tracking-wide">POTENTIAL</span>
              </span>
            </h1>
          </div>
          
          {/* Enhanced Separator */}
          <div className="flex items-center justify-center my-8">
            <div className="w-32 h-0.5 bg-white/40"></div>
            <div className="mx-4 text-white/60 text-sm font-mono tracking-widest">EST. 2024</div>
            <div className="w-32 h-0.5 bg-white/40"></div>
          </div>

          {/* Call to Action Buttons - Updated theme */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <Link 
              href="/experience" 
              className="inline-block bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold py-4 px-10 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] text-lg tracking-widest"
            >
              ENTER 3D EXPERIENCE
            </Link>
            <Link
              href="/interactive"
              className="inline-block bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-3 px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] text-base tracking-widest"
            >
              INTERACTIVE MYTHCORP LOGO
            </Link>
            <button className="text-white/70 hover:text-cyan-300 text-sm font-mono tracking-wider border border-white/30 hover:border-cyan-400/60 px-6 py-2 transition-all duration-300">
              LEARN MORE
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}