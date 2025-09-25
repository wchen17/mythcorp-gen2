// src/app/components/NewLandingPage.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function NewLandingPage() {
  const [isHovering, setIsHovering] = useState(false);

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
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
            <span className="text-sm font-medium text-white tracking-wide">MENU</span>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            <Link 
              href="/" 
              className="text-3xl font-bold text-white tracking-wide transition-opacity hover:opacity-80 font-serif"
            >
              <span>MYTH</span>
              <span className="relative">
                C
                <span 
                  className="relative inline-block"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  O
                  <span 
                    className={`absolute inset-0 flex items-center justify-center text-yellow-400 transition-all duration-300 ${
                      isHovering ? 'transform rotate-12 scale-110 drop-shadow-[0_0_8px_rgba(255,255,0,0.6)]' : ''
                    }`}
                    style={{ fontSize: '0.7em' }}
                  >
                    ⭐
                  </span>
                </span>
                RP
              </span>
            </Link>
            <span className="text-xs font-sans tracking-wider text-white/70 mt-1">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation */}
          <div className="flex space-x-8">
            <Link 
              href="/about" 
              className="text-sm font-medium text-white hover:underline transition-all"
            >
              ABOUT US
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-white hover:underline transition-all"
            >
              CONTACT
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="text-green-400">DISCOVER YOUR</span>
            <br />
            <span className="text-yellow-400 font-extrabold underline underline-offset-4">POTENTIAL</span>
          </h1>
          
          {/* Horizontal Line */}
          <div className="w-64 h-px bg-white mx-auto mt-8"></div>
        </div>
      </main>
    </div>
  );
}