// src/app/components/Header.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const starRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      setRotation(prev => (prev + 1) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <header className="relative z-20 fixed top-0 left-0 right-0 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between backdrop-blur-md bg-black/30 rounded-full px-8 py-4 border border-white/10 shadow-xl">
          {/* Left: Menu Button */}
          <div className="relative">
            <button
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                <div className={`w-full h-0.5 bg-white transition-all duration-300 ${showMenu ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-all duration-300 ${showMenu ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`w-full h-0.5 bg-white transition-all duration-300 ${showMenu ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
              <span className="text-sm font-semibold text-white tracking-wider">MENU</span>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-full left-0 mt-4 bg-black/90 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-6 min-w-72 shadow-2xl">
                <div className="space-y-3">
                  <Link 
                    href="/experience" 
                    className="block text-cyan-300 hover:text-cyan-200 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-cyan-400/10"
                    onClick={() => setShowMenu(false)}
                  >
                    🎮 3D Simulation Lab
                  </Link>
                  <Link 
                    href="/about" 
                    className="block text-white hover:text-cyan-300 transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                    onClick={() => setShowMenu(false)}
                  >
                    📖 Company Info
                  </Link>
                  <Link 
                    href="/contact" 
                    className="block text-white hover:text-cyan-300 transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                    onClick={() => setShowMenu(false)}
                  >
                    📧 Contact Form
                  </Link>
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="text-orange-400 text-xs font-semibold opacity-75 mb-3 uppercase tracking-wider">🚧 In Development</div>
                    <button className="block text-orange-400/60 cursor-not-allowed text-sm mb-2 py-1 px-3">• Team Portal</button>
                    <button className="block text-orange-400/60 cursor-not-allowed text-sm mb-2 py-1 px-3">• Project Dashboard</button>
                    <button className="block text-orange-400/60 cursor-not-allowed text-sm mb-2 py-1 px-3">• Research Hub</button>
                    <button className="block text-orange-400/60 cursor-not-allowed text-sm py-1 px-3">• Analytics Suite</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            <Link 
              href="/" 
              className="text-3xl md:text-4xl font-bold text-white tracking-wide transition-all duration-300 hover:scale-105 relative group"
            >
              <span className="relative inline-block">
                <span className="relative">
                  MYTH
                  <span 
                    ref={starRef}
                    className="inline-block relative mx-0.5"
                    style={{
                      transform: `rotate(${rotation + mousePosition.x * 30}deg) scale(${1 + mousePosition.y * 0.2})`,
                      display: 'inline-block',
                      fontSize: '0.6em',
                      verticalAlign: 'middle',
                      filter: `drop-shadow(0 0 ${Math.abs(mousePosition.x * 10)}px rgba(255, 215, 0, 0.8))`,
                      transition: 'filter 0.3s ease-out',
                    }}
                  >
                    ⭐
                  </span>
                  CORP
                </span>
                {/* Glow effect */}
                <span className="absolute inset-0 blur-lg opacity-30 text-cyan-300 group-hover:opacity-50 transition-opacity -z-10">
                  MYTH⭐CORP
                </span>
              </span>
            </Link>
            <span className="text-xs font-sans tracking-widest text-white/70 mt-1.5 font-medium uppercase">
              Founded in Chicago
            </span>
          </div>

          {/* Right: Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/about" 
              className="text-sm font-semibold text-white hover:text-cyan-300 transition-all duration-300 tracking-wide"
            >
              ABOUT US
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-semibold text-white hover:text-cyan-300 transition-all duration-300 tracking-wide"
            >
              CONTACT
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
