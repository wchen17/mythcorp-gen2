// src/app/mysterious/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ThemeType, getTheme, toggleTheme as toggleThemeUtil } from '../lib/themes';

/**
 * Mysterious Page - Interactive experience with Chicago skyline background
 * Features mouse-responsive background, theme switching, and mysterious content
 */
export default function MysteriousPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<ThemeType>('cool');
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

  const handleToggleTheme = () => {
    setTheme(prev => toggleThemeUtil(prev));
  };

  const currentTheme = getTheme(theme);

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
          filter: `blur(${theme === 'cool' ? '3px' : '1px'}) brightness(${theme === 'cool' ? '0.4' : '0.6'}) contrast(${theme === 'cool' ? '1.2' : '1.5'})`,
          transform: `scale(${1.1 + mousePos.x * 0.0005}) rotate(${(mousePos.x - 50) * 0.02}deg)`,
        }}
      />

      {/* Overlay Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${currentTheme.primary}22 0%, transparent 50%)`,
        }}
      />

      {/* Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          href="/"
          className="backdrop-blur-md border transition-all duration-300 px-4 py-2 rounded-md"
          style={{
            background: currentTheme.background,
            borderColor: currentTheme.border,
            color: currentTheme.text,
          }}
        >
          ← Return
        </Link>
      </div>

      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleToggleTheme}
          className="backdrop-blur-md border transition-all duration-300 px-4 py-2 rounded-md"
          style={{
            background: currentTheme.background,
            borderColor: currentTheme.border,
            color: currentTheme.primary,
          }}
        >
          {theme === 'cool' ? '◐' : '◑'} {currentTheme.name}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full relative z-10">
        <div 
          className="text-center max-w-4xl px-8 backdrop-blur-lg border rounded-lg p-12 transition-all duration-500"
          style={{
            background: currentTheme.background,
            borderColor: currentTheme.border,
            transform: `translateY(${mousePos.y * 0.1 - 5}px) translateX(${mousePos.x * 0.05 - 2.5}px)`,
          }}
        >
          {/* Main Title with Glitch Effect */}
          <div className="mb-8">
            <h1 
              className="text-7xl md:text-9xl font-mono font-bold mb-4 transition-all duration-300"
              style={{ 
                color: currentTheme.primary,
                textShadow: `0 0 20px ${currentTheme.primary}66`,
                filter: `blur(${Math.sin(Date.now() * 0.005) * 0.5 + 0.5}px)`,
              }}
            >
              NEXUS
            </h1>
            <div 
              className="text-lg font-mono tracking-widest"
              style={{ color: currentTheme.textSecondary }}
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
                background: `${currentTheme.background}80`,
                borderColor: currentTheme.border,
              }}
            >
              <div 
                className="text-2xl mb-2 transition-colors duration-300"
                style={{ color: currentTheme.primary }}
              >
                ⚡
              </div>
              <div 
                className="text-lg font-mono mb-2"
                style={{ color: currentTheme.text }}
              >
                GAMES
              </div>
              <div 
                className="text-sm opacity-70"
                style={{ color: currentTheme.textSecondary }}
              >
                Enter the matrix
              </div>
            </Link>

            <Link 
              href="/betademo"
              className="group border rounded-lg p-6 transition-all duration-300 hover:scale-105"
              style={{
                background: `${currentTheme.background}80`,
                borderColor: currentTheme.border,
              }}
            >
              <div 
                className="text-2xl mb-2 transition-colors duration-300"
                style={{ color: currentTheme.primary }}
              >
                🌀
              </div>
              <div 
                className="text-lg font-mono mb-2"
                style={{ color: currentTheme.text }}
              >
                EXPERIENCE
              </div>
              <div 
                className="text-sm opacity-70"
                style={{ color: currentTheme.textSecondary }}
              >
                Immerse yourself
              </div>
            </Link>

            <div 
              className="border rounded-lg p-6 transition-all duration-300 cursor-not-allowed opacity-50"
              style={{
                background: `${currentTheme.background}80`,
                borderColor: currentTheme.border,
              }}
            >
              <div 
                className="text-2xl mb-2"
                style={{ color: currentTheme.primary }}
              >
                🔮
              </div>
              <div 
                className="text-lg font-mono mb-2"
                style={{ color: currentTheme.text }}
              >
                UNKNOWN
              </div>
              <div 
                className="text-sm opacity-70"
                style={{ color: currentTheme.textSecondary }}
              >
                Coming soon...
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div 
            className="flex items-center justify-center space-x-2"
            style={{ color: currentTheme.primary }}
          >
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentTheme.primary }}
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
              backgroundColor: currentTheme.primary,
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