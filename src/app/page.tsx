// src/app/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * MythCorp Homepage - Clean landing page with navigation to different experiences
 * This serves as the main entry point with clear navigation to beta demo and minigames
 */
export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [glitchText, setGlitchText] = useState('MYTHCORP');

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    
    // Glitch text effect
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const originalText = 'MYTHCORP';
    let timeoutId: NodeJS.Timeout;

    const glitch = () => {
      if (Math.random() > 0.95) { // 5% chance to glitch
        let newText = '';
        for (let i = 0; i < originalText.length; i++) {
          if (Math.random() > 0.7) {
            newText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            newText += originalText[i];
          }
        }
        setGlitchText(newText);
        
        // Reset after short delay
        setTimeout(() => setGlitchText(originalText), 100);
      }
      
      timeoutId = setTimeout(glitch, 200);
    };

    glitch();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-2xl font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) grayscale(0.8) brightness(0.3)',
        }}
      />
      

      {/* Animated Grid Overlay */}
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        
        {/* Main Logo/Title */}
        <div className="text-center mb-16">
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 mb-8 select-none">
              {glitchText}
            </h1>
            {/* Glow effect */}
            <div className="absolute inset-0 text-8xl md:text-9xl font-mono font-bold text-cyan-400/20 blur-lg -z-10">
              MYTHCORP
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 font-mono mb-4">
            Enter the Digital Frontier
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-3/4 mx-auto"></div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          
          {/* Beta Demo Card */}
          <Link href="/betademo">
            <div className="group bg-black/50 border border-cyan-400/30 hover:border-cyan-400/60 rounded-lg p-8 backdrop-blur-sm transition-all duration-300 hover:bg-cyan-400/5 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🌟
                </div>
                <h2 className="text-2xl font-mono text-cyan-400 mb-4 group-hover:text-cyan-300">
                  BETA EXPERIENCE
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Immerse yourself in our interactive 3D environment. Explore the rotating spectre model, 
                  navigate through stars, and experience the future of digital interaction.
                </p>
                <div className="inline-flex items-center text-cyan-400 group-hover:text-cyan-300 font-mono text-sm">
                  Enter Experience 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Minigame Card */}
          <Link href="/minigame">
            <div className="group bg-black/50 border border-purple-500/30 hover:border-purple-500/60 rounded-lg p-8 backdrop-blur-sm transition-all duration-300 hover:bg-purple-500/5 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🎮
                </div>
                <h2 className="text-2xl font-mono text-purple-400 mb-4 group-hover:text-purple-300">
                  MINIGAMES
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Challenge yourself with neural puzzles, cyber racing, and reality-shifting adventures. 
                  Mind-bending games that push the boundaries of digital entertainment.
                </p>
                <div className="inline-flex items-center text-purple-400 group-hover:text-purple-300 font-mono text-sm">
                  Coming Soon 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          </Link>
          
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex justify-between items-center text-gray-500 text-sm font-mono">
            <div>© 2024 MythCorp Industries</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Systems Online</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}
