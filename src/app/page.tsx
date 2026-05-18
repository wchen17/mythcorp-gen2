// src/app/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * NEXUS - Entry Point
 */
export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [glitchText, setGlitchText] = useState('NEXUS');

  useEffect(() => {
    setMounted(true);
    
    const glitchChars = '▓▒░█▄▀▐▌';
    const originalText = 'NEXUS';
    let timeoutId: NodeJS.Timeout;

    const glitch = () => {
      if (Math.random() > 0.95) {
        let newText = '';
        for (let i = 0; i < originalText.length; i++) {
          if (Math.random() > 0.7) {
            newText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            newText += originalText[i];
          }
        }
        setGlitchText(newText);
        setTimeout(() => setGlitchText(originalText), 100);
      }
      timeoutId = setTimeout(glitch, 200);
    };

    glitch();
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-2xl font-mono">▓▓▓</div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) grayscale(0.8) brightness(0.3)',
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-16 gap-px h-full">
          {Array.from({ length: 256 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-cyan-400/20 animate-pulse" 
              style={{ 
                animationDelay: `${(i % 16) * 0.05}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        
        {/* Logo */}
        <div className="text-center mb-16">
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 mb-8 select-none">
              {glitchText}
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl font-mono font-bold text-cyan-400/20 blur-lg -z-10">
              NEXUS
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 font-mono mb-4">
            Access the System
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-3/4 mx-auto"></div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
          
          {/* Professional Hub - NEW */}
          <Link href="/professional">
            <div className="group bg-black/50 border border-blue-500/30 hover:border-blue-500/60 rounded-lg p-8 backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/5 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🏢
                </div>
                <h2 className="text-2xl font-mono text-blue-400 mb-4 group-hover:text-blue-300">
                  PROFESSIONAL
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  Interactive control center
                </p>
                <div className="inline-flex items-center text-blue-400 group-hover:text-blue-300 font-mono text-sm">
                  Access 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Mysterious Portal */}
          <Link href="/mysterious">
            <div className="group bg-black/50 border border-cyan-400/30 hover:border-cyan-400/60 rounded-lg p-8 backdrop-blur-sm transition-all duration-300 hover:bg-cyan-400/5 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  ⚡
                </div>
                <h2 className="text-2xl font-mono text-cyan-400 mb-4 group-hover:text-cyan-300">
                  PORTAL
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  Interactive experience awaits
                </p>
                <div className="inline-flex items-center text-cyan-400 group-hover:text-cyan-300 font-mono text-sm">
                  Enter 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Experience */}
          <Link href="/betademo">
            <div className="group bg-black/50 border border-purple-500/30 hover:border-purple-500/60 rounded-lg p-8 backdrop-blur-sm transition-all duration-300 hover:bg-purple-500/5 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🌀
                </div>
                <h2 className="text-2xl font-mono text-purple-400 mb-4 group-hover:text-purple-300">
                  NEXUS
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  3D environment simulation
                </p>
                <div className="inline-flex items-center text-purple-400 group-hover:text-purple-300 font-mono text-sm">
                  Access 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Games */}
          <Link href="/minigame">
            <div className="group bg-black/50 border border-pink-500/30 hover:border-pink-500/60 rounded-lg p-8 backdrop-blur-sm transition-all duration-300 hover:bg-pink-500/5 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🎯
                </div>
                <h2 className="text-2xl font-mono text-pink-400 mb-4 group-hover:text-pink-300">
                  GAMES
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  Incremental progression system
                </p>
                <div className="inline-flex items-center text-pink-400 group-hover:text-pink-300 font-mono text-sm">
                  Start 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          </Link>
          
        </div>

        {/* Status */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex justify-between items-center text-gray-500 text-sm font-mono">
            <div>NEXUS CORP</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>ONLINE</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}
