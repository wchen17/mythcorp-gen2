// src/app/mysterious/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

/**
 * Mysterious Page - Interactive experience with Chicago skyline background
 * Features mouse-responsive background, theme switching, and mysterious content
 */
export default function MysteriousPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<'dark' | 'cyan'>('dark');
  const [glitchText, setGlitchText] = useState('');
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Glitch effect for mysterious text
  useEffect(() => {
    const texts = ['ACCESSING...', 'DECRYPTING...', 'LOADING...', 'READY...'];
    let index = 0;
    
    const interval = setInterval(() => {
      setGlitchText(texts[index]);
      index = (index + 1) % texts.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'cyan' : 'dark');
  };

  const themeColors = {
    dark: {
      primary: '#ffffff',
      secondary: '#666666',
      accent: '#00ffff',
      bg: 'rgba(0,0,0,0.8)',
      border: 'rgba(255,255,255,0.2)'
    },
    cyan: {
      primary: '#00ffff',
      secondary: '#004444',
      accent: '#ffffff',
      bg: 'rgba(0,40,40,0.8)',
      border: 'rgba(0,255,255,0.3)'
    }
  };

  const currentTheme = themeColors[theme];

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* Interactive Background with Chicago Skyline */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 transition-all duration-500 ease-out"
        style={{
          backgroundImage: `url('/chicagoskyline.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
          filter: `blur(${theme === 'dark' ? '3px' : '1px'}) brightness(${theme === 'dark' ? '0.4' : '0.6'}) contrast(${theme === 'dark' ? '1.2' : '1.5'})`,
          transform: `scale(${1.1 + mousePos.x * 0.0005}) rotate(${(mousePos.x - 50) * 0.02}deg)`,
        }}
      />

      {/* Overlay Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${currentTheme.accent}22 0%, transparent 50%)`,
        }}
      />

      {/* Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          href="/"
          className="backdrop-blur-md border transition-all duration-300 px-4 py-2 rounded-md"
          style={{
            background: currentTheme.bg,
            borderColor: currentTheme.border,
            color: currentTheme.primary,
          }}
        >
          ← Return
        </Link>
      </div>

      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="backdrop-blur-md border transition-all duration-300 px-4 py-2 rounded-md"
          style={{
            background: currentTheme.bg,
            borderColor: currentTheme.border,
            color: currentTheme.accent,
          }}
        >
          {theme === 'dark' ? '◐' : '◑'} Theme
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full relative z-10">
        <div 
          className="text-center max-w-4xl px-8 backdrop-blur-lg border rounded-lg p-12 transition-all duration-500"
          style={{
            background: currentTheme.bg,
            borderColor: currentTheme.border,
            transform: `translateY(${mousePos.y * 0.1 - 5}px) translateX(${mousePos.x * 0.05 - 2.5}px)`,
          }}
        >
          {/* Main Title with Glitch Effect */}
          <div className="mb-8">
            <h1 
              className="text-7xl md:text-9xl font-mono font-bold mb-4 transition-all duration-300"
              style={{ 
                color: currentTheme.accent,
                textShadow: `0 0 20px ${currentTheme.accent}66`,
                filter: `blur(${Math.sin(Date.now() * 0.005) * 0.5 + 0.5}px)`,
              }}
            >
              NEXUS
            </h1>
            <div 
              className="text-lg font-mono tracking-widest"
              style={{ color: currentTheme.secondary }}
            >
              {glitchText}
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link 
              href="/minigame"
              className="group border rounded-lg p-6 transition-all duration-300 hover:scale-105"
              style={{
                background: `${currentTheme.bg}80`,
                borderColor: currentTheme.border,
              }}
            >
              <div 
                className="text-2xl mb-2 transition-colors duration-300"
                style={{ color: currentTheme.accent }}
              >
                ⚡
              </div>
              <div 
                className="text-lg font-mono mb-2"
                style={{ color: currentTheme.primary }}
              >
                GAMES
              </div>
              <div 
                className="text-sm opacity-70"
                style={{ color: currentTheme.secondary }}
              >
                Enter the matrix
              </div>
            </Link>

            <Link 
              href="/betademo"
              className="group border rounded-lg p-6 transition-all duration-300 hover:scale-105"
              style={{
                background: `${currentTheme.bg}80`,
                borderColor: currentTheme.border,
              }}
            >
              <div 
                className="text-2xl mb-2 transition-colors duration-300"
                style={{ color: currentTheme.accent }}
              >
                🌀
              </div>
              <div 
                className="text-lg font-mono mb-2"
                style={{ color: currentTheme.primary }}
              >
                EXPERIENCE
              </div>
              <div 
                className="text-sm opacity-70"
                style={{ color: currentTheme.secondary }}
              >
                Immerse yourself
              </div>
            </Link>

            <div 
              className="border rounded-lg p-6 transition-all duration-300 cursor-not-allowed opacity-50"
              style={{
                background: `${currentTheme.bg}80`,
                borderColor: currentTheme.border,
              }}
            >
              <div 
                className="text-2xl mb-2"
                style={{ color: currentTheme.accent }}
              >
                🔮
              </div>
              <div 
                className="text-lg font-mono mb-2"
                style={{ color: currentTheme.primary }}
              >
                UNKNOWN
              </div>
              <div 
                className="text-sm opacity-70"
                style={{ color: currentTheme.secondary }}
              >
                Coming soon...
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div 
            className="flex items-center justify-center space-x-2"
            style={{ color: currentTheme.accent }}
          >
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentTheme.accent }}
            ></div>
            <span className="text-sm font-mono">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              backgroundColor: currentTheme.accent,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </main>
  );
}