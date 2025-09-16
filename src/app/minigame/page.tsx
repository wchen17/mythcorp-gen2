// src/app/minigame/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * Incremental Clicker Game - Simple but addictive
 */
export default function MinigamePage() {
  const [points, setPoints] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'neon'>('dark');

  // Auto-clicker effect
  useEffect(() => {
    if (autoClickers > 0) {
      const interval = setInterval(() => {
        setPoints(prev => prev + autoClickers);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoClickers]);

  const handleClick = () => {
    setPoints(prev => prev + clickPower);
  };

  const buyClickPower = () => {
    const cost = clickPower * 10;
    if (points >= cost) {
      setPoints(prev => prev - cost);
      setClickPower(prev => prev + 1);
    }
  };

  const buyAutoClicker = () => {
    const cost = (autoClickers + 1) * 50;
    if (points >= cost) {
      setPoints(prev => prev - cost);
      setAutoClickers(prev => prev + 1);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'neon' : 'dark');
  };

  const themeStyles = {
    dark: {
      bg: 'bg-black',
      text: 'text-white',
      accent: 'text-cyan-400',
      button: 'bg-gray-800 hover:bg-gray-700 border-gray-600',
      clickBtn: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
    },
    neon: {
      bg: 'bg-gray-900',
      text: 'text-green-300',
      accent: 'text-green-400',
      button: 'bg-green-900 hover:bg-green-800 border-green-500',
      clickBtn: 'bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600'
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <main className={`h-screen w-screen ${currentTheme.bg} relative overflow-hidden`}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-8 gap-px h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div 
              key={i} 
              className={`${currentTheme.accent.replace('text-', 'bg-')}/20 animate-pulse`}
              style={{ 
                animationDelay: `${(i % 8) * 0.2}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Link 
          href="/"
          className={`${currentTheme.button} ${currentTheme.text} border px-4 py-2 rounded-md transition-all duration-300 backdrop-blur-sm`}
        >
          ← Return
        </Link>
        <button
          onClick={toggleTheme}
          className={`${currentTheme.button} ${currentTheme.accent} border px-4 py-2 rounded-md transition-all duration-300 backdrop-blur-sm`}
        >
          {theme === 'dark' ? '⚡' : '🔮'} Theme
        </button>
      </div>

      {/* Game UI */}
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-4xl px-8">
          {/* Title */}
          <h1 className={`text-5xl md:text-7xl font-mono font-bold ${currentTheme.accent} mb-8`}>
            NEXUS CLICKER
          </h1>

          {/* Stats Display */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/50 border border-gray-600 rounded-lg p-4 backdrop-blur-sm">
              <div className={`text-2xl font-mono ${currentTheme.accent}`}>{points.toLocaleString()}</div>
              <div className={`text-sm ${currentTheme.text} opacity-70`}>Points</div>
            </div>
            <div className="bg-black/50 border border-gray-600 rounded-lg p-4 backdrop-blur-sm">
              <div className={`text-2xl font-mono ${currentTheme.accent}`}>{clickPower}</div>
              <div className={`text-sm ${currentTheme.text} opacity-70`}>Click Power</div>
            </div>
            <div className="bg-black/50 border border-gray-600 rounded-lg p-4 backdrop-blur-sm">
              <div className={`text-2xl font-mono ${currentTheme.accent}`}>{autoClickers}</div>
              <div className={`text-sm ${currentTheme.text} opacity-70`}>Auto/Sec</div>
            </div>
          </div>

          {/* Main Click Button */}
          <div className="mb-8">
            <button
              onClick={handleClick}
              className={`${currentTheme.clickBtn} ${currentTheme.text} text-4xl font-mono px-12 py-8 rounded-full transition-all duration-150 hover:scale-105 active:scale-95 shadow-lg`}
            >
              CLICK
            </button>
          </div>

          {/* Upgrades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={buyClickPower}
              disabled={points < clickPower * 10}
              className={`${currentTheme.button} ${currentTheme.text} border px-6 py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-lg font-mono">Power Up</div>
              <div className="text-sm opacity-70">Cost: {(clickPower * 10).toLocaleString()}</div>
            </button>
            <button
              onClick={buyAutoClicker}
              disabled={points < (autoClickers + 1) * 50}
              className={`${currentTheme.button} ${currentTheme.text} border px-6 py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-lg font-mono">Auto Clicker</div>
              <div className="text-sm opacity-70">Cost: {((autoClickers + 1) * 50).toLocaleString()}</div>
            </button>
          </div>

          {/* Progress indicator */}
          <div className={`mt-8 flex items-center justify-center space-x-2 ${currentTheme.accent}`}>
            <div className={`w-2 h-2 ${currentTheme.accent.replace('text-', 'bg-')} rounded-full animate-ping`}></div>
            <span className="text-sm font-mono">SYSTEM ACTIVE</span>
          </div>
        </div>
      </div>
    </main>
  );
}