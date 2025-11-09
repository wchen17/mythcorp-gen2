'use client';

import React, { useState } from 'react';

// --- TYPE 1: Define the props we expect from page.tsx ---
interface NewLandingPageProps {
  onEnterExperience: () => void;
  onEnterInteractive: () => void;
}

export function NewLandingPage({ onEnterExperience, onEnterInteractive }: NewLandingPageProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    // Set a default sans-serif font for the whole component
    <div className="min-h-screen relative overflow-hidden font-sans">
      
      {/* Background Image with Blur and Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          // Use the uploaded image
          backgroundImage: 'url(chicagoskyline.jpg)',
          filter: 'blur(4px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Dark Overlay - Made slightly darker (30%) to increase contrast */}
      <div className="absolute inset-0 bg-black/30" />

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
              {/* --- MODIFIED: Font weight set to normal --- */}
              <span className="text-sm font-normal text-white tracking-wide">MENU</span>
            </div>
            
            {/* --- MODIFIED: Dropdown Menu --- */}
            {showMenu && (
              <div className="absolute top-full left-0 mt-4 bg-black/90 backdrop-blur-sm 
                            border border-cyan-400/30 rounded-lg p-4 min-w-64 z-20
                            flex flex-col space-y-3">
    
                <span className="text-white/60 text-xs uppercase tracking-widest">Experience</span>
                
                {/* This button will trigger the load for scene.tsx */}
                <button 
                  onClick={() => {
                    onEnterExperience();
                    setShowMenu(false); // Close menu on click
                  }}
                  className="bg-cyan-400 text-black font-bold py-2 px-4 rounded
                             hover:bg-cyan-300 transition-all text-sm tracking-wide w-full text-left"
                >
                  Enter 3D Scene
                </button>
                <button 
                  onClick={() => {
                    onEnterInteractive();
                    setShowMenu(false); // Close menu on click
                  }}
                  className="bg-gray-700 text-white font-medium py-2 px-4 rounded
                             hover:bg-gray-600 transition-all text-sm w-full text-left"
                >
                  View 3D Logo
                </button>

                {/* --- REMOVED --- */}
                {/* Removed the divider and duplicate "Navigation" links */}
                
              </div>
            )}
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            {/* font-serif is kept as you liked it */}
            <a href="/" className="font-serif text-5xl font-medium text-white tracking-wider" onClick={(e) => e.preventDefault()}>
              MYTHCORP
            </a>
            <span className="text-sm font-serif tracking-widest text-white/80 mt-1">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation */}
          <div className="flex space-x-6">
              {/* --- MODIFIED: Font weight set to normal --- */}
              <a 
                href="/about" 
                className="text-sm font-normal text-white hover:text-cyan-300 transition-all underline underline-offset-4"
                onClick={(e) => e.preventDefault()}
              >
                ABOUT US
              </a>
              {/* --- MODIFIED: Font weight set to normal --- */}
              <a 
                href="/contact" 
                className="text-sm font-normal text-white hover:text-cyan-300 transition-all underline underline-offset-4"
                onClick={(e) => e.preventDefault()}
              >
                CONTACT
              </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          
          {/* --- MODIFIED: Title and Underline --- */}
          <div className="mb-8">
            {/* 1. Wrapped H1 and Underline in an inline-block div. 
                This makes the wrapper shrink to the H1's width.
                The text-center on <main> will center this block. */}
            <div className="inline-block">
              {/* 2. Made all text extrabold and tight for a punchier, solid look */}
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight whitespace-nowrap tracking-tight">
                <span className="text-green-400">DISCOVER</span>{' '}
                {/* 3. Fixed text-white-400 typo */}
                <span className="text-white">YOUR</span>{' '}
                <span className="text-yellow-400">POTENTIAL</span>
              </h1>
              {/* 4. Underline is now w-full (of the inline-block) and has a small top margin */}
              <div className="w-full h-0.5 bg-white mt-2"></div>
            </div>
          </div>
          
          {/* Enhanced Separator (Unchanged) */}
          <div className="flex items-center justify-center my-8">
            <div className="w-32 h-0.5 bg-white/40"></div>
            <div className="mx-4 text-white/60 text-sm font-mono tracking-widest">EST. 2024</div>
            <div className="w-32 h-0.5 bg-white/40"></div>
          </div>

        </div>
      </main>

    </div>
  );
}